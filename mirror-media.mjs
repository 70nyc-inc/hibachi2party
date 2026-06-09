#!/usr/bin/env node
/** Download wp-content images into /media for static hosting. Run before retiring WordPress. */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REMOTE = "https://hibachi2partys.com/wp-content/uploads";

const FILES = [
  "2020/01/jermaine-ee-MMdf6NlivGs-unsplash.jpg",
  "2024/03/HIBACHI2PARTY_LOGO2.png",
  "2024/03/cropped-d9a8ca2e-8cac-4c7c-ae4b-549a490520ea-3.png",
  "2024/04/fiaz-mohammed-wL-kfSn_ttk-unsplash.jpg",
  "2024/04/actionvance-guy5aS3GvgA-unsplash.jpg",
  "2024/04/Screenshot-2024-06-13-at-12.03.37%E2%80%AFPM.png",
  "2024/05/WechatIMG350.jpeg",
  "2024/06/Baltimore-Md.webp",
  "2024/06/Orlando-FL.jpeg",
  "2024/06/article-austin-travel-hero.webp",
  "2024/06/houston-texas_HOUSTON1222-1aa2b78360be48e5ab3ee4a6fe3459b8.jpg",
  "2024/06/night-aerial-chicago-illinois-usa_980x650.jpg",
  "2024/06/DJI_0038_Enhanced_NR_9828fabc-3956-4192-b353-a1bbf8313248.jpg",
  "2024/06/Screenshot-2024-06-13-at-12.10.33%E2%80%AFPM.png",
  "2024/06/Screenshot-2024-06-13-at-12.14.25%E2%80%AFPM.png",
  "2024/06/Screenshot-2024-06-13-at-12.14.25%E2%80%AFPM-1.png",
];

for (const file of FILES) {
  const dest = path.join(ROOT, "media", file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  execSync(`curl -sL -A "Mozilla/5.0" "${REMOTE}/${file}" -o "${dest}"`, { stdio: "pipe" });
  const size = fs.statSync(dest).size;
  if (size < 512) throw new Error(`Download failed or too small: ${file}`);
  console.log(`  ✓ media/${file} (${size} bytes)`);
}

console.log(`Done — ${FILES.length} files in media/`);
