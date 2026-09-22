@echo off
echo ========================================================
echo   Clearing corrupted Next.js cache and restarting dev
echo ========================================================
echo.
echo [1/2] Deleting .next cache folder...
if exist ".next" (
    rmdir /s /q .next
    echo Cache deleted successfully.
) else (
    echo No .next folder found.
)

echo.
echo [2/2] Starting Next.js development server...
echo Access http://localhost:3000 once compiled.
echo.
npm run dev
