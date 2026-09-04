/**
 * Local QR generator for Skin Complete cupping print asset.
 * No external APIs — generation and verification run entirely offline.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";
import jsQR from "jsqr";

const TARGET_URL = "https://skincomplete.eu/cupping";
const DPI = 300;
/** 2 inch square at 300 DPI — standard print size for flyer/sticker QR codes. */
const PRINT_WIDTH_INCHES = 2;
const PNG_WIDTH_PX = Math.round(PRINT_WIDTH_INCHES * DPI);
const MARGIN_MODULES = 4;
const DARK = "#000000";
const LIGHT = "#FFFFFF";

const QR_CREATE_OPTIONS = {
  errorCorrectionLevel: "H",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../../print");

function buildRectSvg(qr) {
  const dataModules = qr.modules.size;
  const totalModules = dataModules + MARGIN_MODULES * 2;
  const rects = [
    `<rect width="${totalModules}" height="${totalModules}" fill="${LIGHT}"/>`,
  ];

  for (let row = 0; row < dataModules; row += 1) {
    for (let col = 0; col < dataModules; col += 1) {
      if (!qr.modules.get(col, row)) {
        continue;
      }

      const x = col + MARGIN_MODULES;
      const y = row + MARGIN_MODULES;
      rects.push(
        `<rect x="${x}" y="${y}" width="1" height="1" fill="${DARK}"/>`,
      );
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalModules} ${totalModules}" shape-rendering="crispEdges">`,
    rects.join(""),
    "</svg>",
  ].join("");
}

function assertQuietZoneFromMatrix(qr) {
  const dataModules = qr.modules.size;
  const expectedTotal = dataModules + MARGIN_MODULES * 2;

  if (MARGIN_MODULES < 4) {
    throw new Error(`Configured margin ${MARGIN_MODULES} is below the required 4 modules.`);
  }

  return {
    dataModules,
    marginModules: MARGIN_MODULES,
    totalModules: expectedTotal,
  };
}

async function decodeRasterBuffer(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const result = jsQR(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    { inversionAttempts: "dontInvert" },
  );

  return result?.data ?? null;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const svgPath = path.join(OUTPUT_DIR, "skincomplete-cupping-qr.svg");
  const pngPath = path.join(OUTPUT_DIR, "skincomplete-cupping-qr.png");

  const qr = QRCode.create(TARGET_URL, QR_CREATE_OPTIONS);
  const quietZoneInfo = assertQuietZoneFromMatrix(qr);

  const svgString = buildRectSvg(qr);

  if (!svgString.includes("<svg")) {
    throw new Error("Generated output is not valid SVG.");
  }

  if (svgString.includes("rx=") || svgString.includes("ry=")) {
    throw new Error("SVG contains rounded corners.");
  }

  await fs.writeFile(svgPath, svgString, "utf8");

  const pngBuffer = await QRCode.toBuffer(TARGET_URL, {
    errorCorrectionLevel: "H",
    margin: MARGIN_MODULES,
    type: "png",
    width: PNG_WIDTH_PX,
    color: {
      dark: DARK,
      light: LIGHT,
    },
  });

  await sharp(pngBuffer)
    .withMetadata({ density: DPI })
    .png()
    .toFile(pngPath);

  const pngMeta = await sharp(pngPath).metadata();
  const pngFileBuffer = await fs.readFile(pngPath);
  const decodedFromPng = await decodeRasterBuffer(pngBuffer);
  const decodedFromPngFile = await decodeRasterBuffer(pngFileBuffer);
  const decodedFromSvg = await decodeRasterBuffer(await fs.readFile(svgPath));

  const failures = [];

  if (decodedFromPng !== TARGET_URL) {
    failures.push(
      `PNG buffer decode mismatch: got "${decodedFromPng ?? "null"}", expected "${TARGET_URL}"`,
    );
  }

  if (decodedFromPngFile !== TARGET_URL) {
    failures.push(
      `PNG file decode mismatch: got "${decodedFromPngFile ?? "null"}", expected "${TARGET_URL}"`,
    );
  }

  if (decodedFromSvg !== TARGET_URL) {
    failures.push(
      `SVG decode mismatch: got "${decodedFromSvg ?? "null"}", expected "${TARGET_URL}"`,
    );
  }

  if (pngMeta.density !== DPI) {
    failures.push(`PNG density is ${pngMeta.density ?? "unset"}, expected ${DPI}.`);
  }

  if (pngMeta.width !== PNG_WIDTH_PX || pngMeta.height !== PNG_WIDTH_PX) {
    failures.push(
      `PNG dimensions are ${pngMeta.width}x${pngMeta.height}, expected ${PNG_WIDTH_PX}x${PNG_WIDTH_PX}.`,
    );
  }

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }

  console.log("Skin Complete cupping QR generated successfully.");
  console.log(`URL encoded: ${TARGET_URL}`);
  console.log(`Error correction: H`);
  console.log(
    `Quiet zone: ${quietZoneInfo.marginModules} modules on each side (${quietZoneInfo.dataModules} data modules, ${quietZoneInfo.totalModules} total modules in SVG viewBox)`,
  );
  console.log(`PNG: ${PNG_WIDTH_PX}px square at ${DPI} DPI (${PRINT_WIDTH_INCHES}" print width)`);
  console.log(`SVG: ${svgPath}`);
  console.log(`PNG: ${pngPath}`);
  console.log(`Decode check PNG: ${decodedFromPng}`);
  console.log(`Decode check SVG: ${decodedFromSvg}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
