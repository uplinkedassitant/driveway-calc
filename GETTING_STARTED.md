# Getting Started with DrivewayCalc

## Quick Start

### 1. Install Dependencies

```bash
cd driveway-calc
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Test the Application

1. **Upload a photo** - Click "Upload Image" or drag & drop
2. **Set scale** - Click "Set Scale", mark two points on a known distance
3. **Draw perimeter** - Click "Draw Perimeter", click around the edges
4. **View measurements** - Area and grade calculate automatically
5. **Save job** - Click "Save Job" to store locally

## How to Use Each Tool

### 📏 Set Scale Tool
1. Click "Set Scale" button
2. Click on one end of a known distance (e.g., 10-foot tape measure in photo)
3. Click on the other end
4. The scale is now set - all measurements use this reference

### ✏️ Draw Perimeter Tool
1. Click "Draw Perimeter" button
2. Click around the driveway edges to create points
3. Click near the starting point to close the polygon
4. Area is calculated automatically in square feet

### 📐 Draw Slope Tool
1. Click "Draw Slope" button
2. Click the high point of the slope
3. Click the low point
4. The grade percentage shows automatically

### 🔄 Undo & Clear
- **Undo**: Remove the last point drawn with the current tool
- **Clear**: Remove all points for the current tool

## Testing

Run the test suite:

```bash
npm test
```

This tests:
- Shoelace area calculation
- Distance calculations
- Pixel-to-feet conversion
- Grade percentage math
- Unit conversions

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
./deploy.sh

# Or manually:
npm run build
vercel --prod
```

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new "Static Site"
4. Connect your GitHub repo
5. Build command: `npm run build`
6. Publish directory: `out`

### Deploy to GitHub Pages

```bash
npm install -g gh-pages
npm run build
npx gh-pages -d out
```

## PWA Installation

### On Mobile (iOS/Android)
1. Open the app in Safari or Chrome
2. Tap "Share" (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. Launch from home screen like a native app

### On Desktop (Chrome/Edge)
1. Open the app
2. Look for the install icon in the address bar
3. Click "Install"
4. App appears in your apps list

## Troubleshooting

### Build fails with "canvas" error
Make sure you're not importing Konva on the server. All canvas code must be client-side only with `"use client"`.

### Images don't load
Check that images are properly encoded as base64 data URLs. Large images may need compression.

### Measurements seem wrong
- Ensure scale is set correctly first
- Use clear, well-lit photos
- Take photos from directly above when possible
- Include a reference object of known size

### App doesn't work offline
PWA requires HTTPS (or localhost). Make sure you're on a secure connection.

## Performance Tips

1. **Image size**: Keep images under 2MB for best performance
2. **Points**: Limit perimeter points to essential corners
3. **Storage**: Jobs are stored in browser localStorage (limit ~5-10MB)

## Next Steps

After using the MVP:
- Add Supabase for cloud sync
- Implement PDF export
- Add custom material presets
- Enable photo stitching for large areas
- Add AR measurement mode

## Support

For issues or questions:
1. Check this guide first
2. Review the README.md
3. Open an issue on GitHub

---

**Happy Measuring! 📐**
