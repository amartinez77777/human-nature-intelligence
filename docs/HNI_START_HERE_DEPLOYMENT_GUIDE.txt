# START HERE — Human Nature Intelligence v1.0.0-rc1

**Current status: source release candidate, not a compiled website.** The complete source is in `HNI_v1.0.0-rc1_SOURCE.zip`. There is no separate GitHub Pages or Netlify compiled ZIP yet. The npm registry was unreachable in the implementation environment; the recovery workflows are included to finish the job on GitHub's network-enabled runners.

## 1. Put the project on GitHub (one time)

1. Extract the source ZIP in Files (iPhone) or your computer. Open the single `hni` folder.
2. Create a GitHub repository named `human-nature-intelligence`. Use a public repository for free GitHub Pages hosting if your account does not support private Pages. Only the educational app source is included. Do not upload the book PDF or personal backup files.
3. Commit/push the **contents inside hni**, not the outer `hni` folder. At the repository root you should see `package.json`, `src`, `scripts`, `research`, `docs`, `netlify.toml`, `public`, and the hidden `.github` folder. If you use Working Copy on iPhone, clone the repository, copy these contents into its working tree, then commit and push. Verify `.github/workflows` appears on GitHub; ordinary upload interfaces may omit hidden folders. The three workflow files must be tracked in Git, not merely present on your phone.
4. Ensure the branch is `main`. In GitHub, open Actions and enable workflows if the repository asks. No GitHub password or access token belongs in source.

## 2. Generate the genuine lockfile (required before either host)

1. In the repository, tap Actions → **1 - Generate genuine npm lockfile** → Run workflow → main → Run workflow.
2. Open the resulting run. Wait for GitHub to report success; this step runs genuine npm lock generation, reproducible installation, data validation, and offline tests. If it is red, open the failed step and save the exact log; do not move on to deployment.
3. In the successful run's Artifacts section, download **HNI-genuine-lockfile**. Extract that artifact ZIP. It contains `package-lock.json`.
4. Add the real `package-lock.json` alongside `package.json` at the repository root and commit/push it to main. Do not paste in an invented lockfile or replace it with the artifact ZIP itself. Keep package.json and lockfile together. Do not edit package versions between bootstrap and verification.

If working on a computer with Node 22.16.0 and npm access, the equivalent is `npm install --no-audit --no-fund`, then `npm ci --no-audit --no-fund`, and commit the actual generated lockfile.

## 3. Verify and build BOTH website formats

1. Actions → **2 - Verify and build both hosting packages** → Run workflow on main.
2. This workflow checks the committed lockfile, runs npm ci, TypeScript, ESLint, all data validators, offline tests, Vitest, both builds, and a compiled Chromium smoke suite at 320/375/390/430/768/1440 CSS pixels. It does not deploy.
3. A green run should expose **HNI_GITHUB_PAGES_DEPLOY** and **HNI_NETLIFY_DEPLOY** artifacts. They are actual compiled sites only if this workflow succeeds. The browser evidence artifact contains synthetic test screenshots and test-only progress data, never your personal progress.
4. If the run fails, open the first failed step. The browser evidence artifact may contain a failure screenshot. The appropriate next action is targeted repair of the actual reported errors, not repeating Stages 01–09 or disabling gates. The project remains rc1 until the outstanding release requirements pass.

## 4A. Recommended: publish with GitHub Pages

1. Repository Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Open Actions → **3 - Verify and publish GitHub Pages** → Run workflow on `main`.
3. The workflow reruns all required gates and both compiled browser checks. It deploys the GitHub-specific `dist/github/` output only after success. Pull requests cannot deploy. No credentials are embedded in source.
4. Open the URL shown by the successful deploy job or Settings → Pages. With the default repository name, the expected pattern is `https://YOUR-GITHUB-USERNAME.github.io/human-nature-intelligence/` (not an asserted live URL).

The GitHub workflow infers the repository name automatically; local builds default to `/human-nature-intelligence/`. To override locally set `HNI_GITHUB_BASE=/your-repository-name/` before `npm run build:github`. A GitHub user/organization root site is a different hosting arrangement; use `/` explicitly if adapting the workflow for one.

