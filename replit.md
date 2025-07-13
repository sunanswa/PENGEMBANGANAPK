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

## Recent Changes (July 2025)

### PT SWAPRO Branding & Enhanced UI/UX Implementation (July 13, 2025)
- ✓ Complete company rebranding to PT SWAPRO with integrated logo
- ✓ Custom color scheme based on SWAPRO logo (Purple, Orange, Blue gradient)
- ✓ Enhanced SwaprosHeader component with gradient background and logo
- ✓ New EnhancedJobCard with modern design, animations, and micro-interactions
- ✓ Custom CSS utilities for SWAPRO brand consistency
- ✓ Improved gradient backgrounds and enhanced visual hierarchy
- ✓ Better responsive design with mobile-first approach
- ✓ Enhanced button styles with SWAPRO gradient themes
- ✓ Custom scrollbar styling with brand colors
- ✓ Loading animations and hover effects throughout the app

### UI/UX Improvements Implemented:
- ✓ Consistent gradient themes (Purple to Orange) matching company branding
- ✓ Enhanced card designs with depth, shadows, and hover animations
- ✓ Improved typography with Inter font family
- ✓ Better spacing, padding, and visual rhythm
- ✓ Enhanced job card layouts with company verification badges
- ✓ Match percentage indicators and urgency badges
- ✓ Glassmorphism effects on search and filter components
- ✓ Smooth transitions and transform effects
- ✓ Professional color palette with accessibility considerations

## Recent Changes (July 2025)

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

### Advanced Dashboard Features (July 2025)
- ✓ Comprehensive Admin Dashboard with 4 main sections
- ✓ Advanced Applicants Management with status tracking
- ✓ Analytics & Reporting with performance metrics
- ✓ System Settings with user management and configurations
- ✓ Interactive statistics with real-time data visualization
- ✓ Email template management and notifications
- ✓ User role management and system monitoring

### Full System Activation (July 12, 2025)
- ✓ All system features now fully activated and operational
- ✓ Complete PostgreSQL database integration with Drizzle ORM
- ✓ Status update enhancements with optional notes functionality
- ✓ SLIK credit check integration for employee status validation
- ✓ Advanced analytics with AI insights and predictions
- ✓ Multi-channel communication hub (Email, SMS, WhatsApp)
- ✓ Enhanced applicant management with filtering and bulk actions
- ✓ Interview scheduling system with automated workflows
- ✓ Security audit logging and real-time data synchronization
- ✓ Feature activation system with visual progress indicators
- ✓ Full API endpoint verification and testing completed

### Dynamic Application Form Implementation (July 12, 2025)
- ✓ Comprehensive 40+ field application form with 4-5 dynamic steps
- ✓ Step 1: Personal data (name, NIK, phone, family details, etc.)
- ✓ Step 2: Address information (KTP, domicile, regional details)
- ✓ Step 3: Education background and basic experience question
- ✓ Step 4: Experience details (conditional - shows only if user has work experience)
- ✓ Step 5: Document verification, CV upload, and motivation letter
- ✓ Dynamic step progression based on user responses
- ✓ Color-coded design matching user specifications
- ✓ Comprehensive validation and progress indicators
- ✓ Dual-purpose form for both job application and profile completion

### Complete Enhanced Applicant Interface Implementation (July 12, 2025)
- ✓ EnhancedDashboard with comprehensive overview, job recommendations, and smart analytics
- ✓ Enhanced Profile Management with 4 tabs: overview, documents, experience, and settings
- ✓ Advanced Applications Tracking with timeline, status management, and detailed filtering
- ✓ Sophisticated Chat System with organized contacts, file sharing, and quick responses
- ✓ Advanced Job Listings with smart filtering, job matching, and detailed job information
- ✓ Interview Management System with scheduling, preparation checklist, and feedback tracking
- ✓ Mobile-first responsive design with intuitive bottom navigation
- ✓ Indonesian localization and professional UI/UX improvements
- ✓ Document verification system with upload status tracking
- ✓ Gamification elements with profile completion and achievement systems

### Full Feature Activation Implementation (July 13, 2025)
- ✓ Complete Applications Page with status tracking, filtering, and detailed application history
- ✓ Comprehensive Chat System with contact management, real-time messaging, and quick replies
- ✓ Advanced Profile Management with education, experience, skills, and document sections
- ✓ Interview Management with preparation checklists, scheduling, and status tracking
- ✓ Dynamic Job Application Form with 5-step process and conditional fields
- ✓ Enhanced Bottom Navigation with Interview tab integration
- ✓ Real-time page switching and state management across all features
- ✓ Fully functional mock data system for demonstration and testing
- ✓ Complete feature integration with SWAPRO branding and design consistency

### Cross-Role Data Synchronization Implementation (July 12, 2025)
- ✓ Shared data types and structures for admin and applicant roles
- ✓ Global sync store for real-time data consistency across roles
- ✓ Custom hooks for synchronized job postings, applications, interviews, and notifications
- ✓ Server-side sync routes for backend consistency
- ✓ Real-time event system for instant updates across dashboards
- ✓ Enhanced admin dashboard using synchronized data sources
- ✓ Enhanced applicant interfaces with real-time data updates
- ✓ Cross-role notification system for status changes
- ✓ Unified statistics and analytics across admin and applicant views

### Fallback Strategies
- **Development Mode**: Mock Supabase client when configuration is missing
- **In-Memory Storage**: Fallback storage implementation for development
- **Graceful Degradation**: Application functions with reduced features when external services are unavailable

The application is designed to be flexible and maintainable, with clear separation of concerns between frontend and backend, comprehensive type safety, and robust error handling throughout the system.