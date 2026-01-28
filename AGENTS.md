## Project Summary
A full-stack Carbon Footprint Tracker that allows users to monitor their daily and monthly CO2 emissions based on their travel, electricity usage, and food consumption. The application features a Spring Boot backend with JWT authentication and a Next.js frontend with data visualization.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2.2, Spring Security (JWT), Spring Data MongoDB, Lombok, Maven.
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Recharts, Framer Motion, Lucide React, Shadcn UI.
- **Database**: MongoDB.

## Architecture
- **Monorepo structure**: Spring Boot code in `src/main/java`, Next.js code in `src/app`.
- **Backend**: Follows Controller-Service-Repository pattern.
- **Frontend**: App Router structure with components in `src/components`.

## User Preferences
- Clean, modern, and distinctive UI aesthetic.
- Use of animations for high-impact moments.

## Project Guidelines
- Keep components as React Server Components where possible.
- Use functional components and named exports.
- Secure communication between frontend and backend using JWT.

## Common Patterns
- JWT-based authentication flow.
- Reusable UI components using Radix UI primitives.
- Centralized API client for backend communication.
