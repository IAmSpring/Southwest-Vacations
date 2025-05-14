# GitHub Pages Configuration for Southwest Vacations

This document outlines the required environment variables and configuration for deploying the Southwest Vacations application to GitHub Pages.

## Required Environment Variables

Add the following environment variables to your GitHub repository settings:

1. **VITE_API_BASE_URL** - The base URL for API requests

   - Value: `https://[your-username].github.io/Southwest-Vacations/api`

2. **VITE_USE_HASH_ROUTER** - Enable hash router for GitHub Pages compatibility

   - Value: `true`

3. **VITE_MOCK_AUTH** - Enable mock authentication when running on GitHub Pages

   - Value: `true`

4. **VITE_ENABLE_SERVICE_WORKER** - Enable service worker for offline functionality

   - Value: `true`

5. **VITE_ASSET_PREFIX** - Set the base path for assets
   - Value: `/Southwest-Vacations`

## How to Add Environment Variables

1. Go to your repository on GitHub
2. Click on "Settings"
3. In the left sidebar, click on "Environments"
4. Click on "github-pages" (create it if it doesn't exist)
5. Click on "Add variable" for each of the variables listed above
6. Enter the name and value, then click "Add variable"

## GitHub Pages Configuration

Ensure your GitHub Pages is configured to deploy from:

- Branch: `gh-pages` or `main`
- Folder: `/` (root) or `/docs` depending on your build configuration

## Workflow File Configuration

Ensure your GitHub Actions workflow file includes these steps:

```yaml
- name: Build for GitHub Pages
  run: |
    npm run build
    # Copy index.html to 404.html to handle client-side routing
    cp dist/index.html dist/404.html
  env:
    VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    VITE_USE_HASH_ROUTER: ${{ secrets.VITE_USE_HASH_ROUTER }}
    VITE_MOCK_AUTH: ${{ secrets.VITE_MOCK_AUTH }}
    VITE_ENABLE_SERVICE_WORKER: ${{ secrets.VITE_ENABLE_SERVICE_WORKER }}
    VITE_ASSET_PREFIX: ${{ secrets.VITE_ASSET_PREFIX }}

- name: Deploy to GitHub Pages
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: dist
    branch: gh-pages
```

## Verifying Deployment

After deployment, your application should be available at:
`https://[your-username].github.io/Southwest-Vacations/`

Remember to check the browser console for any errors related to environment variables or asset loading.

## Troubleshooting

- If you see 404 errors for assets, check that the `VITE_ASSET_PREFIX` is set correctly
- If routes aren't working, verify that `VITE_USE_HASH_ROUTER` is set to `true`
- For API issues, confirm that the backend mock is properly configured for GitHub Pages
