# Open Status

A **premium, zero‑maintenance status page** built with Astro and Tailwind CSS. It provides a beautiful, dark‑mode UI, real‑time service status, uptime history bars, and a GitHub‑linked header with version badge.

[![Open Status Demo](https://raw.githubusercontent.com/0x98c9/open-status/main/public/open-status.png)](https://open-status.pages.dev/)

---

## ✨ Features

- **🔴 Live Status Checks** – Real-time health monitoring on every page load (SSR)
- **🌍 Edge-Powered** – Runs on Cloudflare's 300+ global datacenters
- **⚡ Dynamic Rendering** – No static JSON files, status fetched live from the edge
- **📊 Response Time Tracking** – Shows actual latency for each service
- **🗺️ Geo-Location Aware** – Displays which city the check was performed from
- **🔄 Auto-Refresh** – Client-side updates every 60 seconds
- **📈 Uptime History** – 90-day bar chart visualization
- **🎨 Premium Dark UI** – Modern, glassmorphic design with smooth animations
- **📱 Fully Responsive** – Works perfectly on all devices
- **🚀 Zero Database** – Serverless architecture, no maintenance required

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/0x98c9/open-status.git
cd open-status

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:4321` to see the status page in action.

### Building for Production

```bash
npm run build   # Generates static files in ./dist
npm run preview # Preview the production build locally
```

---

## 📦 Configuration

All status information is stored in `src/data/status.json`. Edit this file to update:

- **title** – Page title.
- **description** – Short tagline.
- **repo_url** – URL of the GitHub repository (used for the header icon).
- **version** – Current version badge.
- **overall_status** – Overall system health (`operational`, `degraded`, `outage`).
- **services** – Array of service objects (`name`, `url`, `status`, `description`).
- **incidents** – Array of past incident objects (`date`, `title`, `status`, `body`).

The UI will automatically reflect any changes you make.

---

## 🌍 Live Monitoring (Cloudflare Edge)

This status page runs on **Cloudflare's Edge Network** (300+ cities worldwide), making it faster and more accurate than traditional single-region deployments.

### How It Works

1. **Edge API Route** (`/api/status`) – Checks service health from the nearest Cloudflare datacenter
2. **Real-time Updates** – Page automatically refreshes status every 60 seconds
3. **Geo-Location Info** – Shows which city the check was performed from (when deployed to Cloudflare)
4. **Response Time Tracking** – Displays actual response times for each service

### API Endpoint

Visit `/api/status` to get JSON status data:

```json
{
  "checked_from": {
    "city": "Mumbai",
    "country": "IN",
    "datacenter": "BOM"
  },
  "timestamp": "2025-11-22T18:00:00.000Z",
  "overall_status": "operational",
  "services": [
    {
      "name": "Website",
      "url": "https://open-status.pages.dev/",
      "status": "operational",
      "responseTime": 145
    }
  ]
}
```

---

## 🚀 Deployment to Cloudflare Pages

1. **Push to GitHub** (already done!)

2. **Go to Cloudflare Dashboard**
   - Navigate to **Workers & Pages**
   - Click **Create Application** → **Pages** → **Connect to Git**

3. **Select Your Repository**
   - Choose `0x98c9/open-status`

4. **Build Settings**
   - Framework Preset: **Astro**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Deploy!**
   - Click **Save and Deploy**
   - Your status page will be live at `https://open-status.pages.dev`

### Why Cloudflare?

- ⚡ **300+ Edge Locations** – Checks run from the nearest datacenter to your users
- 🌐 **Global Accuracy** – More reliable than single-region checks
- 🔥 **Zero Cold Starts** – Instant response times
- 💰 **Free Tier** – Generous limits for status pages

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/awesome-feature`).
3. Make your changes.
4. Ensure the dev server still works (`npm run dev`).
5. Submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👀 Want to learn more?

Check out the [Astro documentation](https://docs.astro.build) or join the community on the [Astro Discord server](https://astro.build/chat).
