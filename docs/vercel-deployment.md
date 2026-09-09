# Deploy FonioFlow to Vercel

## Prerequisites

- A GitHub repository containing this project
- A Vercel account connected to GitHub

## First deployment

1. Push the project to the repository's `main` branch.
2. Open the Vercel dashboard and choose **Add New → Project**.
3. Import the FonioFlow GitHub repository.
4. Confirm that the framework preset is **Next.js**.
5. Leave the root directory as `./` and keep the default build settings.
6. Select **Deploy**.

The current MVP reads versioned JSON files from `data/generated`, so it does not require secrets or environment variables.

## Continuous deployment

Every push to `main` creates a production deployment. Pull requests and other branches receive preview deployments for testing before they are merged.

## Future APIs

When live providers are added, configure their keys in **Project Settings → Environment Variables**. Keep `.env.local` out of Git and retain the validated JSON snapshots as a fallback.
