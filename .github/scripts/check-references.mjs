/**
 * Check that this repository is internally consistent.
 *
 *   node .github/scripts/check-references.mjs [repo-root]
 *
 * Three things, all of which have broken here before:
 *
 *   1. every guideline ID referenced anywhere exists in the catalog
 *   2. every link into the catalog lands on a heading that exists
 *   3. every relative link points at a file that exists
 *
 * The first is the one that earns its keep. Retiring an ID leaves references
 * that a file-based link checker cannot see, because the file it points at is
 * still there. That has happened twice.
 *
 * Deliberately not here: the sanitization check that keeps internal references
 * out of published text. That runs in the private methodology repo, before
 * anything is written, because publishing the list of things we scan for would
 * hand it to the people it guards against.
 */

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const PREFIXES = ['AGT', 'SEC', 'ARC', 'API', 'DAT', 'AI', 'OPS', 'SCM', 'QUA', 'INT']
const ID = `(?:${PREFIXES.join('|')})-\\d{3}`
const ID_RE = new RegExp(`\\b(${ID})\\b`, 'g')
const ROW_RE = new RegExp(`^\\| (${ID}) \\|`, 'gm')

/** GitHub's heading slug. Punctuation is dropped, then each space becomes a hyphen. */
const slug = (heading) =>
  '#' +
  heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/ /g, '-')

/** What publishes is what git tracks. */
function markdownFiles(repo) {
  try {
    const out = execFileSync('git', ['-C', repo, 'ls-files', '*.md', '**/*.md'], {
      encoding: 'utf8',
    })
    const files = out.split('\n').filter(Boolean).map((f) => path.join(repo, f))
    if (files.length) return files
  } catch {
    /* not a checkout; fall through */
  }
  const out = []
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['.git', 'images', 'node_modules'].includes(e.name)) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(p)
    }
  }
  walk(repo)
  return out
}

function main() {
  const repo = path.resolve(process.argv[2] ?? '.')
  const catalogPath = path.join(repo, 'guidelines/README.md')
  if (!fs.existsSync(catalogPath)) {
    console.error(`No catalog at guidelines/README.md (looked under ${repo})`)
    process.exit(1)
  }

  const catalog = fs.readFileSync(catalogPath, 'utf8')
  const defined = new Set([...catalog.matchAll(ROW_RE)].map((m) => m[1]))
  const anchors = new Set([...catalog.matchAll(/^## (.+)$/gm)].map((m) => slug(m[1])))

  const problems = []
  const files = markdownFiles(repo)

  for (const file of files) {
    const rel = path.relative(repo, file)
    const text = fs.readFileSync(file, 'utf8')

    for (const id of new Set([...text.matchAll(ID_RE)].map((m) => m[1]))) {
      if (!defined.has(id)) {
        problems.push(`${rel}: references ${id}, which is not in the catalog`)
      }
    }

    for (const [, , link] of text.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:)/.test(link)) continue
      const [target, hash] = link.split('#')

      if (!target) {
        // same-file anchor; only the catalog's own headings are known here
        if (hash && file === catalogPath && !anchors.has('#' + hash)) {
          problems.push(`${rel}: bad anchor -> #${hash}`)
        }
        continue
      }

      const resolved = path.resolve(path.dirname(file), target)
      if (!fs.existsSync(resolved)) {
        problems.push(`${rel}: broken link -> ${link}`)
      } else if (hash && resolved === catalogPath && !anchors.has('#' + hash)) {
        problems.push(`${rel}: bad catalog anchor -> #${hash}`)
      }
    }
  }

  const byDomain = {}
  for (const id of defined) {
    const d = id.split('-')[0]
    byDomain[d] = (byDomain[d] ?? 0) + 1
  }

  console.log(`${defined.size} guidelines across ${Object.keys(byDomain).length} domains`)
  console.log(
    Object.entries(byDomain)
      .sort((a, b) => b[1] - a[1])
      .map(([d, n]) => `${d} ${n}`)
      .join(' · ')
  )
  console.log(`${files.length} published markdown files checked`)

  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`)
    for (const p of problems) console.error(`  ${p}`)
    process.exit(1)
  }
  console.log('\nNo problems.')
}

main()
