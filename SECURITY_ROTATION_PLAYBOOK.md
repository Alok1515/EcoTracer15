# Security Rotation Playbook

Summary
- You committed an OpenRouter API key, MongoDB credentials, and a JWT secret. History has been rewritten locally and force-pushed; however you must rotate credentials at providers.

Immediate actions (do these now)
1. Revoke OpenRouter API key
   - Visit https://openrouter.ai (your account dashboard) and revoke the leaked key.
   - Create a new key and store it in your environment as `OPENROUTER_API_KEY`.
   - Update deployments / CI with the new secret.

2. Rotate MongoDB user/password
   - In MongoDB Atlas, rotate the password for the user `15kumaralok_db_user` (or delete and recreate user).
   - Update `MONGODB_URI` in your deployment environment and CI.

3. Rotate JWT signing secret
   - Generate a new random secret and update `CARBONTRACKER_JWT_SECRET` in your environments.
   - Restart backend services to pick up the new secret.

Verification commands and helpers
- Generate a strong random secret (example):
```bash
openssl rand -hex 32
```
- Locally set env (macOS / Linux):
```bash
export OPENROUTER_API_KEY="<new-key>"
export MONGODB_URI="<new-mongo-uri>"
export CARBONTRACKER_JWT_SECRET="<new-jwt-secret>"
```
- Set GitHub Actions/Repository secrets (example using GitHub CLI):
```bash
gh secret set OPENROUTER_API_KEY -b"<new-key>"
gh secret set MONGODB_URI -b"<new-mongo-uri>"
gh secret set CARBONTRACKER_JWT_SECRET -b"<new-jwt-secret>"
```

Post-rotation checks
- Confirm the old key no longer works by attempting a test API call (it should 401/403).
- Run a repo search for the old strings locally:
```bash
git grep -n 'sk-or-' || true
git grep -n '15kumaralok_db_user' || true
```
- Check GitHub Security tab and secret scanning alerts; if GitHub still reports the secret, follow their guidance or contact Support.

Notes & next steps
- If CI caches or build artifacts contained the key, rotate any tokens that might be stored in external systems.
- Consider enabling GitHub Secret Scanning and a vault (AWS Secrets Manager / HashiCorp Vault / GitHub Secrets) for future secrets.

Contact me if you want me to prepare PR changes for CI secrets or help generate & set new secrets via GitHub CLI.
