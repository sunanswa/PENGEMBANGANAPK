# ATS Aplikasi (Applicant Tracking System)

## Overview

This is a modern web application built with React and TypeScript that functions as an Applicant Tracking System (ATS). The system provides separate interfaces for job applicants and recruiters, allowing job posting management, application tracking, and user authentication. The application is designed with a full-stack architecture using Express.js backend and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessible, customizable components
- **State Management**: React hooks with TanStack Query for server state management
- **Authentication**: Supabase Auth with Express.js backend API integration
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database) with Supabase backend
- **Storage**: PostgreSQL database with Drizzle ORM for data persistence
- **API Design**: RESTful API with `/api` prefix routing for job postings and authentication
- **Environment**: Fully configured for Replit deployment with hot reload support

## Key Components

### Authentication System
- **Dual Role Support**: Separate dashboards for applicants and recruiters
- **Supabase Integration**: OAuth and email/password authentication
- **Development Mode**: Mock authentication client for environments without Supabase configuration
- **Role-based Access**: User profiles with role differentiation

### Job Management System
- **Job Posting CRUD**: Create, read, update, delete job postings
- **Multi-location Support**: Jobs can have multiple location assignments
- **Status Management**: Active/inactive job posting states
- **Rich Content**: Support for detailed job descriptions and requirements

### User Interface Components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Form Management**: React Hook Form with Zod validation
- **Loading States**: Comprehensive loading screens and progress indicators
- **Progressive Enhancement**: Graceful degradation for various screen sizes

### Database Schema
- **Users Table**: Core user authentication and profile data
- **Job Postings**: Comprehensive job listing with location arrays
- **Type Safety**: Drizzle-generated types with Zod schema validation

## Data Flow

### Authentication Flow
1. User selects role (applicant/recruiter) on landing page
2. Authentication through Supabase or mock client
3. Role verification and profile creation/retrieval
4. Dashboard routing based on user role

### Job Management Flow
1. Recruiters create/edit job postings through form interface
2. Data validation using Zod schemas
3. Database operations through Drizzle ORM
4. Real-time updates reflected in both dashboards

### Application Process
1. Applicants browse active job postings
2. Detailed job view with application capabilities
3. Search and filter functionality for job discovery
4. Application tracking and status management

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@supabase/supabase-js**: Authentication and backend services
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation

### UI Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: Support for local development configuration

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild creates single-file Node.js bundle
- **Database**: PostgreSQL with connection pooling
- **Deployment**: Single server deployment with static file serving

### Configuration Requirements
- **DATABASE_URL**: PostgreSQL connection string (optional with in-memory fallback)
- **VITE_SUPABASE_URL**: Supabase project URL (configured)
- **VITE_SUPABASE_ANON_KEY**: Supabase anonymous key (configured)

## Recent Changes (January 2025)

### Migration from Bolt to Replit
- ✓ Successfully migrated ATS application from Bolt.new to Replit environment
- ✓ Configured Express.js backend with RESTful API endpoints
- ✓ Updated frontend to use TanStack Query for state management
- ✓ Integrated Supabase authentication with Express backend
- ✓ Set up in-memory storage with sample job posting data
- ✓ Configured environment variables for Supabase integration
- ✓ Verified application functionality across all major components

### Key Migration Changes
- Replaced direct Supabase client calls with backend API endpoints
- Implemented comprehensive job posting CRUD operations
- Updated authentication flow to work with both mock and real Supabase
- Enhanced error handling and loading states throughout the application
- Maintained existing UI/UX while improving backend architecture

### Advanced Dashboard Features (January 2025)
- ✓ Comprehensive Admin Dashboard with 4 main sections
- ✓ Advanced Applicants Management with status tracking
- ✓ Analytics & Reporting with performance metrics
- ✓ System Settings with user management and configurations
- ✓ Interactive statistics with real-time data visualization
- ✓ Email template management and notifications
- ✓ User role management and system monitoring

### Fallback Strategies
- **Development Mode**: Mock Supabase client when configuration is missing
- **In-Memory Storage**: Fallback storage implementation for development
- **Graceful Degradation**: Application functions with reduced features when external services are unavailable

The application is designed to be flexible and maintainable, with clear separation of concerns between frontend and backend, comprehensive type safety, and robust error handling throughout the system.