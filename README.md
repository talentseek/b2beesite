# B2Bee - Coming Soon Page

A beautiful, responsive coming soon page built with Next.js for B2Bee.

## Features

- 🎨 Modern, clean design using the B2Bee brand color (#205b41)
- 📱 Fully responsive design that works on all devices
- 🖼️ Features the provided coming soon image
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 Optimized for performance and SEO

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
b2bee/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main coming soon page
│   ├── page.css            # Page-specific styles
│   └── globals.css         # Global styles
├── public/
│   └── comingsoon.png      # Coming soon image
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Customization

The page uses CSS custom properties for easy theming:

- `--primary-color`: #205b41 (main brand color)
- `--primary-light`: #2a7a56 (lighter variant)
- `--primary-dark`: #1a4a35 (darker variant)
- `--accent-color`: #fbbf24 (accent color)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS** - Custom styling with CSS variables
- **Inter Font** - Google Fonts integration 