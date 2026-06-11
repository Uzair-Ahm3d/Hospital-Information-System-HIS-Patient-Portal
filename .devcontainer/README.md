# Running this project on GitHub Codespaces (free, no card)

This `.devcontainer` runs the whole stack **in the cloud** — Next.js **and** Oracle XE —
so you don't need to install anything locally or use a payment card.

## How to launch

1. Push this repo to GitHub (these `.devcontainer` files must be committed).
2. On the repo page, click **Code → Codespaces → Create codespace on main**.
3. Wait ~3–5 minutes on first boot. Behind the scenes it:
   - starts **Oracle XE** in a container,
   - creates the app user `his_user`,
   - loads `database/01…`, `02…`, `03…` (schema + seed data) automatically,
   - runs `npm install`.
   The app won't be created until the database is fully loaded.
4. In the Codespace terminal, start the app:
   ```bash
   npm run dev
   ```
5. A popup offers to open port **3000** — open it. To share the URL:
   open the **Ports** tab → right-click port 3000 → **Port Visibility → Public**,
   then copy the `https://...app.github.dev` link.

## Notes

- The DB connection is preconfigured via environment variables in
  `.devcontainer/docker-compose.yml` (`DB_USER`, `DB_PASSWORD`,
  `DB_CONNECTION_STRING=oracle:1521/XEPDB1`, `JWT_SECRET`).
  These are dev-only values — fine for a demo, not real secrets.
- A Codespace **sleeps after ~30 min idle** and stops to conserve your free
  monthly hours (~60 hrs/month). Reopen it from **Code → Codespaces** to resume;
  the database keeps its data between restarts.
- To reload the database from scratch, delete the Codespace and create a new one
  (the schema scripts run only on first creation).
