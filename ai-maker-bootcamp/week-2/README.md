# Week 2 Projects - AI Maker Bootcamp

This folder contains the projects completed during Week 2 of the AI Maker Bootcamp, focusing on full-stack development with modern frameworks.

## Projects

### 📝 AI Note Taker

A comprehensive full-stack note-taking application with AI integration, authentication, and advanced features.

**Features:**
- 🔐 User authentication with Clerk
- 🤖 AI-powered note generation and summarization using OpenAI
- ✍️ Rich text editing with formatting toolbar
- 🎤 Speech-to-text functionality
- 📚 Section-based organization (notebook structure)
- 📊 Dashboard with note management
- 👥 Admin panel for user management
- 🎨 Modern, responsive UI design

**Technologies:**
- **Frontend:** Next.js 14, TypeScript, React
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** Prisma (supports PostgreSQL, MySQL, SQLite)
- **Authentication:** Clerk
- **AI Integration:** OpenAI API
- **Styling:** Tailwind CSS

**Project Structure:**
```
ai-note-taker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── ai/            # AI endpoints (generate, summarize)
│   │   ├── notes/         # Note CRUD operations
│   │   └── sections/      # Section management
│   ├── dashboard/         # Dashboard page
│   ├── admin/             # Admin panel
│   ├── sign-in/           # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   └── landing/           # Landing page components
├── lib/                   # Utility libraries
│   └── prisma.ts          # Prisma client
├── prisma/                # Database schema
│   └── schema.prisma
└── public/                # Static assets
```

**Setup Instructions:**

1. **Install Dependencies:**
   ```bash
   cd ai-note-taker
   npm install
   ```

2. **Set Up Environment Variables:**
   Create a `.env.local` file with:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key

   # Database (Prisma)
   DATABASE_URL=your_database_url
   ```

3. **Set Up Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

**Documentation Files:**
- `AI_INTEGRATION.md` - Guide for setting up AI features
- `CLERK_SETUP.md` - Authentication setup instructions
- `DASHBOARD_SETUP.md` - Dashboard configuration guide
- `FEATURES_UPDATE.md` - Complete feature list and updates
- `RICH_TEXT_EDITING.md` - Rich text editor documentation
- `SPEECH_TO_TEXT.md` - Speech-to-text feature guide

**Key Features Explained:**

### AI Note Generation
- Generate notes from simple prompts
- AI creates well-structured, organized content
- Automatic title suggestions
- Content summarization

### Section Management
- Organize notes by subject/category
- Custom section names, emojis, and colors
- Filter notes by section
- Visual indicators on note cards

### Rich Text Editing
- Font family selection (Sans Serif, Serif, Monospace, Cursive)
- Font size customization (12px to 32px)
- Font color picker
- Live preview in editor
- Formatting preserved when viewing

### Authentication & Authorization
- Secure user authentication with Clerk
- Protected routes and API endpoints
- User-specific note storage
- Admin panel for user management

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern ORM for database access
- **Clerk** - Authentication and user management
- **OpenAI API** - AI-powered content generation
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

## Getting Started

Each project in this folder is self-contained. Navigate to the project directory and follow the setup instructions in the project's README or documentation files.

## Project Structure

```
week-2/
└── ai-note-taker/
    ├── app/                    # Next.js application
    ├── components/             # React components
    ├── lib/                    # Utility functions
    ├── prisma/                 # Database schema
    ├── public/                 # Static assets
    ├── .gitignore             # Git ignore rules
    ├── package.json           # Dependencies
    ├── tsconfig.json          # TypeScript config
    └── README.md              # Project documentation
```

## Notes

- All projects use modern JavaScript/TypeScript
- Projects focus on full-stack development patterns
- Each project demonstrates different aspects of web development
- Environment variables are required for full functionality
- Check individual project documentation for detailed setup instructions

