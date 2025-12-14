# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your AI Note Taker app.

## ✅ What's Already Configured

The following has been set up for you:

1. **Clerk Package Installed**: `@clerk/nextjs` is installed
2. **Middleware**: `middleware.ts` with `clerkMiddleware()` configured
3. **Layout**: `app/layout.tsx` wrapped with `<ClerkProvider>`
4. **Sign-In Page**: `/sign-in` route created
5. **Sign-Up Page**: `/sign-up` route created
6. **Navbar**: Updated with authentication buttons and `<UserButton>`

## 🚀 Getting Started with Clerk

### Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### Step 2: Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

### Step 3: Configure Environment Variables

Update your `.env.local` file with your Clerk keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Step 4: Configure Clerk Dashboard

In your Clerk Dashboard, configure the following:

1. **Paths** (under "Paths" in settings):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

2. **Social Connections** (optional):
   - Enable Google, GitHub, etc. if desired

3. **Email/Password** (recommended):
   - Enable email/password authentication

### Step 5: Restart Your Dev Server

```bash
npm run dev
```

## 🎯 How It Works

### Public Routes
These routes are accessible without authentication:
- `/` - Landing page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes
All other routes require authentication. The middleware will automatically redirect unauthenticated users to `/sign-in`.

### Authentication Components

**In the Navbar:**
- `<SignedOut>` - Shows "Sign In" and "Get Started" buttons when not authenticated
- `<SignedIn>` - Shows "Dashboard" link and `<UserButton>` when authenticated
- `<UserButton>` - Displays user avatar with dropdown menu (profile, sign out, etc.)

## 📝 Usage Examples

### Protecting a Page

All pages except public routes are automatically protected by the middleware.

### Getting User Data in Server Components

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Your user ID: {userId}</p>
    </div>
  );
}
```

### Getting User Data in Client Components

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export default function Profile() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Hello, {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

### Checking Authentication in API Routes

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your protected API logic here
  return NextResponse.json({ data: 'Protected data' });
}
```

## 🔒 Security Features

Clerk automatically provides:
- ✅ Secure password hashing
- ✅ Email verification
- ✅ Multi-factor authentication (MFA)
- ✅ Session management
- ✅ CSRF protection
- ✅ Rate limiting

## 🎨 Customization

You can customize the appearance of Clerk components:

```typescript
<SignIn 
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-xl border border-zinc-200",
      headerTitle: "text-2xl font-bold",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    },
  }}
/>
```

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js App Router Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Customization Guide](https://clerk.com/docs/components/customization/overview)

## 🆘 Troubleshooting

### "Missing Clerk keys" error
- Make sure you've added your keys to `.env.local`
- Restart your dev server after adding environment variables

### Sign-in redirects not working
- Check that your Clerk Dashboard paths match your app routes
- Verify environment variables are set correctly

### Middleware not protecting routes
- Ensure `middleware.ts` is in the root directory (not in `app/`)
- Check that the matcher config is correct

## ✨ Next Steps

1. Get your Clerk API keys from [clerk.com](https://clerk.com)
2. Update `.env.local` with your keys
3. Restart your dev server
4. Visit `/sign-up` to create your first user
5. Build your dashboard and protected features!

