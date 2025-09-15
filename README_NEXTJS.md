# Next.js Trading Journal

A modern trading journal application built with Next.js, React, and Supabase.

## Features

- 📊 **Trading Dashboard** - Track your trades with comprehensive analytics
- 📈 **Performance Charts** - Visualize your trading performance over time
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Charts**: Recharts
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-trading-journal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up your Supabase database using the provided SQL files:
   - `DATABASE_SETUP.sql`
   - `CHECK_TABLES.sql`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── Navbar.jsx         # Navigation component
│   ├── TradingPlan.jsx    # Main trading component
│   └── ...
├── contexts/              # React contexts
│   └── AuthContext.jsx    # Authentication context
├── lib/                   # Utility libraries
│   └── supabase.js        # Supabase client
└── services/              # API services
    └── tradingService.js  # Trading data service
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Migration from Vite

This project has been migrated from Vite to Next.js with the following changes:

- ✅ Converted to Next.js App Router
- ✅ Updated routing from React Router to Next.js routing
- ✅ Migrated environment variables to Next.js format
- ✅ Updated all imports to use Next.js conventions
- ✅ Added TypeScript support
- ✅ Maintained all existing functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
