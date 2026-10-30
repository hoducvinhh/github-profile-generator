# 🚀 ProfileForge

> **Visual GitHub Profile README Builder with live preview, real GitHub data import, reusable components, customizable themes, and one-click Markdown export.**

[![CI](https://github.com/profileforge/profileforge/actions/workflows/ci.yml/badge.svg)](https://github.com/profileforge/profileforge/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

---

## 🌟 Highlights

- **Visual Drag-and-Drop Editor**: Reorder, duplicate, toggle, and configure profile sections using `@dnd-kit`.
- **Real GitHub Data Import**: Seamlessly import your avatar, bio, top starred repos, and dominant languages via Octokit.
- **5 Pre-Built Templates**:
  1. **Modern Developer**: High-impact layout with typing banners, tech stack matrix, and streak cards.
  2. **Minimalist**: Clean typographic layout, concise bio, subtle badges.
  3. **Executive & Lead**: Structured executive summary, team collaboration highlights, and verified stats.
  4. **Terminal**: Monospaced hacker aesthetic (`$ whoami`, `$ cat skills.sh`).
  5. **Creative**: Vibrant palettes, dynamic badges, and quote counters.
- **6 Synchronized Themes**: GitHub Dark, GitHub Light, Dracula, Nord, Tokyo Night, Catppuccin.
- **Strict GFM Serializer**: Produces 100% compliant GitHub Flavored Markdown—never brittle browser UI markup.
- **Bi-Directional Live Preview**: Live sanitized GitHub-styled rendering alongside CodeMirror 6 raw Markdown editor.
- **Zero Lock-In & Portable**: 1-click clipboard copy, `README.md` download, ZIP packaging, and full JSON configuration backup/restore. No account or database required.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) + [Immer](https://immerjs.github.io/immer/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Markdown Preview**: `react-markdown` + `remark-gfm` + `rehype-sanitize`
- **Raw Editor**: CodeMirror 6 (`@uiw/react-codemirror`)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.18.0
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/profileforge.git
cd profileforge

# Install dependencies
pnpm install

# (Optional) Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

```bash
# Run unit tests
pnpm test

# Type check
pnpm typecheck

# Build for production
pnpm build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
