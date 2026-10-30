# Contributing to ProfileForge

Thank you for your interest in contributing to **ProfileForge**! We welcome bug reports, feature requests, documentation improvements, and pull requests.

## Development Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Verify code quality before submitting a PR:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm build
   ```

## Adding New Sections or Templates

- Section schemas belong in `src/schemas/profile.schema.ts`
- Section serializers belong in `src/lib/markdown/serializers/`
- Preset templates belong in `src/lib/templates/registry.ts`
- Inspector forms belong in `src/components/editor/section-inspectors/`

## Code Style

- Write clean, type-safe TypeScript.
- Follow Tailwind CSS utility patterns.
- Ensure all exported Markdown conforms strictly to GitHub Flavored Markdown (GFM).
