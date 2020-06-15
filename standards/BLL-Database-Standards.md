# Blue Label Labs - API Design Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

### 1. Unless approved by the BLL Engineering Staff, or through the use of Firestore, only relational databases should be used and either SQL Server or PostgreSQL.

### 2. All databases must be documented properly through the a ER diagram outlining all major types, column names, references and cardinality constraints. All documentation **must** be done using LucidChart or other approved drawing program.

### 3. As a rule, we **should** fully normalize all data structures. However, in certain cases, slightly de-normalized structures can be used to facilitate performance and concurrency.

## Design Standards
### 1 . All boolean fields **must** be named as a question that has a yes/no answer. (ie. do not use 'Disabled', instead use 'IsDisabled')

### 2. All DateTime fields **must** be named with the word "Date" as a prefix, and store UTC values only. (ie. do not use 'CreatedAt', instead use 'DateCreated')

### 3. All enumerated constant values should be represented by a 32-bit integer field, with the first constant set at the 0 value.

### 4. All tables **must** contain a DateCreated and DateModified field which will be updated accordingly by the API layer.

### 5. All primary key fields **must** use a 64-bit integer. **Do not** ever use a GUID as the primary key identifier.

### 6. All indexes deployed on production **must** be documented centrally in a Google document and maintained with all updates/adds/deletes to indexes.

### 7. Tables should be named in TitleCase, with all field names being represented in TitleCase as well. **Do not** use underscores or hyphens within the field names.

### 8. Unencrypted passwords **must** never be stored in the database. If passwords are to be stored, they **must** be hashed/salted using the BCrypt algorithm.
