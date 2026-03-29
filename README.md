# DrivewayCalc - Job Site Measurement Tool

A production-ready web application for measuring driveways and job sites from photos. Built for contractors who need quick, accurate measurements on-site.

![DrivewayCalc](https://via.placeholder.com/800x450/1a1a2e/ffffff?text=DrivewayCalc+Screenshot)

## Features

✅ **Photo-Based Measurements** - Upload or capture photos of job sites  
✅ **Interactive Drawing** - Draw perimeters, scale lines, and slope markers  
✅ **Instant Calculations** - Square footage, grade percentage, material estimates  
✅ **PWA Ready** - Works offline, installable on mobile devices  
✅ **Client-Side Only** - No backend required, all processing in-browser  
✅ **Dark Mode** - Construction-friendly dark theme  
✅ **Touch Optimized** - Works great on phones and tablets  

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + lucide-react icons
- **Canvas:** Konva.js for image annotation
- **State:** Zustand with persistence
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel (static export)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/driveway-calc.git
cd driveway-calc

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

## Usage Guide

### 1. Start a New Job
- Click "Take Photo" to capture from camera, or
- Drag & drop an image, or
- Click to upload from gallery

### 2. Set Scale Reference
1. Click **"Set Scale"** tool
2. Click two points on a known distance (e.g., tape measure, 10-foot span)
3. Enter the real-world length (e.g., "10" for 10 feet)

### 3. Draw Perimeter
1. Click **"Draw Perimeter"** tool
2. Click around the driveway edges to create points
3. Close the polygon by clicking near the start
4. Area is calculated automatically

### 4. Measure Grade (Optional)
1. Click **"Draw Slope"** tool
2. Click start and end points along the slope
3. Enter the vertical rise (in inches or feet)
4. Grade percentage is calculated

### 5. Save & Export
- Click **"Save Job"** to store locally
- View history with **"Job History"**
- Export to PDF (coming soon)

## Math & Formulas

### Area Calculation (Shoelace Formula)
```typescript
A = ½ |Σ(xᵢyᵢ₊₁ - xᵢ₊₁yᵢ)|
```
Converts pixel area to square feet using the scale reference.

### Grade/Slope
```typescript
Grade % = (Rise ÷ Run) × 100
```
Where Rise is vertical change and Run is horizontal distance.

### Material Estimates
- **Asphalt (3" thick):** Area × 0.25 × 150 lbs/ft³ ÷ 2000 lbs/ton
- **Concrete (4" thick):** Area × 0.33 ÷ 27 ft³/yd³

## Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Test Coverage
- ✅ Shoelace area calculation
- ✅ Distance calculations
- ✅ Pixel-to-feet conversion
- ✅ Grade percentage
- ✅ Unit conversions

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or use the one-command deploy:
vercel --prod
```

### Deploy to Render

```bash
# Build static files
npm run build

# Upload the `out` folder to Render Static Site
```

### One-Command Deploy Script

```bash
#!/bin/bash
# deploy.sh
npm run build
vercel --prod
```

## PWA Features

- ✅ Installable on iOS/Android
- ✅ Works offline
- ✅ Full-screen mode
- ✅ App icon on home screen

To install:
1. Open in Chrome/Safari
2. Tap "Add to Home Screen"
3. Launch from home screen

## Project Structure

```
driveway-calc/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── MeasurementCanvas.tsx  # Canvas component
│   │   ├── ImageUploader.tsx      # Upload/camera
│   │   └── ui/                    # UI components
│   ├── lib/
│   │   ├── utils.ts          # Math utilities
│   │   └── __tests__/        # Tests
│   └── store/
│       └── useMeasurementStore.ts  # State
├── public/
│   └── manifest.json         # PWA manifest
└── package.json
```

## Roadmap

### MVP (Completed)
- [x] Photo upload/capture
- [x] Interactive canvas
- [x] Area calculation
- [x] Grade calculation
- [x] Material estimates
- [x] Save jobs locally
- [x] PWA support

### Future Enhancements
- [ ] PDF export
- [ ] Supabase sync
- [ ] Multi-photo stitching
- [ ] AR measurement mode
- [ ] Custom material presets
- [ ] Share via link
- [ ] Cloud backup

## Limitations & Disclaimers

⚠️ **Photo-based estimates only** - Always verify measurements with physical tools on-site for accuracy.

⚠️ **Perspective distortion** - Photos taken at extreme angles may affect accuracy.

⚠️ **Scale dependent** - Accuracy depends on correct scale reference.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file

## Support

For issues or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for contractors and builders**

*DrivewayCalc - Measure twice, build once.*
