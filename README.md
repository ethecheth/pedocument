# Wiki MDX Editor

This project is a simple Wiki system built with Next.js (App Router), MDX, Prisma and Tailwind CSS. It allows creating and editing pages stored in a PostgreSQL database using Prisma ORM.

## Features

- List all wiki pages at `/wiki` with title and last updated time.
- View a page at `/wiki/[slug]` rendered from MDX stored in the database.
- Create a new page at `/wiki/new` or edit existing pages at `/wiki/edit/[slug]` using a Markdown editor with live preview.
- API routes to fetch and save pages using Prisma.
- Responsive UI styled with Tailwind CSS.

## Prisma Schema

```
model WikiPage {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String
  updatedAt DateTime @updatedAt
}
```

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

The application expects a `DATABASE_URL` environment variable pointing to a PostgreSQL database. Run `npx prisma migrate dev` to create the schema.

## License

MIT
