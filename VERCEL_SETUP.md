# Vercel Deployment Setup - Clean Next.js

## ✅ Current Status

Your repository is now configured for **standard Next.js serverless deployment**:

- ✅ No `vercel.json` (Vercel will auto-detect)
- ✅ No `output: 'export'` in next.config.ts
- ✅ Build creates `.next/` directory (default)
- ✅ Ready for Vercel's native Next.js support

## 🚀 Vercel Configuration

### Step 1: Go to Your Vercel Project
1. Open: https://vercel.com/dashboard
2. Find "driveway-calc" project
3. If it doesn't exist, create new: https://vercel.com/new

### Step 2: Configure Build Settings
In Vercel project settings:

**Build & Development Settings:**
- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (or leave blank for auto)
- **Output Directory:** **LEAVE BLANK** (default)
- **Install Command:** `npm install` (or leave blank for auto)

⚠️ **IMPORTANT:** Make sure "Output Directory" is BLANK/EMPTY, not "out" or ".next"

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click three dots (⋮) on latest deployment
3. Click **"Redeploy"**
4. Or click "Redeploy" button if available

## 📋 What Vercel Will Do

With no `vercel.json` and default Next.js config:

1. ✅ Auto-detect Next.js framework
2. ✅ Run `npm install`
3. ✅ Run `npm run build` (which runs `next build`)
4. ✅ Output to `.next/` directory
5. ✅ Deploy as serverless functions
6. ✅ Handle routing automatically

## ✅ Expected Build Output

```
Running build in Washington, D.C., USA (East)
Build machine configuration: 2 cores, 8 GB
Detected Next.js version: 15.2.4
Running "npm run build"
> next build
▲ Next.js 15.2.4
Creating an optimized production build ...
✓ Compiled successfully
Linting and checking validity of types ...
Collecting page data ...
Generating static pages (4/4)
✓ Generating static pages (4/4)
Finalizing page optimization ...
Collecting build traces ...
✓ Building output...

Route (app) Size First Load JS
┌ ○ / 15.7 kB 116 kB
└ ○ /_not-found 977 B 101 kB

✓ Deployment completed!
Status: Ready
```

## 🎯 Success Indicators

Look for these in Vercel:
- ✅ "Compiled successfully"
- ✅ "Building output..." (not "Exporting")
- ✅ No errors about missing directories
- ✅ Green checkmark ✓
- ✅ Status: "Ready"

## ❌ Common Mistakes to Avoid

**DON'T:**
- ❌ Set Output Directory to "out"
- ❌ Add `output: 'export'` to next.config.ts
- ❌ Create a vercel.json file
- ❌ Use static export mode

**DO:**
- ✅ Leave Output Directory blank
- ✅ Use default Next.js build
- ✅ Let Vercel auto-detect everything
- ✅ Deploy as serverless (default)

## 🔧 If You Still See Errors

### "Output directory 'out' not found"
This means Vercel is still using old cached settings.

**Fix:**
1. Go to Vercel project settings
2. Click "Deployments" tab
3. Click "Redeploy" on latest deployment
4. Make sure Output Directory is BLANK

### "routes-manifest.json not found"
This happens with static exports.

**Fix:**
- Already fixed! We removed static export config
- Just need to redeploy with correct settings

## 📱 After Successful Deploy

Your app will be live at:
- **Vercel URL**: `https://driveway-calc.vercel.app`
- Or your custom domain

Test features:
- ✅ Upload images
- ✅ Draw measurements
- ✅ Calculate area & grade
- ✅ Save jobs locally
- ✅ Works on mobile

## 🔄 Future Deployments

Every push to `main` will auto-deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

---

**Status**: ✅ Ready for Vercel deployment
**Configuration**: Standard Next.js (serverless)
**Output Directory**: BLANK (default)
