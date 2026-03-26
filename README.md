# Zest Shopify Theme

This repo is configured with a safer deployment flow using GitHub Actions.

## One-time setup

1. Add your theme files to this repo root (or adjust workflow `--path`).
2. In GitHub repo settings, add these Actions secrets:
   - `SHOPIFY_STORE`: `3e42ad-1e.myshopify.com`
   - `SHOPIFY_CLI_THEME_TOKEN`: Shopify Theme Access password/token
   - `SHOPIFY_STAGING_THEME_ID`: numeric ID of your staging theme
   - `SHOPIFY_LIVE_THEME_ID`: numeric ID of your current live theme
3. In GitHub repo settings, create environment `shopify-live` and add required reviewers (manual approval gate).
4. Push to `main`.

Deployment behavior:

- Push to `main` -> auto deploy to staging theme
- Manual run (`Actions` -> `Deploy Shopify Theme` -> `Run workflow` with `deploy_live=true`) -> live deploy after environment approval

## Getting required values

- Create Theme Access app in Shopify Admin and copy token.
- Get your live theme ID from Shopify Admin URL while editing theme, or via CLI:

```bash
shopify theme list --store 3e42ad-1e.myshopify.com
```
