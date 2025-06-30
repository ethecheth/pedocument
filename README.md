# PE Document Wiki System

A modern wiki system built with Next.js, Prisma, and Tailwind CSS for creating and managing documentation.

## Features

- 📝 **Markdown/MDX Editor** - Rich text editing with full MDX support
- 🖼️ **Image Upload** - Drag & drop image uploads
- 📚 **Version History** - Track changes and restore previous versions
- 🔍 **Search & Navigation** - Easy content discovery
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Editor**: SimpleMDE with MDX support
- **File Upload**: React Dropzone
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pedocument
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/pedocument"
   
   # Next.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Upload Settings
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
pedocument/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── wiki/              # Wiki pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## API Endpoints

- `GET /api/wiki` - Get all wiki pages
- `POST /api/wiki` - Create/update wiki page
- `GET /api/wiki/[slug]` - Get specific page
- `POST /api/upload` - Upload images
- `GET /api/wiki/export` - Export pages
- `POST /api/wiki/restore` - Restore version

## Database Schema

### WikiPage
- `id` - Unique identifier
- `title` - Page title
- `slug` - URL-friendly identifier
- `content` - Page content (MDX)
- `updatedAt` - Last update timestamp

### WikiVersion
- `id` - Version identifier
- `pageId` - Reference to WikiPage
- `content` - Version content
- `createdAt` - Version creation timestamp

### Image
- `id` - Image identifier
- `url` - Image URL
- `filename` - Original filename
- `pageId` - Optional page reference

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open database GUI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
