# GXPORE migration plan (locked)

## Decisions

| Item | Decision |
|------|----------|
| Default locale | **FA at `/fa/`** (root `/` redirects to `/fa/`) |
| Other locales | **`/tr/`**, **`/en/`** — full route parity |
| Content | **Remove nothing** from WP; migrate all pages/products |
| Specs placeholders | **Ship placeholders** until real tables are provided |
| Turkish copy | **AI-drafted in-repo**, then human review |
| Nav | Top bar always visible — **no hamburger** |
| Products UI | Top chips only; all WP products |
| Home | Product group strips after matching scenes |
| Host | Liara **static** staging → DNS cutover by owner |
| CRM / dashboard | Later, separate apps |

## Phases

1. Inventory + content model + locales (in progress)
2. Nav + products hub/detail + corporate pages
3. Homepage strips + full TR/EN parity
4. Liara static deploy
5. Redirects + DNS cutover
6. Specs fill + HQ images / derived angles

See `docs/WP_CONTENT_GAP_REPORT.md` for missing WP content.
