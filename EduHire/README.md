# EduHire Landing Page

A modern, responsive React landing page for EduHire - a platform where students meet opportunities.

## Features

- **Modern Design**: Clean, minimalistic UI with Tailwind CSS
- **3D Interactive Model**: Rotatable graduation hat using React Three Fiber
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Fully Responsive**: Optimized for desktop and mobile devices
- **Sticky Navigation**: Professional navbar with user controls

## Tech Stack

- React 19
- Tailwind CSS
- React Three Fiber (@react-three/fiber)
- React Three Drei (@react-three/drei)
- Framer Motion
- Lucide React (Icons)
- Vite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Navigation bar component
│   └── Hero.jsx        # Hero section with 3D model
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## Features Implemented

### Navbar
- EduHire logo and company name
- Settings, notification, and profile icons
- Sticky positioning with backdrop blur
- Hover effects and smooth transitions

### Hero Section
- Large, bold "EduHire" heading
- Descriptive tagline
- "Get Started" CTA button
- Interactive 3D graduation hat model
- Fade-in animations using Framer Motion

### 3D Model
- Custom graduation hat built with Three.js primitives
- Auto-rotation with mouse drag controls
- Proper lighting and materials
- Responsive canvas sizing

### Styling
- Gradient background (gray to white)
- Modern color scheme
- Smooth hover effects
- Mobile-first responsive design
- Professional typography

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```
