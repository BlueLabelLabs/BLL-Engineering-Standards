# Blue Label Labs - Date & Time Standards
- Author: [Bobby Gill](https://www.bluelabellabs.com/team/bobby-gill/), [Dulio Denis](https://www.bluelabellabs.com/team/dulio-denis/)
- Version: 1.0
---

## Date & Time Standards

### 1. All date/times should be represented and stored in UTC format in all backend databases. In general, all APIs should be returning date/times in UTC and only accepting dates represented in UTC.
- If a date/time needs to be presented to the user in a local time zone, then the time zone offset should be stored alongside the UTC date/time stamp in the database.
