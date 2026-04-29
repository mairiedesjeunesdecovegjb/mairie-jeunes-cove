# Mairie des Jeunes de Covè (Bénin)

Site institutionnel complet, moderne et responsive pour la Mairie des Jeunes de Covè, avec un panneau d'administration entièrement caché permettant d'éditer la totalité du contenu public.

## Architecture

Monorepo pnpm avec deux artefacts principaux :

- **`artifacts/mairie-jeunes-cove`** (web) — Frontend React + Vite + Tailwind + Framer Motion
  - Pages publiques en français : Accueil, À propos, Cabinet, Projets, Actualités, Agenda, Galerie, Opportunités, Contact
  - Panneau admin secret accessible via `/secure-admin-cove-login` (CRUD complet sur tous les contenus)
  - Couleurs et identité visuelle dynamiques, lues depuis l'API settings (vert/bleu/blanc par défaut)
  - SEO dynamique via `useSEO`, hooks et requêtes générés via `@workspace/api-client-react`
- **`artifacts/api-server`** (api) — Express 5 + TypeScript ESM
  - Auth admin (bcryptjs + sessions Postgres avec connect-pg-simple, rate-limiter sur login et formulaire de contact)
  - Endpoints REST sous `/api` pour : auth, settings, hero-slides, pages, team, projects, news, events, gallery, partners, opportunities, contact, stats
  - Validation Zod générée à partir de l'OpenAPI (`@workspace/api-zod`)
  - Seeding automatique au démarrage : compte admin par défaut + contenus initiaux
- **`lib/db`** — Drizzle ORM + PostgreSQL (schéma typé partagé)
- **`lib/api-spec`** — OpenAPI source de vérité (`pnpm --filter @workspace/api-spec run codegen` pour régénérer)
- **`lib/api-zod`**, **`lib/api-client-react`** — Code généré (Zod + hooks React Query)

## Authentification admin

- URL de connexion : **`/secure-admin-cove-login`**
- Identifiant par défaut : `admin`
- Mot de passe par défaut : `MairieJeunesCove2026!` (à changer dès la première connexion via le panneau Sécurité)
- Variables d'environnement optionnelles : `ADMIN_USERNAME`, `ADMIN_INITIAL_PASSWORD`
- Sessions stockées en base, cookie `mjc.sid` (httpOnly, sameSite=lax, secure en prod)
- Brute-force : limiteur 8 tentatives / 15 minutes sur `/api/auth/login`

## Footer

Texte par défaut éditable depuis l'admin :
> © 2026 Mairie des Jeunes de Covè - Tous droits réservés, Conçu par Builvision Group

## Commandes utiles

- `pnpm run typecheck` — typecheck complet (libs + leaves)
- `pnpm --filter @workspace/api-spec run codegen` — régénère les zod et hooks après modification d'`openapi.yaml`
- `pnpm --filter @workspace/db run db:push` — applique le schéma Drizzle à la base

## Notes

- Les images de seed sont servies depuis `artifacts/mairie-jeunes-cove/public/seed/` (URLs stables `/seed/*.png` stockées en base et entièrement remplaçables depuis le panneau admin).
- L'inscription publique n'existe pas : seul l'administrateur seedé peut se connecter et créer/modifier les contenus.
