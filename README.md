# 🅿️ PARKIT - Smart Parking Management System

**Smart Parking Platform**

> *Find Your Perfect Parking Spot in Seconds*

![PARKIT Banner](https://img.shields.io/badge/PARKIT-Smart%20Parking-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgNkgyMVY4SDNWNlpNMyAxMEgyMVYxMkg)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Overview

**PARKIT** is a comprehensive parking management platform built for India's urban landscape. Our system provides real-time parking spot management, booking capabilities, and analytics dashboards for both users and parking facility managers.

## 🎯 Current Features

### � **User Portal**
- **User Authentication** with role-based access control
- **Parking Spot Booking** system with real-time availability
- **Digital Wallet Integration** with balance management
- **Booking History** and transaction tracking
- **Subscription Management** for frequent users
- **Vehicle Registration** integration

### 🛡️ **Manager Dashboard**
- **Real-time Spot Management** (mark spots as free/occupied/reserved)
- **Booking Analytics** with occupancy metrics
- **User Management** and subscription tracking
- **Bulk Actions** for efficient spot management
- **Revenue Analytics** and reporting

### 💰 **Payment & Subscription System**
- **Multiple Subscription Plans**:
  - **Monthly Pass** (₹999) - Unlimited parking for 30 days
  - **Quarterly Pass** (₹2,499) - Unlimited parking for 90 days + Priority booking
  - **Annual Pass** (₹7,999) - Unlimited parking for 365 days + Priority booking + EV charging
  - **Student Monthly** (₹599) - 50% discount on all parking for 30 days
- **Digital Wallet** with ₹1,000 starting balance
- **Indian Rupee (₹) pricing** throughout the platform

### �️ **Location & Navigation**
- **Interactive Maps** using Leaflet.js
- **GPS-based Location Services** for proximity sorting
- **Zone-based Organization** (Panaji, Goa focus)
- **Distance Calculations** using Haversine formula

### ⚡ **EV Charging Support**
- **EV-specific Parking Spots** with charging capabilities
- **20% EV Discount** on all parking rates
- **EV Charging Status** monitoring and management

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18.3.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router DOM** - Client-side routing
- **React Query (@tanstack/react-query)** - Data fetching

### **Backend & Database**
- **Supabase** - Complete backend solution
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication & authorization
- **Database Tables**:
  - `profiles` - User information with wallet balance
  - `bookings` - Parking reservations with vehicle details
  - `subscription_plans` - Available subscription tiers
  - `user_subscriptions` - Active user subscriptions
  - `user_roles` - Role-based access control

### **Mapping & Location**
- **Leaflet.js** - Interactive map rendering
- **@types/leaflet** - TypeScript support
- **Geolocation API** - User position tracking
- **Custom distance calculations** for proximity sorting

### **UI Components & Styling**
- **Radix UI** - Accessible primitive components
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Style conflict resolution
- **React Hook Form** - Form management with validation
- **AuthContext** - User authentication & roles
- **Local Storage** - Persistent data caching

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ or Bun runtime
- Supabase account & project
- Git

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ParkIt
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun (recommended)
   bun install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   touch .env
   
   # Add Supabase credentials (see .env.example)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Access the Application**
   - Main Application: `http://localhost:5173`
   - User Portal: Navigate to `/auth`
   - Manager Portal: Navigate to `/manager/auth`

---

## 📊 Database Schema

### **Current Tables**

#### `profiles`
- User information and wallet balance
- Links to Supabase auth system
- Default ₹1,000 starting balance

#### `bookings`
- Parking reservations with timestamps
- Vehicle registration integration
- Amount calculations and status tracking

#### `subscription_plans`
- Available subscription tiers
- Pricing in Indian Rupees (₹)
- Benefits and discount percentages

#### `user_subscriptions`
- Active user subscriptions
- Start/end dates with status tracking
- Price paid and plan details

#### `user_roles`
- Role-based access control
- User/Manager role assignments

---

## 🎨 UI/UX Features

### **Design System**
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - System preference detection
- **Accessibility** - WCAG 2.1 compliant
- **Loading States** - Smooth user experience
- **Toast Notifications** - Real-time feedback

### **Component Library**
- Custom-styled shadcn/ui components
- Consistent design tokens
- Reusable UI patterns
- Animated interactions

### **User Experience**
- **Intuitive Navigation** - Clear user flows
- **Real-time Updates** - Live data synchronization
- **Smart Defaults** - Contextual pre-selections
- **Error Handling** - Graceful error states

---

## 🔐 Security & Authentication

### **Supabase Auth Integration**
- **Email/Password Authentication**
- **Role-based Access Control (RBAC)**
  - `user` - Standard parking user
  - `manager` - Parking facility manager
- **Row Level Security (RLS)** policies
- **JWT token management**
- **Secure session handling**

### **Data Protection**
- **Encrypted database connections**
- **API key management**
- **Input validation & sanitization**
- **XSS protection**

---

## 📈 Business Features

### **Pricing Strategy**
- **Base Price**: ₹30/hour (Indian market optimized)
- **Dynamic Pricing Rules**:
  - Conservative: Stable pricing
  - Balanced: Moderate adjustments
  - Aggressive: High demand pricing
- **EV Discount**: 20% off base rates
- **Subscription Benefits**: Up to 50% savings

### **Revenue Streams**
1. **Pay-per-use parking** - Guest users
2. **Subscription plans** - Regular users
3. **EV charging fees** - Premium service
4. **Manager analytics** - B2B dashboards

### **Analytics & Insights**
- **Real-time occupancy metrics**
- **Revenue tracking & forecasting**
- **Peak hour analysis**
- **User behavior insights**
- **Predictive demand modeling**

---

## 🚀 Deployment

### **Production Build**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### **Deployment Platforms**
- **Vercel** (Recommended for React apps)
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Digital Ocean** - VPS deployment

### **Environment Variables**
```bash
# Production environment
NODE_ENV=production
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_production_key
```

---

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- **TypeScript** - Strict type checking
- **ESLint** - Code linting & formatting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message standards

### **Testing**
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

---

## 📋 Roadmap

### **Phase 1: Core Features** ✅
- [x] Real-time parking spot management
- [x] User authentication & roles
- [x] Basic booking system
- [x] Manager dashboard

### **Phase 2: Advanced Features** 🚧
- [x] AI-powered pricing
- [x] Subscription system
- [x] EV charging integration
- [x] Predictive analytics

### **Phase 3: Scale & Optimize** 📋
- [ ] Multi-city expansion
- [ ] Mobile app (React Native)
- [ ] IoT sensor integration
- [ ] Advanced analytics dashboard
- [ ] Payment gateway integration
- [ ] Multi-language support

### **Phase 4: Enterprise** 🎯
- [ ] White-label solutions
- [ ] API marketplace
- [ ] Advanced reporting
- [ ] Integration ecosystem

---


<div align="center">

**Built with ❤️ for India's Smart Cities Initiative**

![PARKIT Logo](https://img.shields.io/badge/🅿️-PARKIT-success?style=for-the-badge)

*Transforming Urban Mobility, One Parking Spot at a Time*

</div>
