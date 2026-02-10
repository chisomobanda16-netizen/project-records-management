@echo off
echo 🚀 Pushing Project Records to GitHub
echo.

REM Set Git path
set PATH="C:\Program Files\Git\cmd;%PATH%"

REM Check if remote exists
git remote -v | findstr "origin" >nul
if %errorlevel% neq 0 (
    echo ❌ No GitHub remote found.
    echo.
    echo Please create a GitHub repository first:
    echo 1. Go to https://github.com and create a new repository
    echo 2. Run this command (replace YOUR_USERNAME):
    echo    git remote add origin https://github.com/YOUR_USERNAME/project-records-management.git
    echo 3. Run this batch file again
    pause
    exit /b 1
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo 🌐 Your project is now ready for Cloudflare deployment
) else (
    echo.
    echo ❌ Failed to push to GitHub
    echo Please check your GitHub credentials and repository access
)

pause
