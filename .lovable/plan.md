
The user wants to add 2026 award entries alongside the existing 2025 awards on the landing page. Looking at TrustSection.tsx, I can see it currently displays 2 award cards from CMS content (`content.award1*` and `content.award2*`). The TrustSection is CMS-driven via `useTrustContent` hook.

Let me check the trust content hook structure to understand how to extend it.

I need to inspect `useTrustContent` and the admin editor to add 2 new award cards for 2026 while keeping 2025 intact.

## Plan: Add 2026 Award Cards to Trust Section

**Goal:** Add two new award entries for 2026 ("Winner: Best Medical Safety Platform 2026" and "Excellence in Clinical Innovation 2026") alongside the existing 2025 awards, matching styling exactly.

### Files to modify

**1. `src/hooks/useTrustContent.ts`**
- Extend the `TrustContent` interface with 4 new fields: `award3Badge`, `award3Title`, `award3Subtitle`, `award4Badge`, `award4Title`, `award4Subtitle`
- Add defaults:
  - Award 3: Badge "Winner 2026", Title "Best Medical Safety Platform 2026", Subtitle "Healthcare & Pharmaceutical Awards"
  - Award 4: Badge "Excellence 2026", Title "Excellence in Clinical Innovation 2026", Subtitle "Healthcare & Pharmaceutical Awards"

**2. `src/components/TrustSection.tsx`**
- Change the award cards grid from `md:grid-cols-2` (2 cards) to `md:grid-cols-2` with 4 cards total (2 rows of 2 on desktop, stacked on mobile)
- Duplicate the existing 2 award card blocks to create cards 3 and 4, using the new `content.award3*` and `content.award4*` fields
- Keep styling identical: card 3 uses the amber/gold gradient (matching card 1), card 4 uses the teal gradient (matching card 2)
- Preserve all animations, hover states, icons (Trophy), and transition delays (add delays `delay-[700ms]` and `delay-[800ms]` for the new cards)

**3. `src/components/admin/marketing/sections/TrustSectionEditor.tsx`** (if it exists — will verify)
- Add input fields for the 4 new properties so admins can edit 2026 award copy via CMS

### What stays the same
- Section layout, hero image, badge text, headline, subheadline
- Existing 2025 award cards (untouched)
- All other landing page sections, navigation, and global styles
- Animations, gradients, icons, and font choices

### Visual result
The Trust Section will show 4 award cards in a 2x2 grid: 2025 awards on top row, 2026 awards on bottom row, all with identical styling.
