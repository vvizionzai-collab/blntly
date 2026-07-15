/**
 * Generates PNG icon assets from blntly-icon.svg using the sharp library.
 * Run once after npm ci: node scripts/generate-icons.mjs
 *
 * Requires: npm install --save-dev sharp
 */

import { createRequire } from "module";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error(
    "sharp not installed. Run: npm install --save-dev sharp\nThen re-run: node scripts/generate-icons.mjs"
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "blntly-icon.svg");
const svgBuffer = readFileSync(svgPath);

const iconsDir = join(root, "public", "icons");
const splashDir = join(root, "public", "splash");
mkdirSync(iconsDir, { recursive: true });
mkdirSync(splashDir, { recursive: true });

const sizes = [
  // PWA
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  // Maskable (with 20% safe-zone padding — background fills the bleed)
  { name: "icon-maskable-192.png", size: 192, maskable: true },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
  // Apple touch icons
  { name: "apple-touch-icon.png", size: 180 },
  { name: "apple-touch-icon-152.png", size: 152 },
  { name: "apple-touch-icon-120.png", size: 120 },
  // Notification badge
  { name: "badge-96.png", size: 96 },
  // Shortcuts
  { name: "shortcut-shop.png", size: 96 },
  { name: "shortcut-track.png", size: 96 },
];

async function generateIcons() {
  for (const { name, size, maskable } of sizes) {
    const iconSize = maskable ? Math.round(size * 0.6) : size;
    const padding = maskable ? Math.round(size * 0.2) : 0;

    const icon = await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 7, g: 8, b: 11, alpha: 1 }, // #07080b
      })
      .png()
      .toBuffer();

    await sharp(icon)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, name));

    console.log(`✓ ${name} (${size}×${size})`);
  }
}

// Splash screens: dark background with centered logo
const splashSizes = [
  { name: "splash-1290x2796.png", w: 1290, h: 2796 },
  { name: "splash-1170x2532.png", w: 1170, h: 2532 },
  { name: "splash-750x1334.png", w: 750, h: 1334 },
];

async function generateSplash() {
  for (const { name, w, h } of splashSizes) {
    const logoSize = Math.round(Math.min(w, h) * 0.25);
    const logo = await sharp(svgBuffer).resize(logoSize, logoSize).png().toBuffer();

    // Create dark background
    const background = await sharp({
      create: { width: w, height: h, channels: 4, background: { r: 7, g: 8, b: 11, alpha: 1 } },
    })
      .png()
      .toBuffer();

    // Composite logo centered
    await sharp(background)
      .composite([{
        input: logo,
        top: Math.round((h - logoSize) / 2),
        left: Math.round((w - logoSize) / 2),
      }])
      .png()
      .toFile(join(splashDir, name));

    console.log(`✓ ${name} (${w}×${h})`);
  }
}

(async () => {
  console.log("Generating icons...");
  await generateIcons();
  console.log("Generating splash screens...");
  await generateSplash();
  console.log("\nAll assets generated in public/icons/ and public/splash/");
})();
