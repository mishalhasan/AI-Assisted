# Database Setup

## Schema Overview

This app uses PostgreSQL with Prisma ORM. The schema is simple and straightforward:

### Tables

**User**
- `id` - Unique identifier (cuid)
- `email` - User's email (unique)
- `name` - Optional user name
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `notes` - Relation to user's notes

**Note**
- `id` - Unique identifier (cuid)
- `title` - Note title
- `content` - Note content (text field)
- `createdAt` - Note creation timestamp
- `updatedAt` - Last update timestamp
- `userId` - Foreign key to User
- `user` - Relation to note owner

## Setup Instructions

### 1. Set up PostgreSQL

Make sure you have PostgreSQL installed and running locally, or use a hosted service like:
- [Neon](https://neon.tech) (Recommended for development)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- Local PostgreSQL

### 2. Configure Database URL

Update your `.env.local` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

For local development:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_note_taker?schema=public"
```

### 3. Run Migrations

Create and apply the database schema:

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. (Optional) Seed the Database

You can view your database using Prisma Studio:

```bash
npx prisma studio
```

## Usage

Import the Prisma client in your code:

```typescript
import { prisma } from '@/lib/prisma';

// Create a user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Create a note
const note = await prisma.note.create({
  data: {
    title: 'My First Note',
    content: 'This is the content of my note',
    userId: user.id,
  },
});

// Get all notes for a user
const notes = await prisma.note.findMany({
  where: { userId: user.id },
  orderBy: { updatedAt: 'desc' },
});
```

## Common Commands

- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Open Prisma Studio (GUI)
- `npx prisma db push` - Push schema changes without migrations (dev only)
- `npx prisma migrate reset` - Reset database (WARNING: deletes all data)

