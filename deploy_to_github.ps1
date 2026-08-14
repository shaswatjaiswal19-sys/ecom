param(
    [string]$RepoUrl = "https://github.com/shaswatjaiswal19-sys/ecom.git"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  SHASWAT E-COMMERCE - GITHUB PUSH & VERCEL DEPLOY" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Clean up duplicate next.config.ts if next.config.js exists to ensure clean Vercel Next.js build
if ((Test-Path "next.config.ts") -and (Test-Path "next.config.js")) {
    Write-Host "[INFO] Removing duplicate next.config.ts for clean build..." -ForegroundColor Yellow
    Remove-Item "next.config.ts" -Force -ErrorAction SilentlyContinue
}

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads and retry."
    exit 1
}

Write-Host "Target Repository: $RepoUrl" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
}

Write-Host "`n[2/4] Staging updated files..." -ForegroundColor Yellow
git add -A

Write-Host "`n[3/4] Creating commit with fixes and production assets..." -ForegroundColor Cyan
git commit -m "Production: Strict Clerk RBAC, hide admin button for normal users, fix Clerk props"

Write-Host "`n[4/4] Setting main branch and pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to GitHub successfully." -ForegroundColor Green
    Write-Host "  Repo: https://github.com/shaswatjaiswal19-sys/ecom" -ForegroundColor Green
    Write-Host "  Your Vercel deployment will auto-build now!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "`n========================================================" -ForegroundColor Red
    Write-Host "  Push encountered an issue. Check your GitHub authentication." -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Red
}
