# Stage 9: Settings And Global Controls

Status: Confirmed

## Scope

This document defines `0.9.0` polish for the settings page and global control entry points.

The goal is to make existing options easier to understand without turning this version into a settings expansion release.

## Core Direction

`0.9.0` should organize settings around workflows.

Rules:

- Do not redesign the full settings system from scratch.
- Do not add many new preferences just because the page is being reorganized.
- Keep settings labels consistent with toolbar, card, filter, and export copy.
- Keep global controls discoverable without duplicating full settings in every surface.
- Separate data maintenance tools visually from ordinary preferences.

The settings page should feel like a clean control center, not a long technical inventory.

## Recommended Groups

Settings should be grouped by user workflow.

Recommended groups:

- display;
- creation;
- sidebar;
- data maintenance;
- language.

Avoid groups based only on implementation details, such as storage internals or view component names.

## Display Group

The display group controls how annotations appear.

Candidate settings:

- default card density;
- show or hide source marks by default;
- default mark color;
- mark color palette if already supported;
- compact visual preferences that affect reading.

Rules:

- Put common display choices near the top.
- Use terms from Stage 8 and Stage 9 UI copy.
- Keep descriptions short.
- Avoid explaining the whole annotation model in settings text.

This group should answer: what does the plugin look like while I read?

## Creation Group

The creation group controls the default creation experience.

Candidate settings:

- default mark type if supported;
- default mark color;
- whether the More panel remembers recent choices;
- creation behavior that already exists and needs a clearer home.

Rules:

- Do not add fixed annotation type settings.
- Do not make note text required.
- Do not turn creation defaults into a complex template system.
- If a setting affects the selection toolbar, use the same naming as `99-stage-9-creation-toolbar-more-panel.md`.

This group should answer: what happens when I create a new annotation?

## Sidebar Group

The sidebar group controls current-document review behavior.

Candidate settings:

- default normal or compact card density;
- default filter visibility if already supported;
- current focus feedback duration if exposed;
- whether resolved annotations are visible by default if already supported;
- sidebar behavior that affects daily review.

Rules:

- Keep source-order behavior as the default.
- Do not add saved grouping views in `0.9.0`.
- Avoid settings that conflict with `97-stage-9-list-order-grouping.md`.
- Keep wording aligned with card and filter documents.

This group should answer: how does the right sidebar behave while I review a document?

## Data Maintenance Group

Data maintenance tools should stay in settings but be visually separate from ordinary preferences.

Included tools may include:

- import;
- export;
- health check;
- repair tools;
- backup-related actions if already available.

Rules:

- Keep data tools in their own group or section.
- Avoid placing destructive tools next to harmless display toggles.
- Use clear labels and short descriptions.
- Keep confirmation behavior for risky actions.
- Do not replace the dedicated maintenance views if they already exist.

This group should feel operational, not decorative.

## Language Group

Language switching remains in settings.

Rules:

- Make the language setting easy to find.
- Explain briefly that it affects plugin UI text.
- Keep language names readable in their own language where practical.
- Do not mix language selection into every toolbar or card surface.
- Keep translation terms consistent across settings, toolbar, cards, filters, and notices.

Language support is part of the product experience, not a hidden debug option.

## Global Entry Points

Global controls should point users to the right place without duplicating the whole settings page.

Appropriate entry points:

- sidebar toolbar more menu can link to plugin settings;
- cross-note overview can link to relevant global controls when needed;
- command palette commands can open settings or maintenance views if already present.

Rules:

- Do not recreate settings inside the sidebar toolbar.
- Do not put every maintenance action in the card or sidebar menus.
- Keep card-level actions separate from plugin-level controls.
- Prefer one clear settings entry over several competing paths.

This keeps the daily UI compact while still making global controls reachable.

## Copy Consistency

Settings labels must use the same vocabulary as the rest of the plugin.

Examples:

- use `mark`, not a separate word for visual marks;
- use `note`, not a separate word for written comments;
- use `annotation` for the whole anchor plus optional mark plus optional note;
- use `resolved` and `orphaned` consistently;
- use the same Chinese and English action names as card menus and toolbar tooltips.

If a setting name needs more explanation, use a short description below the label rather than a long label.

## Visual Layout

The settings page should be calm and scannable.

Rules:

- Use clear section headings.
- Keep related controls close together.
- Avoid huge blocks of explanatory text.
- Avoid repeated warnings unless an action is risky.
- Make risky data actions visually distinct.
- Keep controls aligned and readable in both Simplified Chinese and English.

The page should support occasional configuration, not become a dashboard.

## Out Of Scope

- Rebuilding settings as a full dashboard.
- Adding saved views or saved filter presets.
- Adding a template system for annotation creation.
- Adding advanced keyboard shortcut design.
- Adding mobile-specific settings.
- Adding cloud sync or account settings.
- Moving all data maintenance actions out of settings.
