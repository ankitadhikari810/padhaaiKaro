import { Jimp } from 'jimp'

const SRC = 'C:/Users/anku/OneDrive/Documents/WhatsApp Image 2026-05-18 at 4.34.49 PM.jpeg'
const OUT = 'public/brand-logo.png'

const img = await Jimp.read(SRC)

// Make near-white background transparent (logo elements are dark/colored).
const HARD = 246 // brighter than this => fully transparent
const SOFT = 220 // SOFT..HARD => partial alpha for smooth edges

const { data } = img.bitmap
for (let i = 0; i < data.length; i += 4) {
  const min = Math.min(data[i], data[i + 1], data[i + 2]) // whites have high min
  if (min >= HARD) {
    data[i + 3] = 0
  } else if (min >= SOFT) {
    const t = (min - SOFT) / (HARD - SOFT)
    data[i + 3] = Math.round(data[i + 3] * (1 - t))
  }
}

img.autocrop({ cropOnlyFrames: false, tolerance: 0.0002 })

await img.write(OUT)
console.log(`Done -> ${OUT} (${img.bitmap.width}x${img.bitmap.height})`)
