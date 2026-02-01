# Security & Setup Guide

## Environment Variables (Required for Local Development & Deployment)

**Never commit `.env` files to Git.** Use `.env.example` as a template.

### Local Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual credentials:
   ```bash
   OPENROUTER_API_KEY=your-key-here
   MONGODB_URI=your-mongodb-uri-here
   CARBONTRACKER_JWT_SECRET=your-secret-here
   ```

3. Load environment variables when running locally:
   - **Node.js / Next.js**: Automatically loads `.env.local`
   - **Spring Boot**: Set via system properties or use a `.env.local` loader

### Production / CI/CD Setup

1. **GitHub Actions** (if using):
   ```bash
   gh secret set OPENROUTER_API_KEY -b"your-key"
   gh secret set MONGODB_URI -b"your-uri"
   gh secret set CARBONTRACKER_JWT_SECRET -b"your-secret"
   ```

2. **Docker / Container Deployment**:
   Pass environment variables at runtime:
   ```bash
   docker run -e OPENROUTER_API_KEY=$KEY -e MONGODB_URI=$URI ...
   ```

3. **Vercel / Hosting Platform**:
   Use the platform's native secrets management UI.

## Pre-commit Hook (Prevents Accidental Commits)

The `.githooks/pre-commit` hook automatically blocks commits that contain:
- OpenRouter API keys (`sk-or-v1-*`)
- MongoDB URIs with credentials
- Files matching patterns: `*.env`, `*.key`, `*.pem`

### Installation

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

### Testing the Hook

```bash
# This should be blocked:
echo "OPENROUTER_API_KEY=sk-or-v1-test" > .env.local
git add .env.local
git commit -m "test" # Will fail ✓

# This will allow bypass (use only for non-secret files):
git commit --no-verify -m "test"
```

## Best Practices

✅ **DO:**
- Use environment variables for all secrets (`.env.local`)
- Use `.env.example` to document required variables
- Rotate secrets after any breach
- Store secrets in platform-native vaults (GitHub Secrets, AWS Secrets Manager, etc.)
- Use the pre-commit hook to catch mistakes

❌ **DON'T:**
- Commit `.env`, `.env.production`, `.env.*.local` files
- Hardcode API keys in source code
- Share credentials via chat, email, or commits
- Use the same secret across environments

## If You Accidentally Commit a Secret

1. **Immediately rotate the secret** at the provider (OpenRouter, MongoDB, etc.)
2. **Remove from history** using `git filter-repo`:
   ```bash
   git filter-repo --force --replace-text replacements.txt
   git push --force origin --all
   ```

For more details, see `SECURITY_ROTATION_PLAYBOOK.md`.
