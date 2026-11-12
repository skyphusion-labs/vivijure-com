# diagrams

Sources for the diagrams on vivijure.com. Each image is published at a fixed URL on the
assets host; the source lives here, so a change is a diff, not a redraw (vivijure-com#92).

| Source | Rendered | Published at |
| --- | --- | --- |
| `render-pipeline.mmd` | `render-pipeline.svg` | `https://assets.skyphusion.net/vivijure/diagrams/render-pipeline.svg` |

## Render

Mermaid CLI, pinned, with the site's dark theme (`mermaid-config.json`):

```sh
npx --yes @mermaid-js/mermaid-cli@11.4.2 \
  -i diagrams/render-pipeline.mmd -o diagrams/render-pipeline.svg \
  -c diagrams/mermaid-config.json -b "#0d0f14"
```

The CLI drives a headless Chrome through puppeteer. If puppeteer has no Chrome of its own,
pass `-p` with a puppeteer config whose `executablePath` names an installed Chrome.

## Publish

Upload the rendered SVG to the same URL, then read it back: fetch the URL and check the
body against the committed file (`shasum -a 256`). The page's `alt` text in
`public/index.html` describes the diagram; change both together.

## What the render pipeline diagram shows

Each node is a render hook as vivijure-core resolves it (`docs/CORE-VS-MODULES.md`): the
keyframe, `motion.backend` (one module: your own GPU or a cloud image-to-video model),
`dialogue` (per-character TTS, passed through to assembly), the opt-in `finish` chain, the
opt-in `score`, and `film.finish` (title card, credits, subtitles).
