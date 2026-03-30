# Empathy Manor

A premium real estate investment platform built for Empathy Manor, showcasing luxury properties in Lagos, Nigeria.

## Features

- **Premium Landing Page**: A sleek, dark-mode, responsive marketing page built with Next.js and Tailwind CSS designed to highlight the value proposition of real estate investments.
- **Lead Generation**: A seamless Call-To-Action form connected directly to the database, allowing prospective investors to easily request an escrow or find out more.
- **Admin Dashboard & CRM**: A protected internal dashboard for managing incoming leads and escrow requests.
- **Secure Architecture**: Powered by Firebase Authentication and Firestore, with robust database security rules protecting CRM data and public entry points.

## Tech Stack

- **Core**: [Next.js](https://nextjs.org/) (React framework) and TypeScript.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, responsive dark-mode aesthetic.
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication and Cloud Firestore).

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed. You will also need a Firebase project set up.

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Firebase project configuration credentials:
   ```bash
   cp .env.example .env.local
   ```
   *Make sure you provide valid `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` for the application to function properly.*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to view the application. The premium landing page will be instantly visible, while the secure admin dashboard is available at `/admin`.

## Project Structure

- `src/app/page.tsx`: The main public-facing landing page.
- `src/app/admin/`: Secured admin dashboard routes and authentication flows.
- `src/lib/firebase.js`: Firebase initialization and configuration linking the app to your database.
- `src/types/`: Shared TypeScript definitions for end-to-end type safety.
- `firestore.rules`: Security rules enforcing access control over the Firestore database.

## Deployment

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new). Make sure to configure your environment variables (`NEXT_PUBLIC_FIREBASE_*`) within the Vercel dashboard prior to deployment so the app can successfully connect to Firebase in production.
