@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   SHASWAT E-COMMERCE - GITHUB PUSH ^& VERCEL DEPLOY
echo ========================================================
echo.

:: 1. Remove conflicting next.config.ts if next.config.js exists to ensure clean Vercel build
if exist "next.config.ts" (
    if exist "next.config.js" (
        echo [INFO] Removing duplicate next.config.ts for clean Next.js build...
        del /f /q "next.config.ts"
    )
)

:: 2. Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads and retry.
    pause
    exit /b 1
)

:: 3. Set Default Repository URL
set "REPO_URL=%~1"
if "%REPO_URL%"=="" (
    set "REPO_URL=https://github.com/shaswatjaiswal19-sys/ecom.git"
)

echo Target Repository: %REPO_URL%
echo.

echo [1/4] Checking Git repository...
if not exist ".git" (
    git init
)

echo.
echo [2/4] Staging all updated files...
git add -A

echo.
echo [3/4] Creating commit with fixes and production assets...
git commit -m "Feature: Dynamic weight and quantity selection in popup and admin panel"

echo.
echo [4/4] Setting main branch and pushing to GitHub...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Code pushed to GitHub successfully!
    echo.
    echo   Repo: https://github.com/shaswatjaiswal19-sys/ecom
    echo.
    echo   Your Vercel deployment will auto-build now!
    echo   Or visit: https://vercel.com/new
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Push encountered an issue. Check your GitHub login or URL.
    echo ========================================================
)

echo.
pause
