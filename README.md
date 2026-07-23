# Triple Point Speech Therapy — website

Static site for [triplepointspeechtherapy.com](https://triplepointspeechtherapy.com).

Hosted on **Cloudflare Workers** (static assets). There is no build step — HTML,
CSS, images, and JS in this repo are what get served.

| Environment | Branch | URL |
|---|---|---|
| Live | `main` | https://triplepointspeechtherapy.com |
| Preview | `preview` | https://preview.triplepointspeechtherapy.com |
| Publish app | *(separate repo)* | https://publish.triplepointspeechtherapy.com |

---

## How publishing works

```
you push to preview  →  preview site updates
         ↓
Lauren opens publish app  →  taps “Publish to live site”
         ↓
main fast-forwards to preview  →  live site rebuilds (~1 min)
```

The publish app is a small Cloudflare Worker in a **separate** repo:
[`adelegard/Triple-Point-Website-Worker`](https://github.com/adelegard/Triple-Point-Website-Worker).
It does not live in this repo. It is behind Cloudflare Access and is meant to be
added to Lauren’s phone home screen.

Publish is **fast-forward only**. If `main` and `preview` have diverged (e.g.
someone committed straight to `main`), the button refuses and nothing on live
changes.

---

## Day-to-day workflow

1. Work on a branch or directly on **`preview`**.
2. Push to `origin/preview`.
3. Check https://preview.triplepointspeechtherapy.com.
4. Publish via https://publish.triplepointspeechtherapy.com (or ask Lauren).
5. Wait about a minute, then check the live site.

### Rules that keep publish working

- **Do not push or merge straight to `main`.** Use the publish app.
- If you ever must fix `main` directly, put the same commit on `preview` too
  (or merge `main` into `preview`) before the next publish.
- If publish says the versions “can’t be combined automatically”:

  ```bash
  git fetch origin
  git checkout preview
  git merge origin/main
  git push origin preview
  ```

  Then use the publish app again.

---

## Repo layout

Static files at the repo root (`index.js` is not a Worker here — the site is
plain HTML/CSS/JS). Notable pages include `index.html`, `about.html`, service
pages, `contact.html`, `faq.html`, plus `css/`, `js/`, images, and `sitemap.xml`.

---

## Related

| Piece | Where |
|---|---|
| Publish button Worker | https://github.com/adelegard/Triple-Point-Website-Worker |
| Preview site | https://preview.triplepointspeechtherapy.com |
| Live site | https://triplepointspeechtherapy.com |
