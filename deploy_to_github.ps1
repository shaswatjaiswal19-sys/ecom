param(
    [string]$RepoUrl
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  MANOJ TRADERS / SHASWAT E-COM - GITHUB PUSH HELPER" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads and retry."
    exit 1
}

# Prompt for repo URL if not provided
if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub Repository URL (e.g., https://github.com/username/e-commerce.git)"
}

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    Write-Host "[ERROR] GitHub Repository URL cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/4] Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
}

Write-Host "`n[2/4] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "`n[3/4] Creating commit..." -ForegroundColor Yellow
git commit -m "Production deployment build for Vercel"

Write-Host "`n[4/4] Setting main branch and pushing to $RepoUrl..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to GitHub successfully." -ForegroundColor Green
    Write-Host "  Next: Go to https://vercel.com/new and import your repo!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "`n========================================================" -ForegroundColor Red
    Write-Host "  Push failed. Check your GitHub authentication / URL." -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Red
}
