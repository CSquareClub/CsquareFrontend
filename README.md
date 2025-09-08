# C-Square Club Frontend

A modern React application for the C-Square Club website built with Vite, Tailwind CSS, and Framer Motion.

## 🚀 Live Demo
- **Backend API**: https://csquarebackend-upd0.onrender.com
- **Frontend**: [Deploy this to your preferred hosting platform]

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The app is pre-configured to use the Render backend:
   ```
   VITE_API_URL=https://csquarebackend-upd0.onrender.com/api
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 📦 Deployment

### For Netlify/Vercel:
1. Upload the `dist` folder after running `npm run build`
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### For Other Platforms:
- The `_redirects` file is included for SPA routing
- All API calls are configured for the Render backend

## 🔧 Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration
The frontend connects to the C-Square Club backend hosted on Render:
- Base URL: `https://csquarebackend-upd0.onrender.com/api`
- Includes authentication, events, team, and contact management

## 📱 Features
- Responsive design for all devices
- Interactive carousel components
- Event management system
- Team member profiles
- Contact form integration
- Admin panel functionality
- Smooth animations with Framer Motion
