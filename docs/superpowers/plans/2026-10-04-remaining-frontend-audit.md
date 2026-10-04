# Remaining frontend audit findings

Continuation of the approved repository audit fixes on October 4, 2026. Critical CMS/CI changes are already committed in `35b48f7`. Complete the previously deferred frontend findings without changing the layout or framework.

## Design and plan

- [x] Reproduce Markdown fragment links leaving the HashRouter route. Route fragment links through React Router, add deterministic heading anchors, and scroll to the target safely. Preserve external-link behavior and support direct/repeated fragment navigation. Test against the real HashRouter with DOM scroll stubs, not live content.
- [x] Reproduce original-size Board image delivery. Use a shared image component and a fixed responsive width ladder, cap widths at source dimensions, request Sanity `fit=max&auto=format&q=80`, and supply intrinsic width/height. Keep current tile/detail styles and aspect ratios. Do not add a new image library.
- [x] Separate project list summaries and Board list/detail projections so lists do not download unused long-form Markdown. Keep Board short rich text for inline tiles and project descriptions. Project full-fetch API remains for existing callers, but list UI uses summaries. Collection pagination is not introduced in this small portfolio change.
- [x] Add and run red/green regression tests for route preservation, heading IDs, original-size avoidance, invalid/missing refs, small source images, summary projections, and retained detail links/content.
- [x] Run frontend tests/lint/build on Node 22.22.2, review the changes, commit, and update evidence. Preserve `cms/schemaTypes/article.ts` unchanged and uncommitted.

## Verification limits

Tests exercise real React components and service query construction with fake CMS responses. They do not measure production bandwidth, execute GROQ on the live dataset, or prove production browser/CDN behavior. CMS helper tests and local builds from the previous phase do not replace live script orchestration or GitHub-hosted CI execution. Keep these limits explicit in completion assessments.
