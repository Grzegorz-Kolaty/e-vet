param(
  [string]$Server = "deploy@78.46.119.135",
  [string]$RemotePath = "/opt/evet",
  [string]$Branch = "main",
  [string]$DistPath = "dist/e-vet-szczecin/browser"
)

$ErrorActionPreference = "Stop"

if ($PSVersionTable.PSVersion.Major -ge 7) {
  $PSNativeCommandUseErrorActionPreference = $true
}

Write-Host ""
Write-Host "=== E-VET PROD DEPLOY ===" -ForegroundColor Cyan
Write-Host "Server: $Server"
Write-Host "Remote path: $RemotePath"
Write-Host "Branch: $Branch"
Write-Host ""

$currentBranch = git branch --show-current

if ($currentBranch -ne $Branch) {
  throw "Jesteś na branchu '$currentBranch', a deploy oczekuje '$Branch'."
}

$status = git status --porcelain

if ($status) {
  Write-Host $status
  throw "Masz niecommitowane zmiany. Zrób commit przed deployem."
}

Write-Host "Git clean OK" -ForegroundColor Green

Write-Host ""
Write-Host "Pushing branch..." -ForegroundColor Cyan
git push origin $Branch

Write-Host ""
Write-Host "Building Angular production..." -ForegroundColor Cyan
yarn build --configuration production

if (!(Test-Path "$DistPath/index.html")) {
  throw "Nie znaleziono $DistPath/index.html. Sprawdź outputPath Angulara."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archive = Join-Path $env:TEMP "evet-frontend-$timestamp.tar.gz"

if (Test-Path $archive) {
  Remove-Item $archive -Force
}

Write-Host ""
Write-Host "Packing frontend artifact..." -ForegroundColor Cyan
tar -czf $archive -C $DistPath .

Write-Host ""
Write-Host "Uploading frontend artifact..." -ForegroundColor Cyan
scp $archive "${Server}:/tmp/evet-frontend.tar.gz"

$remoteScript = @'
set -euo pipefail

REMOTE_PATH="$1"
BRANCH="$2"

cd "$REMOTE_PATH"

timestamp="$(date +%Y%m%d-%H%M%S)"

echo ""
echo "=== Remote deploy started ==="
echo "Path: $REMOTE_PATH"
echo "Branch: $BRANCH"
echo ""

echo "Creating backups..."
mkdir -p backups

if [ -d frontend ] && [ -f frontend/index.html ]; then
  tar -czf "backups/frontend-$timestamp.tar.gz" -C frontend .
  echo "Frontend backup: backups/frontend-$timestamp.tar.gz"
fi

docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "backups/db-$timestamp.sql.gz"
echo "DB backup: backups/db-$timestamp.sql.gz"

echo ""
echo "Pulling latest code..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo ""
echo "Building API image..."
docker compose build api

echo ""
echo "Running migrations..."
docker compose run --rm api alembic upgrade head

echo ""
echo "Recreating API..."
docker compose up -d --force-recreate api

echo ""
echo "Checking production config..."
docker compose exec -T api python - <<'PY'
from app.core.config import settings

assert settings.environment == "production", settings.environment
assert settings.frontend_url == "https://vetreservation.com", settings.frontend_url
assert settings.resend_api_key, "RESEND_API_KEY missing"

print("api config ok")
PY

echo ""
echo "Deploying frontend files..."
mkdir -p frontend
find frontend -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -xzf /tmp/evet-frontend.tar.gz -C frontend

echo ""
echo "Recreating nginx..."
docker compose up -d --force-recreate nginx

echo ""
echo "Testing nginx config..."
docker compose exec -T nginx nginx -t

echo ""
echo "Containers:"
docker compose ps

echo ""
echo "API logs:"
docker compose logs api --tail=40

echo ""
echo "=== Remote deploy finished ==="
'@

Write-Host ""
Write-Host "Running remote deploy..." -ForegroundColor Cyan
$remoteScript | ssh $Server "bash -s -- '$RemotePath' '$Branch'"

Write-Host ""
Write-Host "Cleaning local artifact..." -ForegroundColor Cyan
Remove-Item $archive -Force

Write-Host ""
Write-Host "Checking public URLs..." -ForegroundColor Cyan

try {
  curl.exe -fsS "https://api.vetreservation.com/" | Out-Null
  Write-Host "API public URL OK" -ForegroundColor Green
} catch {
  Write-Host "API public URL check failed" -ForegroundColor Yellow
}

try {
  curl.exe -fsS "https://vetreservation.com/" | Out-Null
  Write-Host "Frontend public URL OK" -ForegroundColor Green
} catch {
  Write-Host "Frontend public URL check failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Deploy complete." -ForegroundColor Green
