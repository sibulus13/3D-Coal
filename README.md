# 3D Rotating Coal

A Next.js application featuring a 3D rotating coal that starts in pure darkness (showing only shadow edges) and is gradually illuminated by a holy Christmas light, accompanied by dual music tracks: "Carol of the Bells - Funny Indian Christmas" and "Evil Morty (From Rick and Morty)".

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add audio files:

   - Place `carol-of-bells.mp3` in `public/audio/` directory
     - File should be "Carol of the Bells - Funny Indian Christmas"
   - Place `evil-morty.mp3` in `public/audio/` directory
     - File should be "Evil Morty (From Rick and Morty).mp3"

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Audio Tracks

### Carol of the Bells

- **Start time**: 3 seconds into animation
- **Duration**: 24 seconds fade-in
- **Role**: Holy Christmas light theme

### Evil Morty Song

- **Start time**: 10 seconds into animation
- **Track position**: Begins at 37-second timestamp
- **Fade-in**: Starts at 15 seconds (5 seconds after track begins) over 3 seconds
- **Volume**: 80% of primary track for blend effect
- **Role**: Dramatic counter-theme

Both tracks play simultaneously from 10 seconds onward, creating a blended audio experience.

## Features

- Pure dark beginning with only shadow edges visible
- 3-second initial dark phase
- Gradual 24-second holy light reveal animation
- Dual synchronized audio playback with staggered starts
- Dramatic theatrical spotlights at reveal end
- Mute button (appears after 4 seconds)
- Responsive 3D scene with realistic coal geometry
- OrbitControls for camera rotation

## Tech Stack

- Next.js 14
- React Three Fiber
- Three.js
- TypeScript
- Simplex Noise for procedural generation
