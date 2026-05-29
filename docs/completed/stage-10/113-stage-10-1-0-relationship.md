# Stage 10: Relationship To 1.0.0

Status: Confirmed

## Decision

Stage 10 / `0.10.0` prepares the plugin for a future `1.0.0`, but it is not a `1.0.0` release candidate.

## Reason

The plugin still needs continued optimization and development before `1.0.0`.

Stage 9 has just completed its initial implementation, and real use can still expose interaction, stability, and release-quality problems. Stage 10 should absorb that feedback without creating a false promise that the plugin is almost ready for `1.0.0`.

## Practical Meaning

- Treat `0.10.0` as a stabilization and quality-improvement version.
- Do not market or plan it as a `1.0.0` candidate.
- Do not freeze product direction after `0.10.0`.
- Continue allowing follow-up optimization versions after `0.10.0`.
- Decide `1.0.0` readiness only after later validation shows the product is stable enough.

## Planning Rule

When choosing Stage 10 work, prefer improvements that make future `1.0.0` easier:

- fewer regressions;
- clearer interaction behavior;
- better testing coverage;
- cleaner release checks;
- more predictable daily-use behavior.

Do not reject useful `0.x` improvements just because they are not final `1.0.0` polish.
