# 3D Rotating Coal - Next.js Project Plan

## Overview

A Next.js application that displays a 3D rotating coal model using React Three Fiber and Three.js.

## Technology Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **React Three Fiber** (@react-three/fiber) - React renderer for Three.js
- **Drei** (@react-three/drei) - Useful helpers for R3F
- **Three.js** - 3D graphics library

## Project Structure

```
3D Coal/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with 3D coal
│   └── globals.css         # Global styles
├── components/
│   └── Coal3D.tsx         # 3D coal component with lighting animation
├── public/                 # Static assets
│   └── audio/
│       └── carol-of-bells.mp3  # Carol of the Bells - Funny Indian Christmas
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Implementation Details

### Animation Sequence

1. **Phase 1 - Pure Darkness**: Scene starts completely dark, only shadow of coal edge visible rotating
2. **Phase 2 - Holy Light Reveal**: A holy Christmas light gradually illuminates the rotating coal
3. **Audio**: "Carol of the Bells - Funny Indian Christmas" plays during the reveal

### 3D Coal Component

- Use React Three Fiber Canvas
- Create a coal-like 3D object (mesh with dark material)
- Implement rotation animation using useFrame hook
- **Lighting Animation**:
  - Initial: Minimal ambient light (only shadows visible)
  - Transition: Holy light (directional light with warm glow) gradually increases
  - Use point light or spotlight for dramatic "holy" effect
- Camera positioning for optimal view
- Shadow casting enabled for edge visibility in dark phase

### Coal Representation

- Use a rounded box or irregular mesh with dark, matte material
- Enable shadow casting and receiving
- Organic shape resembling coal

### Features

- Two-phase lighting animation (dark → holy light)
- Smooth rotation animation throughout
- Audio playback synchronized with light reveal
- Responsive design
- Dark theme transitioning to illuminated scene

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/three": "^0.158.0",
    "typescript": "^5.0.0"
  }
}
```

## Next Steps

1. Initialize Next.js project
2. Install dependencies
3. Create 3D component with dark phase (shadow-only)
4. Implement holy light animation sequence
5. Add audio playback component
6. Synchronize audio with light reveal
7. Style and polish
