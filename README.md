# ReadHub Frontend

The Next.js frontend for ReadHub, a news discovery and digital reading app with an e-book catalog, AI reports, and an AI assistant.

[**Explore Live Demo →**](https://readhub-frontend.vercel.app/)

---

## ✨ Key Features

### News
- Browse saved coverage from US and India news sources, with category, region, and search controls.
- Open the original publisher article or use the in-app article preview where available.
- View a headline ticker for recently collected stories.

### E-books
- Browse and search the book catalog by category.
- Open available reading links and use the in-browser reader where supported.

### AI reports
- Read AI-written reports synthesized from saved news coverage, with links and inline citations to the source articles.
- Admins can generate reports on demand from saved coverage. Scheduled report publishing is currently disabled.

### AI assistant
- Ask questions about current saved news or books.
- View source references for news answers and use suggested prompts to get started.

### Article insights
- Ask AI to explain a selected news article.
- Request a forecast that separates evidence, assumptions, and possible future developments.

### Account and preferences
- Sign in, manage a profile, and choose an avatar.
- Switch between light and dark themes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) icons, [Sonner](https://sonner.emilkowal.ski/) toasts, [Vaul](https://vaul.emilkowal.ski/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown), `remark-gfm`, `rehype-raw`, `rehype-external-links`
- **Data Fetching**: [SWR](https://swr.vercel.app/), [Axios](https://axios-http.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Snaehath/readhub-frontend.git
   cd readhub-frontend
   ```

2. **Install the exact locked dependencies:**
   ```bash
   npm ci
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   BACKEND_API_URL=http://localhost:5000
   ```
   The frontend proxies `/api` requests to this server. In production, set `BACKEND_API_URL` to the deployed backend URL in the frontend host's server-side environment. Configure the backend's `FRONTEND_ORIGINS` with the deployed frontend origin.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## News refresh and AI reports

News refresh and AI report generation are manual for now. An admin can refresh saved US or India coverage and generate an AI report from the app. The app remains usable without a scheduled workflow; it will not automatically refresh headlines or publish daily editions. See the [backend operations guide](https://github.com/Snaehath/readhub-backend#operations-and-deployment-checklist) for details.

---

## 📦 Scripts

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Runs the production server.
- `npm run lint` - Runs ESLint checks.
- `npm run type-check` - Runs TypeScript type validation.

---

## 🌐 Live Deployment

ReadHub is deployed and accessible at:  
👉 **[https://readhub-frontend.vercel.app](https://readhub-frontend.vercel.app/)**
