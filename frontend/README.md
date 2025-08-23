# Climbing Waffle - Frontend PWA 🧗‍♀️🧇

The React Progressive Web App frontend for the Climbing Waffle adventure companion.

## ✨ Features

- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Offline Support** - Works even without internet connection
- **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- **Responsive Design** - Works perfectly on all devices
- **AI Chat Interface** - Ready for backend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Visit: **http://localhost:8080**

### Production Build
```bash
npm run build
npm run preview
```

## 📱 PWA Features

- ✅ **Installable** - Add to home screen on mobile/desktop
- ✅ **Offline Support** - Service worker caches content
- ✅ **App-like Experience** - Standalone mode without browser UI
- ✅ **Fast Loading** - Optimized caching and performance
- ✅ **Cross-platform** - Works on iOS, Android, Windows, macOS, Linux

### Installing as PWA
1. **Chrome/Edge**: Click the install icon in the address bar
2. **Firefox**: Click the install icon in the address bar
3. **Safari**: Use "Add to Home Screen" from the share menu
4. **Mobile**: Use "Add to Home Screen" from browser menu

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **PWA**: Vite PWA Plugin
- **State Management**: React Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM

## 📁 Project Structure

```
frontend/
├── src/                 # Source code
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions
│   └── assets/         # Images and assets
├── public/             # Static assets
│   ├── manifest.json   # PWA manifest
│   ├── sw.js          # Service worker
│   └── icons/         # PWA icons
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome 67+
- Firefox 67+
- Safari 11.1+
- Edge 79+

## 🔗 Backend Integration

This frontend is designed to work with a Python FastAPI backend (located in `../backend/`). The chat functionality is currently using mock responses and is ready for real API integration.

## 📝 License

This project is licensed under the MIT License.

---

**Happy Climbing! 🧗‍♀️🧇**