## 4B. Netlify connected to GitHub (alternative)

After the lockfile is committed and the dual-target verification workflow succeeds, sign in to Netlify → Add new project/site → Import an existing project → connect GitHub → select the repository and main branch. The included `netlify.toml` sets Node 22.16.0, root-base build, reproducible installation and source gates, and publish directory `dist/netlify`. Leave the base directory empty (repository root). Do not set the publish directory to `hni`, `src`, or the repository root. Do not set NODE_ENV=production for dependency installation, because Vite and the validators require development dependencies. The connected build verifies the tracked lockfile, but does not execute Chromium; run workflow 2 first. Publish only after a successful deploy and check the assigned site URL.

## 4C. Netlify direct deployment (simplest once the build exists)

Download **HNI_NETLIFY_DEPLOY** from a successful workflow 2 run. Extract it, then use Netlify's manual deploy/Drop interface on a supported device. Upload the compiled directory whose immediate children include `index.html`, `assets/`, and `favicon.svg`. Do not upload the raw HNI source ZIP. The GitHub-target build has the repository subpath and is not interchangeable with the root-target build. No compiled artifact is supplied with this release candidate because local Vite never ran successfully.

## 5. Open and check on your iPhone

Open the actual host URL in Safari. Test the menu and all eight module links, a law detail and citation, a comparison, graph accessible list, search, a saved simulation, an Academy exercise, then reload and confirm saved progress. Check portrait and landscape; ensure bottom tabs do not cover the last controls, and long titles and feedback are readable. Open Settings, export a test backup, cancel a replacement, then confirm a valid replacement and check state. Do not use real personal progress for destructive testing without first exporting it.

To add to the Home Screen: in Safari, open the website, tap Share, then Add to Home Screen (the action may be under More). This is a website shortcut; offline use and native-app behavior are not guaranteed. No service worker or offline installation was added. The Chromium checks are not real Safari verification.

## 6. Protect progress and maintain the release

Data & backups → Export progress JSON before switching host, device, browser or clearing website data. GitHub Pages and Netlify have distinct origins. Import on the destination website, inspect the replacement summary and affirmatively confirm. Existing valid v1 and v2 backups are supported. If HNI reports corrupt storage, use **Download original data** to preserve the raw unreadable payload before restoring a valid JSON backup. Raw recovery TXT is for recovery/inspection, not a validated import. There is no cloud sync; avoid editing progress in several tabs concurrently.

Keep the source release ZIP and the genuine committed lockfile in Git. For a later update, create a branch, change source, run all gates and merge only a verified result. Before rollback, export personal progress; older app versions may not preserve optional Academy fields when they save. Revert to a known verified commit and rerun the publishing workflow rather than modifying compiled assets. Preserve the same origin for best continuity, and keep backup files private.

## Troubleshooting

- No workflow in Actions: check `.github/workflows` is tracked at root, workflow permissions are enabled, and main is the default branch.
- Missing lockfile: complete step 2 and commit the extracted JSON, not ZIP.
- Red typecheck/lint/test/build: read the first actual error and repair it. The offline suite alone cannot establish React runtime quality.
- Browser smoke failure: inspect the first route/viewport/interaction error and screenshot. Fix the source; do not bypass the browser test to claim verification.
- Blank page / missing JS: verify you used the build for the chosen host and correct GitHub base. Do not deploy raw TSX or wrong-target assets.
- Netlify lockfile modified by automatic install: restore the tracked genuine lockfile, check dependency/version settings, and rerun verification; the build command refuses a changed lockfile.
- Lost progress after switching URLs: restore your exported JSON on the destination origin; the app cannot recover data from another origin automatically.

Official references checked for setup guidance (workflows themselves were not executed):
- GitHub Actions Node setup: https://github.com/actions/setup-node
- Checkout: https://github.com/actions/checkout
- Artifact upload: https://github.com/actions/upload-artifact
- GitHub Pages publishing: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Pages workflow example: https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically
- Netlify dependencies: https://docs.netlify.com/build/configure-builds/manage-dependencies/
- Netlify build configuration: https://docs.netlify.com/build/configure-builds/file-based-configuration/
