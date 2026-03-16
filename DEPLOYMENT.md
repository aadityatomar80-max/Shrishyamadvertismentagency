# Shree Shyam Advertising Agency - Deployment Guide

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Vercel Deployment

### Automatic Deployment
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy

### Manual Deployment
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

## Environment Variables

For production, you may need these environment variables:
- `DATABASE_URL` (for Prisma/PostgreSQL)
- `NEXT_PUBLIC_APP_URL` (your deployed app URL)
- Email service credentials (for notifications)

## Build Requirements

- Node.js 18+
- npm or yarn
- PostgreSQL database (for full functionality)

## Notes

- The app uses Next.js 14.2.5 with App Router
- Tailwind CSS for styling
- Prisma for database management
- TypeScript for type safety

## Troubleshooting

If build fails:
1. Check for TypeScript errors: `npm run lint`
2. Ensure all dependencies are installed
3. Check environment variables
4. Verify database connection (if using Prisma)
