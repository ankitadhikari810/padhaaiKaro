import { Jimp } from 'jimp'

const SRC = 'C:/Users/anku/OneDrive/Documents/logoo111.png'
const OUT = 'public/logo.png'

const img = await Jimp.read(SRC)

// Make near-white background transparent.
// The logo (navy + blue) is dark, so a high brightness threshold is safe.
const HARD = 244 // brighter than this => fully transparent
const SOFT = 205 // between SOFT..HARD => partial alpha for smooth anti-aliased edges

const { data, width, height } = img.bitmap
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const min = Math.min(r, g, b) // whites have high min across all channels

  if (min >= HARD) {
    data[i + 3] = 0
  } else if (min >= SOFT) {
    // linearly fade alpha across the edge band
    const t = (min - SOFT) / (HARD - SOFT)
    data[i + 3] = Math.round(data[i + 3] * (1 - t))
  }
}

// Trim the fully-transparent border so the logo fills its container.
img.autocrop({ cropOnlyFrames: false, tolerance: 0.0002 })

await img.write(OUT)
console.log(`Done -> ${OUT} (${img.bitmap.width}x${img.bitmap.height})`)
