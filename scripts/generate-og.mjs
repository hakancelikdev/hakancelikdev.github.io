/**
 * Generates src/assets/images/default.png — the site-wide OG / Twitter card image.
 * Run with: node scripts/generate-og.mjs
 *
 * Layout (1200×628):
 *   Left  — HC logo (400×400, vertically centred)
 *   Right — "Hakan Çelik" + "Software Engineer" + "hakancelik.dev"
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const W = 1200;
const H = 628;
const BG = { r: 38, g: 42, b: 60 }; // matches logo background (#262a3c)

// Resize logo to 360×360
const logoPath = join(root, 'src/assets/images/logo.png');
const logo = await sharp(readFileSync(logoPath)).resize(360, 360).png().toBuffer();

// SVG layer: text + decorative accent line
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- subtle right-side text block -->
  <text x="520" y="224"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="72" font-weight="700" fill="#ffffff" letter-spacing="-1">
    Hakan Çelik
  </text>
  <text x="522" y="294"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="34" font-weight="400" fill="#94a3b8" letter-spacing="1">
    Software Engineer
  </text>
  <!-- accent divider -->
  <line x1="522" y1="330" x2="900" y2="330" stroke="#3b4a6b" stroke-width="1.5"/>
  <!-- domain -->
  <text x="522" y="374"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="28" font-weight="400" fill="#64748b" letter-spacing="1">
    hakancelik.dev
  </text>
</svg>`;

await sharp({
  create: { width: W, height: H, channels: 3, background: BG },
})
  .composite([
    { input: Buffer.from(svg), top: 0, left: 0 },
    { input: logo, top: Math.round((H - 360) / 2), left: 80 },
  ])
  .jpeg({ quality: 95 })
  .toFile(join(root, 'src/assets/images/default.png'));

console.log('✓ OG image generated → src/assets/images/default.png');
