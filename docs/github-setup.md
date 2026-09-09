# Create the FonioFlow GitHub repository

## 1. Create the empty repository

1. Sign in to GitHub.
2. Select **New repository**.
3. Name it `fonioflow`.
4. Add the description: `Evidence-based fonio market-access explorer.`
5. Choose **Private** while the competition work is in progress.
6. Do not add a README, license, or `.gitignore`; they already exist in this project.

## 2. Open the project in VS Code

Extract the source bundle, open the resulting `fonioflow` folder, and open a terminal in that folder.

## 3. Connect and push

Replace `YOUR-GITHUB-USERNAME` below:

```bash
git init
git add .
git commit -m "Initial FonioFlow MVP"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/fonioflow.git
git push -u origin main
```

If GitHub asks you to authenticate, sign in through the browser prompt or use GitHub Desktop. Never place a password or access token in a project file.

## 4. Daily workflow

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

Create a separate branch for post-competition API work:

```bash
git switch -c feature/live-data-providers
```
