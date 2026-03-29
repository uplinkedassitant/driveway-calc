# DrivewayCalc - Quick Start Guide

## 🚀 30-Second Setup

```bash
cd driveway-calc
npm install
npm run dev
```

Open http://localhost:3000

## 📸 Basic Workflow

1. **Upload Photo** - Click or drag & drop
2. **Set Scale** - Mark two points on known distance (e.g., 10 ft)
3. **Draw Perimeter** - Click around edges to measure area
4. **Read Results** - Area, grade, materials shown instantly
5. **Save Job** - Store for later reference

## 🛠️ Tool Guide

| Tool | Icon | What It Does |
|------|------|--------------|
| Draw Perimeter | ✏️ | Draw polygon around area to measure |
| Set Scale | 📏 | Define real-world reference distance |
| Draw Slope | 📐 | Measure grade between two points |
| Undo | ↩️ | Remove last point |
| Clear | 🗑️ | Clear current tool's points |

## 📐 Example: Measure a Driveway

1. Take photo from above (include tape measure or known distance)
2. Upload to DrivewayCalc
3. **Set Scale**: Click ends of 10-foot tape measure in photo
4. **Draw Perimeter**: Click each corner of driveway
5. **Result**: See area in sq ft, plus material estimates!

## 📊 Example: Calculate Grade

1. After setting scale, click **Draw Slope**
2. Click high point of driveway
3. Click low point
4. Enter vertical rise (e.g., 6 inches)
5. **Result**: Grade % shown (green <2%, yellow 2-6%, red >6%)

## 💾 Save & Load

- **Save**: Click "Save Job", enter name
- **Load**: Click "Job History", select job
- **Storage**: Saved in browser (won't clear unless you clear cache)

## 📱 Mobile Tips

- Works great on phone browsers
- Add to home screen for app-like experience
- Use camera in landscape mode
- Tap to draw points (not drag)

## ⚡ Shortcuts

- **Undo last point**: Click Undo button
- **Clear all**: Click Clear button
- **Switch tools**: Just click different tool button
- **Close polygon**: Click near starting point

## 🎯 Pro Tips

1. **Best photos**: Taken from above, good lighting
2. **Scale accuracy**: Use longer reference distances
3. **Perimeter**: Click corners, not along straight edges
4. **Grade**: Measure vertical rise with level on-site
5. **Multiple areas**: Save separate jobs for each section

## ❓ Troubleshooting

**Area seems wrong?**
- Check scale is set correctly
- Ensure perimeter is closed (click starting point)

**Can't draw?**
- Select a tool first (perimeter/scale/slope)
- Tool button will be highlighted when active

**Lost my work?**
- Check "Job History" button
- Jobs saved to browser storage automatically

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
./deploy.sh
```

That's it! Your app is live.

## 📞 Need Help?

1. Check GETTING_STARTED.md
2. Review README.md
3. Open GitHub issue

---

**Ready to measure? Open http://localhost:3000 and start!** 📐
