// Генерация PWA-иконок без внешних зависимостей: рисуем пиксельно и жмём zlib в PNG.
import zlib from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, "..", "public");
const icons = join(pub, "icons");
mkdirSync(icons, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function png(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.subarray(y * width * 4, (y + 1) * width * 4).copy(raw, y * (width * 4 + 1) + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function hex(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

// Рисуем: закруглённый (или полный для maskable) квадрат-фон + кремовый полумесяц.
function draw(size, { maskable = false } = {}) {
  const bg = hex("#5f8c6b");
  const fg = hex("#faf8f4");
  const buf = Buffer.alloc(size * size * 4);
  const r = size * 0.22; // радиус скругления
  const pad = maskable ? size * 0.16 : 0; // safe zone для maskable
  const inner = size - pad * 2;

  // геометрия полумесяца
  const cx = size * 0.52, cy = size * 0.5;
  const R = inner * 0.30;
  const cx2 = cx + R * 0.55, cy2 = cy - R * 0.28, R2 = R * 0.92;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // фон со скруглением углов (для не-maskable)
      let inside = true;
      if (!maskable) {
        const dx = Math.min(x - r, size - r - x, 0);
        const dy = Math.min(y - r, size - r - y, 0);
        if (dx < 0 && dy < 0 && dx * dx + dy * dy > r * r) inside = false;
      }
      if (!inside) {
        buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0; buf[i + 3] = 0;
        continue;
      }
      buf[i] = bg[0]; buf[i + 1] = bg[1]; buf[i + 2] = bg[2]; buf[i + 3] = 255;

      const d1 = Math.hypot(x - cx, y - cy);
      const d2 = Math.hypot(x - cx2, y - cy2);
      if (d1 <= R && d2 > R2) {
        buf[i] = fg[0]; buf[i + 1] = fg[1]; buf[i + 2] = fg[2]; buf[i + 3] = 255;
      }
      // маленькая звезда справа сверху
      const sx = size * 0.70, sy = size * 0.34, sr = inner * 0.045;
      if (Math.hypot(x - sx, y - sy) <= sr) {
        buf[i] = fg[0]; buf[i + 1] = fg[1]; buf[i + 2] = fg[2]; buf[i + 3] = 255;
      }
    }
  }
  return png(size, size, buf);
}

writeFileSync(join(icons, "icon-192.png"), draw(192));
writeFileSync(join(icons, "icon-512.png"), draw(512));
writeFileSync(join(icons, "icon-512-maskable.png"), draw(512, { maskable: true }));
writeFileSync(join(pub, "apple-touch-icon.png"), draw(180));

// SVG-фавикон
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#5f8c6b"/>
  <path d="M40 20a14 14 0 1 0 0 24 11 11 0 1 1 0-24z" fill="#faf8f4"/>
  <circle cx="46" cy="22" r="3" fill="#faf8f4"/>
</svg>`;
writeFileSync(join(pub, "favicon.svg"), favicon);

console.log("Иконки сгенерированы в public/ и public/icons/");
