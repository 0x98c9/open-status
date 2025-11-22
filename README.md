# Open Status

A **premium, zero‑maintenance status page** built with Astro and Tailwind CSS. It provides a beautiful, dark‑mode UI, real‑time service status, uptime history bars, and a GitHub‑linked header with version badge.

![Open Status Demo](https://raw.githubusercontent.com/0x98c9/open-status/main/public/open-status.png)

---

## ✨ Features

- **Dynamic Header** – Shows project title, description, version badge, and a clickable GitHub icon.
- **Overall System Status** – Color‑coded badge with pulsing indicator.
- **Service Cards** – Each service displays name, description, real‑time status, mock uptime percentage, and a 90‑day bar chart visualising historical uptime.
- **Incident Timeline** – Past incidents displayed with timestamps and status tags.
- **Zero‑Database** – All data lives in a simple JSON file (`src/data/status.json`).
- **Responsive & Accessible** – Tailwind‑powered layout works on all screen sizes.
- **Easy to Deploy** – Works on Vercel, Netlify, Cloudflare Pages, or any static host.

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
- **services** – Array of service objects (`name`, `status`, `description`).
- **incidents** – Array of past incident objects (`date`, `title`, `status`, `body`).

The UI will automatically reflect any changes you make.

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
