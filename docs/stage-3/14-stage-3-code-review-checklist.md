# Stage 3: Code Review Checklist

Status: Confirmed

## Goal

Review `0.3.0` changes for correctness, maintainability, and data safety before release.

## Data Safety

- No sidecar schema change is introduced for `0.3.0`.
- Existing sidecar files remain readable.
- No historical comment migration runs for sidebar-only changes.
- No per-document sidebar UI state is persisted.
- No per-comment expanded or collapsed UI state is persisted.
- Plugin settings only store bounded global preferences.
- Filtering and navigation do not write comment data.
- Temporary highlights do not modify stored annotation color or mark type.

## Sorting and State

- Sorting uses document position as the primary order.
- Status does not change a comment's main list position.
- Orphaned comments use last known position consistently.
- Resolved comments remain in-place.
- Filtering never mutates the underlying comment list order.
- Compact mode and normal mode render the same comment set under the same filters.

## UI Behavior

- Sidebar controls and settings tab read and write the same global preferences.
- Resolved visibility behaves consistently between sidebar controls and settings.
- Compact cards keep required actions available.
- Orphaned cards expose enough context for repair.
- Empty states are mutually understandable and do not imply data loss.
- Hovering document marks does not trigger disruptive sidebar scrolling.
- Clicking document marks has a predictable target when comments overlap.

## Navigation

- Card-to-document jump works in source mode.
- Card-to-document jump works in reading mode.
- Jump scrolling targets the current pane's visual center when possible.
- Temporary text highlight is cleaned up.
- Document-mark-to-card focus opens the sidebar if needed.
- Temporary card highlight is cleaned up.
- Repeated jumps clear older temporary highlights.
- Navigation failures fail visibly and do not write data.

## Performance

- Sidebar rendering remains responsive with many comments in the current document.
- Filtering is current-document only.
- No full-vault scanning is added.
- No per-file settings map grows with vault size.
- Event listeners are registered and cleaned up correctly.
- Temporary highlight timers are cleaned up on file switch and plugin unload.

## Accessibility and Layout

- Buttons have clear labels or tooltips.
- Compact controls remain usable at narrow sidebar widths.
- Text summaries do not overflow their containers.
- Status labels are distinguishable without relying only on color.
- Focus and click targets are not too small.

## Tests and Verification

- Unit or focused tests cover sorting behavior where practical.
- Tests or manual cases cover active, orphaned, and resolved comments in mixed order.
- Tests or manual cases cover filter combinations.
- Tests or manual cases cover display mode persistence.
- Manual Obsidian verification covers source mode and reading mode.
- Typecheck and build pass before release.
