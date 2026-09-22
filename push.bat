@echo off
echo ========================================================
echo   Pushing latest changes to GitHub (shaswatjaiswal19-sys/ecom)
echo ========================================================
git add .
git commit -m "Fix production deployment product data: direct Firestore REST fetch, fix mock flags, preserve all real catalog data"
git push origin main
if %ERRORLEVEL% equ 0 (
    echo.
    echo SUCCESS: Pushed to GitHub successfully!
) else (
    echo.
    echo Push failed. Please check your credentials or network connection.
)
pause
