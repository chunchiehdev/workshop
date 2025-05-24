# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite hot reload (frontend only)
- `npm run dev:server` - Start Express backend server (required for AI Science Q&A feature)
- `npm run dev:full` - Start both frontend and backend servers concurrently
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Architecture Overview

This is a React + TypeScript application built with Vite, designed as a teaching/learning platform with bot creation and chat functionality.

### Core Technology Stack
- **Frontend**: React 19, TypeScript, Vite with SWC
- **UI Framework**: TailwindCSS 4 with Radix UI components
- **State Management**: Zustand for local state, TanStack Query for server state
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors

### Application Structure

**Main Application Flow**:
- Entry point: `src/main.tsx` sets up React Query and renders the app
- Router: `src/App.tsx` defines all routes within a Layout wrapper
- Layout: Sidebar navigation with header and main content area

**Key Feature Areas**:
1. **Bot Management** (`src/pages/bots/`, `src/services/botService.ts`)
   - Create, edit, view, and chat with AI bots
   - Multi-step bot creation form with prompt generation
   - Bot state managed via Zustand store (`src/store/botStore.ts`)

2. **AI Science Q&A** (`src/pages/science-qa/`, `server/index.js`)
   - Interactive science question-answering system with intelligent flow
   - Uses Google Gemini API for natural language processing
   - Multi-step conversation flow: science relevance check → completeness check → guidance or confirmation → final answer
   - Express.js backend for secure API key handling and conversation logic
   - Rich markdown rendering for AI responses with syntax highlighting, lists, headers, etc.

3. **Chat System** (`src/services/chatService.ts`, `src/hooks/useChatMessages.ts`)
   - Real-time chat interface with bots
   - Message state management and typing effects

4. **API Integration** (`src/services/api.ts`)
   - Centralized axios client with base URL: `https://teachbot.grading.software`
   - Global error handling via response interceptors
   - Local Express server proxy for AI Science Q&A feature

**Component Organization**:
- `src/components/ui/` - Radix-based reusable UI components
- `src/components/layout/` - Application layout components (Header, Sidebar, Layout)
- `src/components/bots/` - Bot-specific multi-step form components
- `src/components/form/` - Generic form components

**State Management Pattern**:
- Server state: TanStack Query with custom hooks in `src/services/queryHooks.ts`
- Local UI state: Zustand stores (currently `botStore.ts`)
- Form state: React Hook Form with Zod validation

### Path Aliases
- `@/*` maps to `./src/*` (configured in vite.config.ts and tsconfig.json)

### Key Dependencies
- UI: Radix UI primitives with custom styling
- State: TanStack Query + Zustand
- Forms: React Hook Form + Zod
- Styling: TailwindCSS with class-variance-authority for component variants and Typography plugin
- Utils: Lodash, date-fns, clsx/tailwind-merge for className handling
- AI: Google Generative AI SDK (@google/generative-ai)
- Backend: Express.js with CORS support
- Markdown: react-markdown + remark-gfm for rich text rendering in AI responses

### Environment Configuration
- `GEMINI_API_KEY` - Required for AI Science Q&A feature (configured in .env)
- Backend server runs on port 3001, frontend on port 5173 (default Vite)
- Vite dev server proxies `/api/*` requests to the backend

## Memories
- to memorize