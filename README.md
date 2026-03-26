# Zest Shopify Theme

This repo is configured to auto-deploy to the live Shopify theme using GitHub Actions.

## One-time setup

1. Add your theme files to this repo root (or adjust workflow `--path`).
2. In GitHub repo settings, add these Actions secrets:
   - `SHOPIFY_STORE`: `3e42ad-1e.myshopify.com`
   - `SHOPIFY_CLI_THEME_TOKEN`: Shopify Theme Access password/token
   - `SHOPIFY_THEME_ID`: numeric ID of your current live theme
3. Push to `main`.

Every push to `main` will run:

```bash
shopify theme push --allow-live --nodelete
```

## Getting required values

- Create Theme Access app in Shopify Admin and copy token.
- Get your live theme ID from Shopify Admin URL while editing theme, or via CLI:

```bash
shopify theme list --store 3e42ad-1e.myshopify.com
```
