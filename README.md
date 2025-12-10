# LitenSky

A lightweight weather experience built with React + TypeScript + Vite. Search for cities, see real‑time conditions, and enjoy contextual backdrops that match the current atmosphere.

## What this app does
- Autocomplete and search for cities, then show the current conditions and key details.
- Save and revisit recent cities with quick access.
- Display dynamic gradients and optional rain effects based on weather and time of day.
- Render city-specific hero images to set the mood.

## Services used
- Weather data: [Tomorrow.io](https://www.tomorrow.io) realtime API.
- City imagery: [Unsplash](https://unsplash.com/developers) search API for backdrop photos.
- City search/autocomplete: [Mapbox](https://www.mapbox.com/) geocoding.

## Getting started
```bash
npm install
npm run dev
```

### Environment variables
Create a `.env` file at the project root (values below are placeholders):
```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_TOMORROW_API_KEY=your_tomorrow_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## Commands
- Run dev server: `npm run dev`
- Build: `npm run build`
- Test: `npx vitest` (or `npx vitest --ui` for the UI runner)
- Storybook: `npm run storybook`

## Project links
- Live app: https://liten-sky.vercel.app
- Source: https://github.com/dzsodzso63/LitenSky

## License
This project is open-sourced under the MIT License. See the `LICENSE` file for details.
