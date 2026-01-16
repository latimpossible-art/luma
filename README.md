# Luma - Inner Reflection

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" />
</div>

<p align="center">
  <strong>A sanctuary for your thoughts.</strong><br>
  Daily self-check and emotion journaling powered by AI.
</p>

---

## ✨ Features

- 🎯 **Daily Self-Check** - Track your mood and emotions daily
- 🤖 **AI-Powered Insights** - Get personalized insights from your journal entries
- 🎤 **Voice Journaling** - Speak your thoughts, AI transcribes and analyzes
- 📅 **Streak Calendar** - Visualize your check-in consistency
- 🧘 **Guided Breathing** - Box breathing exercise for relaxation
- 💪 **Positive Affirmations** - Daily motivation cards
- 🌐 **Bilingual** - Supports English & Indonesian

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database (PostgreSQL recommended, or SQLite for local dev)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/luma.git
cd luma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luma"
# Or for SQLite (simpler for local development):
# DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"

# AI Service (Groq)
GROQ_API_KEY="your-groq-api-key"
```

> 💡 **Get GROQ API Key**: Sign up at [console.groq.com](https://console.groq.com) (free tier available)

> 💡 **Generate NEXTAUTH_SECRET**: Run `openssl rand -base64 32` in terminal

### 4. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📁 Project Structure

```
luma/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── check-in/        # Daily check-in flow
│   │   ├── breathing/       # Breathing exercise
│   │   ├── affirmations/    # Affirmation cards
│   │   ├── history/         # Journal history
│   │   └── voice-journal/   # Voice recording
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── features/        # Feature components
│   │   ├── providers/       # Context providers
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities & services
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Prisma ORM + PostgreSQL/SQLite |
| Auth | NextAuth.js |
| AI | Groq (Llama 3.3 70B) |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

Build the production bundle:

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for mental wellness
</p>
