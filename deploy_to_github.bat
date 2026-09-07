@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   MANOJ TRADERS / SHASWAT E-COM - GITHUB PUSH HELPER
echo ========================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads and retry.
    pause
    exit /b 1
)

:: Check if repository URL is provided as an argument or prompt user
set "REPO_URL=%~1"
if "%REPO_URL%"=="" (
    set /p "REPO_URL=Enter your GitHub Repository URL (e.g. https://github.com/username/e-commerce.git): "
)

if "%REPO_URL%"=="" (
    echo [ERROR] GitHub Repository URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo [1/4] Initializing Git repository...
if not exist ".git" (
    git init
)

echo.
echo [2/4] Staging files...
git add .

echo.
echo [3/4] Creating commit...
git commit -m "Production deployment build for Vercel"

echo.
echo [4/4] Setting main branch and pushing to %REPO_URL%...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Code pushed to GitHub successfully.
    echo   Now go to https://vercel.com/new and import your repo!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Push failed. If this is a private repo, ensure you are
    echo   logged into GitHub (e.g., via GitHub CLI or credentials).
    echo ========================================================
)

echo.
pause
