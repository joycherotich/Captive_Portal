# DCT — Captive Portal

A full-featured WiFi Captive Portal built with React 18 + Tailwind CSS.

## Features
- **Auth**: Login, Self-Registration, Voucher Activation
- **Packages**: Browse & subscribe to data plans
- **Dashboard**: Live usage stats, speed metrics, network quality charts
- **Profile**: Edit personal info, security settings
- **Subscriptions**: Plan history, payment methods, renewal
- **My Providers**: View linked ISPs with uptime/SLA info
- **Link Provider**: Search & connect ISPs
- **Other Services**: Airtime, Electricity (KPLC), Water, TV, Transport, etc.
- **Support**: FAQs accordion, Support Tickets, Callback Requests

## Tech Stack
- React 18 + React Router v6
- Tailwind CSS v3
- Recharts (charts)
- Lucide React (icons)
- Vite (build tool)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The built files will be in the `dist/` folder — deploy those to any web server.

## Customization
- Colors: Edit `tailwind.config.js` and `src/index.css` (CSS variables)
- Brand name: Search/replace "NetConnect" across files
- Currency: Change "KES" to your currency in package/service files
- Packages: Edit `src/pages/PackagesPage.jsx` → `PACKAGES` array

## Deployment
Upload the contents of `dist/` to your captive portal server.
Point your router's captive portal redirect to `index.html`.

---
Built with ❤️ for seamless WiFi experiences
