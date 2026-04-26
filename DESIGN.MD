# Design System Specification: Editorial Precision

This document defines the visual language and structural principles for the design system. It moves beyond standard utility to create a high-end, editorial experience that feels both authoritative and effortless.

## 1. Overview & Creative North Star: "The Architectural Editor"
The Creative North Star for this design system is **The Architectural Editor**.

We are not building a generic money transfer app; we are designing a high-end workspace that balances the brutalist strength of **Space Grotesk** (previously Archivo Black, adjusted to match design tokens) with the technical precision of **Work Sans** (previously IBM Plex Sans, adjusted to match design tokens). The aesthetic rejects "template" layouts in favor of intentional asymmetry, overlapping layers, and high-contrast typography scales. We prioritize "negative space as a luxury," using breathing room to signal premium quality and focus.

## 2. Colors: Tonal Depth & The No-Line Rule
The palette is rooted in a sophisticated interplay of bone-whites, deep charcoals, and high-energy accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
- **Primary Transition:** Use `surface` (#f9f9ff) for the main canvas.
- **Secondary Sectioning:** Use `surface_container_low` (#f2f3fc) to define sidebar or utility areas.
- **Nesting:** To define an inner element (like a card), use `surface_container_lowest` (#ffffff) to create a "lifted" effect without a border.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
- **Base Layer:** `surface` (#f9f9ff)
- **Recessed Areas:** `surface_dim` (#d8dae2)
- **Interactive Layers:** Use `surface_container` (#ecedf6) to group related tasks.

### The "Glass & Gradient" Rule
To escape the "flat" look, main Action CTAs should utilize a subtle linear gradient from `primary` (#af2d19) to `primary_container` (#d1462f) at a 135-degree angle. Floating modals or navigation bars should leverage **Glassmorphism**: 80% opacity of `surface_container_lowest` with a `20px` backdrop-blur to allow underlying content to bleed through softly.

## 3. Typography: Technical Authority
The system pairs a heavy-weight, wide-set sans for impact with a highly legible, monospaced-adjacent sans for data.

- **Display & Headlines (Space Grotesk):** These are your "Anchors." Use `display-lg` (3.5rem) with tight letter-spacing (-0.04em) to create an editorial, "poster-like" feel in hero sections.
- **Body (Work Sans):** These are your "Engine." Use `body-md` (0.875rem) for task descriptions. The 89% weight distribution ensures text feels substantial but never heavy.
- **Labels (Inter):** Used for micro-metadata. `label-sm` (0.6875rem) in `on_surface_variant` (#59413c) provides a sophisticated, "technical drawing" aesthetic.

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through light and density, not lines.

### The Layering Principle
Depth is achieved by "stacking" surface tiers. Place a `surface_container_lowest` card on a `surface_container_low` section. This creates a soft, natural lift.

### Ambient Shadows
If a floating effect is required (e.g., a high-priority task modal):
- **Blur:** 32px – 64px.
- **Opacity:** 4% – 6%.
- **Color:** Use a tinted version of `on_surface` (#191c21), never pure black. This mimics natural light.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use a **Ghost Border**: `outline_variant` (#e1bfb8) at 15% opacity. High-contrast, 100% opaque borders are forbidden.

## 5. Components

### Buttons
- **Primary:** Gradient-filled (`primary` to `primary_container`). Use `xl` (0.75rem) rounding. Text should be `on_primary` (#ffffff) in `title-sm` weight.
- **Secondary:** `surface_container_high` background with `primary` text. No border.
- **Tertiary:** Pure text using `primary` color with a 2px underline that appears only on hover.

### Cards & Lists
- **No Dividers:** Forbid the use of divider lines. Separate list items using the spacing scale (e.g., `spacing-4` / 1rem) or by alternating background tones between `surface` and `surface_container_low`.
- **Active State:** An "Active" card should not have a border; it should shift to `secondary_container` (#96f1da) with a `secondary` left-accent bar (4px width).

### Input Fields
- **Styling:** Soft `surface_container_highest` (#e1e2ea) backgrounds.
- **Focus State:** Instead of a border, use a subtle 2px bottom-stroke of `primary` (#af2d19). Labels should float above in `label-md` using `tertiary` (#575d69).

### Specialized: The "Status Ribbon"
Instead of standard chips, use vertical "Status Ribbons" on the far-left edge of containers. A thin strip of `secondary` (#006b5b) signals completion, while `error` (#ba1a1a) signals a blocker, maintaining a clean, architectural look.

## 6. Do’s and Don’ts

### Do
- **Do** use intentional asymmetry. Align a headline to the left but offset the body text to the right to create visual tension.
- **Do** use the full range of `surface-container` tokens to create "rooms" within the UI.
- **Do** leverage the `primary` red (#af2d19) sparingly as a "surgical" accent for high-priority actions.

### Don’t
- **Don’t** use 1px solid lines to separate content. It breaks the "Architectural Editor" illusion.
- **Don’t** use standard "drop shadows" (e.g., 0px 2px 4px black). It feels cheap. Use Tonal Layering.
- **Don’t** center-align long blocks of text. Stick to the editorial grid: left-aligned for technical precision.
- **Don't** clutter the interface. If an element isn't essential for the task, use a lower-tier surface color to "sink" it into the background.
