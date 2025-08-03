# TripWise - AI-Powered Travel Planning Dashboard

A modern, full-stack travel agency management system built with React Router v7, featuring AI-powered trip generation, user management, and comprehensive analytics.

## 🌟 Features

### Core Functionality
- **AI Trip Generation**: Powered by Google Gemini AI for personalized travel itineraries
- **Trip Management**: Create, view, edit, and manage travel plans
- **Image Integration**: Unsplash API for beautiful destination photos
- **Analytics Dashboard**: Real-time insights and travel statistics

### User Interface
- **Modern Design**: Glass morphism and gradient designs
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Syncfusion components for rich UI

### Admin Features
- **User Management**: Track and manage registered users
- **Trip Analytics**: Travel style preferences and booking trends
- **Dashboard Overview**: Key metrics and performance indicators

## 🛠️ Tech Stack

### Frontend
- **React Router v7** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Syncfusion Components** - Professional UI components

### Backend & Services
- **Appwrite** - Backend-as-a-Service (Database, Auth, Storage)
- **Google Gemini AI** - AI-powered trip generation
- **Unsplash API** - High-quality travel images


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account
- Google Cloud Platform account (for Gemini AI)
- Stripe account
- Unsplash Developer account

### Installation

1. **Clone the repository**

git clone https://github.com/anujverma08/travel-dashboard.git
cd tripwise


2. **Install dependencies**
npm install


3. **Environment Setup**
Create a `.env` file in the root directory:

# Appwrite Configuration
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_DATABASE_ID=your_database_id_here
APPWRITE_TRIPS_COLLECTION_ID=your_trips_collection_id
APPWRITE_USER_COLLECTION_ID=your_users_collection_id

# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# External APIs
UNSPLASH_ACCESS_KEY=your_unsplash_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key


4. **Appwrite Setup**

**Database Collections:**
- **Trips Collection** (`tripDetail` field as string/text, `imageUrls` as array, `userId` as string)
- **Users Collection** (standard user fields + `itineraryCount`)

**Authentication:**
- Enable Google OAuth provider
- Set success redirect: `http://localhost:5173/dashboard`
- Set failure redirect: `http://localhost:5173/`

5. **Start Development Server**
npm run dev
