# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Todoist clone built with:
- **Frontend & Backend**: Next.js 15 with App Router and TypeScript
- **Database**: Neon Postgres with serverless driver
- **Authentication**: Neon Auth (Stack Auth integration)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel

### Key Features
- User authentication (sign up, sign in, logout)
- Todo CRUD operations (per user)
- Label system (personal, work, fun, etc.)
- No todo sharing between users
- Responsive UI with dark/light mode support

### Project Structure
- **src/app/**: Next.js App Router pages and API routes
- **src/components/**: Reusable React components
- **src/components/ui/**: shadcn/ui components
- **src/components/todos/**: Todo-specific components
- **src/lib/**: Utility functions and database operations

### Database Schema
- **todos**: id, title, description, completed, label_id, user_id, created_at, updated_at, due_date
- **labels**: id, name, color, created_at (pre-populated with personal, work, fun)

### API Routes
- `GET/POST /api/todos` - List/create todos
- `PATCH/DELETE /api/todos/[id]` - Update/delete specific todo
- `GET /api/labels` - List available labels

### Authentication Flow
- Landing page redirects authenticated users to dashboard
- Stack Auth handles sign-up/sign-in at `/handler/*` routes
- Dashboard requires authentication, redirects to sign-in if not authenticated

### Environment Variables Required
- `DATABASE_URL` - Neon database connection string
- `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth client key
- `STACK_SECRET_SERVER_KEY` - Stack Auth server key

### Development Guidelines
- Use React Server Components when possible
- Follow TypeScript strict mode (no `any` types)
- Use shadcn/ui for UI components
- Each todo belongs to one user only
- Database queries use Neon's serverless SQL driver