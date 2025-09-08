# Deployment Guide for C-Square Club Website

## 🎯 Quick Deployment Steps

### 1. **Netlify (Recommended)**
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git" or drag & drop the `dist` folder
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher
4. **Environment variables:** (Optional - already configured)
   - `VITE_API_URL`: `https://csquarebackend-upd0.onrender.com/api`
5. Deploy!

### 2. **Vercel**
1. Go to [vercel.com](https://vercel.com) and import your project
2. **Build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy!

### 3. **GitHub Pages**
1. Build the project: `npm run build`
2. Create a new repository on GitHub
3. Upload the `dist` folder contents
4. Enable GitHub Pages in repository settings

### 4. **Other Static Hosting**
1. Run `npm run build`
2. Upload the entire `dist` folder to your hosting provider
3. Configure your web server to serve `index.html` for all routes

## ⚙️ Pre-Deployment Checklist

✅ **Backend is running:** https://csquarebackend-upd0.onrender.com  
✅ **API URLs updated:** Check `src/utils/api.js` and `vite.config.js`  
✅ **Environment variables set:** `.env` file configured  
✅ **Build successful:** `npm run build` completes without errors  
✅ **SPA routing configured:** `_redirects` file in public folder  

## 🔧 Build Configuration

The project is already configured with:
- **API Base URL:** Points to your Render backend
- **SPA Routing:** `_redirects` file for client-side routing
- **Production optimizations:** Minification, compression, etc.

## 📱 Testing After Deployment

1. **Homepage loads correctly**
2. **Navigation works** (all routes accessible)
3. **Events section** displays (connects to backend)
4. **Team section** loads member data
5. **Contact form** submits successfully
6. **Admin panel** login works
7. **Responsive design** on mobile devices

## 🚨 Common Issues & Solutions

### Issue: API calls fail
**Solution:** Check if backend URL is correct in `.env` and `api.js`

### Issue: Routes return 404
**Solution:** Ensure `_redirects` file is in the `public` folder

### Issue: Build fails
**Solution:** Run `npm install` and check for syntax errors

### Issue: Slow loading
**Solution:** Consider code splitting for the large bundle (610kb)

## 🌐 Custom Domain Setup

### Netlify:
1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS with your domain provider

### Vercel:
1. Go to Project settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

## 📊 Performance Optimization

For production, consider:
- **Code splitting:** Use dynamic imports
- **Image optimization:** Compress event/team images
- **CDN setup:** Use a CDN for static assets
- **Caching:** Configure proper cache headers

---

Your C-Square Club website is now ready to go live! 🚀
