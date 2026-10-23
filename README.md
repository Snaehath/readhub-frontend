# 📚 ReadHub: Intelligent News & Digital Reading Ecosystem

An intelligent, full-stack digital reading platform that brings together real-time global news, an expansive e-book archive, autonomous AI-synthesized investigative news briefings, and an agentic research chatbot.

[**Explore Live Demo →**](https://readhub-frontend.vercel.app/)

---

## ✨ Key Features

### 🌍 1. Global News Grid
- **Real-Time Coverage**: Aggregated breaking news from trusted global publishers across technology, business, politics, health, science, sports, and entertainment.
- **Regional & Categorical Filtering**: Instant filtering by country (US, India, etc.) and category tags.
- **Live News Ticker**: Marquee ticker highlighting breaking headlines at a glance.
- **Deep Reader View**: Distraction-free article preview and reading mode.

### 📜 2. Timeless E-Book Archive
- **Curated Digital Library**: Browse books across diverse genres including History, Science, Business, Health, Horror, and Children's literature.
- **Category Filter & Search**: Quick discovery with instant search and category tags.
- **Interactive Reader**: Clean in-browser e-book reader experience.

### ⚡ 3. AI News (Autonomous Investigative Briefings)
- **Synthetic Journalism**: Continuous, in-depth briefings researched and synthesized by autonomous AI news agents.
- **Deep Context & Analysis**: Detailed breakdown of complex trends across technology, global markets, and emerging science.

### 🤖 4. Agentic AI ChatBot (Streaming Investigative Assistant)
- **Real-Time Activity Console**: Live transparency into the agent's thoughts, strategy formation, tool calls, and execution steps.
- **Source Auditor & Vault**: Complete citation tracking with direct links to verified sources used during fact-checking and synthesis.
- **Quick-Start Prompts**: Contextual suggestion chips for top global headlines, 60-second briefings, market insights, and book recommendations.

### 🧠 5. News Intelligence Suite
- **Ask AI**: Select any news article to extract core entities, retrieve related contextual reports, and generate multi-perspective explanations.
- **Future AI (Future Insight)**: Predictive logic engine that models potential downstream developments and simulates future headlines based on current events.

### 👤 6. Personalization & Profile
- **User Authentication**: Secure login, registration, and session management.
- **Profile Customization**: Customizable user profile with avatar selection.
- **Dark / Light Theme**: Seamless theme toggling with persistent preferences.

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

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   BACKEND_API_URL=http://localhost:5000
   ```
   The frontend proxies `/api` requests to this server. In production, set `BACKEND_API_URL=https://readhub-backend.onrender.com` in the frontend host's server-side environment. Configure the backend's `FRONTEND_ORIGINS` with the deployed frontend origin.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

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
