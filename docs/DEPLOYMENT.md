# Deployment Guide (GitHub Pages & Custom Domain)

## 1. Automated GitHub Pages CI/CD

ArthaAtlas India is designed to deploy automatically to GitHub Pages using the official `actions/deploy-pages@v4` action without requiring any manual server setup.

### How to Enable GitHub Pages

1. Navigate to your GitHub repository: `https://github.com/chirag127/artha-atlas-assets`.
2. Click **Settings** → **Pages** (under the "Code and automation" left sidebar).
3. Under **Build and deployment**:
   - **Source:** Select `GitHub Actions` (do **not** select "Deploy from a branch").
4. Under **Workflow permissions**:
   - Go to **Settings** → **Actions** → **General**.
   - Under "Workflow permissions", select **Read and write permissions** (or ensure the default GITHUB_TOKEN has `pages: write` and `id-token: write`).
5. Trigger a deployment by pushing to `main` or going to **Actions** → **Deploy ArthaAtlas India to GitHub Pages** → **Run workflow**.

---

## 2. Base Path Handling

Astro is configured with:
```javascript
// astro.config.mjs
site: 'https://chirag127.github.io',
base: '/artha-atlas-assets',
trailingSlash: 'never',
```

In your code, internal links should always resolve via `import.meta.env.BASE_URL`:
```astro
---
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
---
<a href={`${baseUrl}/compare`}>Compare Investments</a>
```

This guarantees that all navigation, static assets, and images work seamlessly both under the GitHub Pages subpath (`/artha-atlas-assets/`) and at local `localhost:4321`.

---

## 3. Transitioning to Custom Domain (`arthaatlas.in`)

When ready to link the custom domain `arthaatlas.in`:

1. Update `astro.config.mjs`:
   ```javascript
   site: 'https://arthaatlas.in',
   base: '/',
   ```
2. Place a file named `CNAME` in the `public/` directory containing:
   ```
   arthaatlas.in
   ```
3. In DNS settings for `arthaatlas.in`, configure:
   - **Apex A Records:**
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME Record (www):** `chirag127.github.io`
4. In GitHub repository **Settings** → **Pages** → **Custom domain**, enter `arthaatlas.in` and check **Enforce HTTPS**.
