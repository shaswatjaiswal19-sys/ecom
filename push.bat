@echo off
echo ========================================================
echo   Pushing latest changes to GitHub (shaswatjaiswal19-sys/ecom)
echo ========================================================
git add .
git commit -m "Fix production product data, authorize shaswatuu2006@gmail.com, and resolve layout chunk loading"
git push origin main
if %ERRORLEVEL% equ 0 (
    echo.
    echo SUCCESS: Pushed to GitHub successfully!
) else (
    echo.
    echo Push failed. Please check your credentials or network connection.
)
pause
