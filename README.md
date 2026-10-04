# prajwalshah.me

Personal portfolio frontend (`app/`) and Sanity Studio/content maintenance (`cms/`).

## Local setup

Use **Node 22.22.2** (the CI version) and **Yarn Classic 1.22.22**. Both package manifests pin Yarn. Install packages separately using their committed lockfiles:

```sh
cd app
yarn install --frozen-lockfile
cp .env.example .env
yarn dev
```

In another terminal:

```sh
cd cms
yarn install --frozen-lockfile
cp .env.example .env
yarn dev
```

Do not overwrite an existing `.env`. The examples contain public project/dataset identifiers only. Never put credentials in `VITE_*` or `SANITY_STUDIO_*` variables because these are browser-facing configuration. Studio/CLI configuration is tracked. Local `.env` files and tokens are not.

## Validation

```sh
(cd app && yarn test && yarn lint && yarn build)
(cd cms && yarn test && yarn typecheck && yarn build)
```

Tests use fixtures/fake clients, not live content. Builds produce static bundles and do not run content migrations. CMS maintenance safety and review instructions are in `cms/README.md`.

## CI and publishing

Pull requests and pushes to `main` validate both packages with frozen lockfiles. Only a successful `main` push can deploy, using the exact frontend artifact built by the validation job. The Studio is built for verification but is not automatically deployed.

Optional repository variables `SANITY_PROJECT_ID` and `SANITY_DATASET` override the existing public defaults for both packages. Validation does not need secrets, including on fork PRs. Only the deploy job receives `GH_PAGES_TOKEN`, which must have access to the existing external Pages repository. The older `VITE_SANITY_*` build secrets are no longer used. Make `validate` a required status check in repository branch protection if merges must be blocked as well.
