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

## Custom-Coded Highlights

- `sections/fullscreen-slideshow.liquid` + `assets/hero.css`: bespoke full-bleed hero with custom CTA styling and mobile tuning.
- `sections/sol-unique-features.liquid`: Swiper-based feature cards (Afterpay / Shipping / Returns).
- `sections/sol-featured-collections.liquid`, `sections/sol-featured-collection-v2.liquid`, `sections/sol-featured-collection-v3.liquid`, `sections/sol-featured-collection-slider.liquid`: curated multi-layout featured collection blocks.
- `sections/sol-instagram-scrolling-text.liquid`: marquee/scrolling text strip for social proof.
- `sections/sol-product-recommendations.liquid`: custom product slider powered by Swiper with ratings/price badges.
- `sections/sticky-atc-bar.liquid` + `assets/sticky-atc-bar.{css,js}`: sticky add-to-cart bar on PDP.
- `sections/age-verifier-popup.liquid` + `assets/age-verifier.{css,js}`: age gate overlay.
- `snippets/sol-size-chart.liquid`: toggleable cm/inch size guide with conversion table.
- `snippets/price.liquid` + `assets/custom.css`: “You Save” badge and sale grid layout refinements.
- `sections/collection-tabs.liquid` + `assets/collection-tabs.{js,css}`: tabbed collection/product views.
- `assets/product-bundle.js` / `sections/products-bundle.liquid`: bundle builder logic.
- `assets/quick-order-list.{js,css}` + `sections/quick-order-list.liquid`: quick-buy list experience.
- `assets/cart-drawer.js`, `sections/cart-drawer.liquid`, `sections/cart-gift-wrapping.liquid`, `sections/cart-goal.liquid`: enhanced cart drawer with goal progress and gift wrap.
- `sections/mobile-sticky-bar.liquid` + `assets/notification.js`: mobile CTA bar/notifications.
## Getting required values

- Create Theme Access app in Shopify Admin and copy token.
- Get your live theme ID from Shopify Admin URL while editing theme, or via CLI:

```bash
shopify theme list --store 3e42ad-1e.myshopify.com
```
