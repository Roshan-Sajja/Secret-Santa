
# Secret Santa Prototype UI

Interactive Secret Santa planner built with React and Vite. Add participants, set exclusion rules, and generate feasible pairings with helpful feedback.

## Product Plan
I treated this like a mini product owner assignment and listed features by release. I have these in a Google Sheet with columns: Feature, Release (Prototype/v1/v2), Notes

## Features in this Prototype
- Add participants with email validation and duplicate detection
- Define exclusion rules (e.g., prevent drawing a partner or yourself)
- Load sample data for quick exploration
- Feasibility indicator and backtracking pairing generator with failure reasons
- Animated, Tailwind-powered UI with holiday styling

## Tech Stack
- React 18 + Vite 6
- Tailwind CSS 4
- motion for animations, lucide-react for icons

## Getting Started
1) Install dependencies: `npm install`
2) Start the dev server: `npm run dev` (opens on `http://localhost:5173`)
3) Build for production: `npm run build` (outputs to `dist/`)

## Minimal Feature Checklist
- Manual name/email entry
- Bulk-load test participants
- Add previous assignments/exclusions
- Generate pairings, show message when no valid solution exists, and render results

## Usage
- Add each participant’s name and email, or click **Load Sample Data**
- Add exclusion rules to block specific giver/receiver pairs
- Check the feasibility indicator, then click **Generate Pairings**
- If generation fails, review the listed reasons; use **Reset** to start fresh

## Project Structure
- `src/main.tsx` — app entry point
- `src/app/App.tsx` — page layout and state orchestration
- `src/app/components/` — UI pieces for participants, exclusions, actions, and results
- `src/app/utils/pairing.ts` — pairing/backtracking logic and feasibility helper
- `src/styles/` — Tailwind setup, theme tokens, and fonts

## Notes
- Next steps if this shipped: hook up real persistence, secure user-specific results, and wire notifications.
