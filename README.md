# B2Bee - Coming Soon Page

A beautiful, responsive coming soon page built with Next.js for B2Bee, featuring PostgreSQL database integration for email collection and analytics.

## ✨ Features

- 🎨 Modern, clean design using the B2Bee brand colors
- 📱 Fully responsive design that works on all devices
- 🖼️ Features the provided coming soon image
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 Optimized for performance and SEO
- 📧 **Email collection system** with PostgreSQL database
- 📊 **Analytics tracking** for page views, button clicks, and social interactions
- 🔐 **Admin dashboard** to view subscribers and analytics
- 🎨 **Interactive form** with validation and success/error states

## 🗄️ Database Features

- **Email Subscriptions**: Collect and store visitor emails
- **Analytics Tracking**: Monitor page views, button clicks, and social media interactions
- **Admin Dashboard**: View subscribers and analytics at `/admin`
- **Data Export**: Easy access to subscriber data for email campaigns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/talentseek/b2beesite.git
cd b2bee
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
```

4. **Initialize the database:**
```bash
npm run init-db
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to see the coming soon page.

## 📊 Database Setup

### PostgreSQL on Fly.io

If you're using PostgreSQL on Fly.io, your connection string will look like:
```
DATABASE_URL=postgresql://username:password@your-app.fly.dev:5432/database_name
```

### Local PostgreSQL

For local development:
```
DATABASE_URL=postgresql://localhost:5432/b2bee
```

### Database Schema

The application creates the following tables:

- **`subscribers`**: Stores email addresses and subscription data
- **`page_analytics`**: Tracks user interactions and page views
- **Indexes and triggers**: For optimal performance and data integrity

## 🎯 Usage

### Email Collection

Visitors can subscribe to your launch notifications by entering their email address. The system:

- ✅ Validates email format
- ✅ Prevents duplicate subscriptions
- ✅ Shows success/error messages
- ✅ Tracks subscription events

### Analytics Tracking

The system automatically tracks:

- 📈 Page views
- 🖱️ Button clicks
- 📱 Social media link clicks
- 📧 Email subscriptions

### Admin Dashboard

Access the admin dashboard at `/admin` to view:

- 📊 Analytics overview
- 📧 List of subscribers
- 📅 Subscription dates
- 🔄 Real-time data

## 🛠️ API Endpoints

### Email Subscription
- `POST /api/subscribe` - Add new email subscriber
- `GET /api/subscribe` - Get total subscriber count

### Analytics
- `POST /api/analytics` - Log analytics events
- `GET /api/analytics` - Get analytics summary

### Subscribers Management
- `GET /api/subscribers` - Get all subscribers
- `DELETE /api/subscribers?id=X` - Soft delete subscriber

## 🎨 Customization

### Colors
The page uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #205b41;    /* Main brand color */
  --accent-color: #fe8a00;     /* Orange accent */
  --text-dark: #000000;        /* Text color */
  --background: #fcefdb;       /* Background color */
}
```

### Content
- Update text content in `app/page.tsx`
- Modify social media links
- Customize email subscription messages

## 📁 Project Structure

```
b2bee/
├── app/
│   ├── api/                    # API routes
│   │   ├── analytics/          # Analytics tracking
│   │   ├── subscribe/          # Email subscription
│   │   └── subscribers/        # Subscriber management
│   ├── admin/                  # Admin dashboard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main coming soon page
│   ├── page.css                # Page styles
│   └── globals.css             # Global styles
├── components/
│   └── EmailSubscription.tsx   # Email form component
├── lib/
│   ├── db.ts                   # Database configuration
│   └── schema.sql              # Database schema
├── scripts/
│   └── init-db.ts              # Database initialization
├── public/
│   └── comingsoon.png          # Coming soon image
└── package.json
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Analytics & Insights

### What's Tracked

- **Page Views**: Every visit to the coming soon page
- **Button Clicks**: Interactions with the "Get Notified" button
- **Social Clicks**: Clicks on social media links
- **Email Subscriptions**: Successful email signups

### Data Privacy

- No personal data beyond email addresses is collected
- IP addresses are stored for analytics but not displayed
- All data is stored securely in your PostgreSQL database

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database schema

### Database Management

To reset the database:
```bash
# Drop and recreate tables
npm run init-db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to B2Bee.

## 🆘 Support

For support or questions:
- Check the admin dashboard for system status
- Review the database logs for any errors
- Ensure your `DATABASE_URL` is correctly configured

---

**Built with ❤️ for B2Bee** 