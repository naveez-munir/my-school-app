# PWA Icons Directory

## Current Setup
✅ Using SVG icon (app-icon.svg) - works for all sizes
✅ PWA is configured and working

## To Add PNG Icons (Optional)

### Option 1: Use Online Tool (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload app-icon.svg
3. Download the generated icons
4. Place them in this directory

### Option 2: Use PWA Builder
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload app-icon.svg
3. Download all sizes
4. Place them in this directory

### Option 3: Manual Conversion
If you have ImageMagick installed:

```bash
# Install ImageMagick (if not installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Convert SVG to PNGs
convert app-icon.svg -resize 72x72 icon-72x72.png
convert app-icon.svg -resize 96x96 icon-96x96.png
convert app-icon.svg -resize 128x128 icon-128x128.png
convert app-icon.svg -resize 144x144 icon-144x144.png
convert app-icon.svg -resize 152x152 icon-152x152.png
convert app-icon.svg -resize 192x192 icon-192x192.png
convert app-icon.svg -resize 384x384 icon-384x384.png
convert app-icon.svg -resize 512x512 icon-512x512.png
convert app-icon.svg -resize 180x180 apple-touch-icon.png
```

### Required Sizes
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (required for PWA)
- icon-384x384.png
- icon-512x512.png (required for PWA)
- apple-touch-icon.png (180x180 for iOS)

## After Adding PNG Icons

Update these files to use PNG instead of SVG:

1. public/manifest.json - Update icons array
2. vite.config.ts - Update manifest.icons
3. app/root.tsx - Update apple-touch-icon link

Note: SVG works fine for most cases. PNG is only needed for better compatibility with older devices.
