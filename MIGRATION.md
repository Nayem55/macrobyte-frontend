# Macrobyte migration

The existing root application remains the live, unchanged implementation during migration.

Target structure mirrors LaamOfficial:

- `Macrobyte-frontend/`: Vite, React, React Router, page and component folders.
- `Macrobyte-backend/`: Express and MongoDB API.

The next migration steps are to move the existing API from `server.js` into `Macrobyte-backend`, then port each existing public and admin screen to matching React routes with visual regression checks. No UI or content changes are part of this work.
