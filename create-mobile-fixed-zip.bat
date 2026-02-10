@echo off
echo Creating MOBILE FIXED ZIP for Cloudflare deployment...

REM Create temporary directory
if not exist "mobile-fixed" mkdir mobile-fixed

REM Copy essential files only
copy "login.html" "mobile-fixed\"
copy "Project Records.html" "mobile-fixed\"
copy "invoice_system.html" "mobile-fixed\"
copy "client_database.html" "mobile-fixed\"
copy "reset-password.html" "mobile-fixed\"
copy "index.html" "mobile-fixed\"
copy "styles-chisomo.css" "mobile-fixed\"
copy "logo-styles.css" "mobile-fixed\"
copy "chisomo-script.js" "mobile-fixed\"
copy "config.js" "mobile-fixed\"
copy "storage-manager.js" "mobile-fixed\"
copy "user-info-fix.js" "mobile-fixed\"
copy "quick-fix.js" "mobile-fixed\"
copy "direct-fix.js" "mobile-fixed\"
copy "projects-table-fix.js" "mobile-fixed\"
copy "firebase-config.js" "mobile-fixed\"
copy "firebase-auth.js" "mobile-fixed\"
copy "mobile-responsive.css" "mobile-fixed\"

REM Create ZIP from temp directory
cd mobile-fixed
powershell Compress-Archive -Path * -DestinationPath "../project-records-mobile-fixed.zip" -Force
cd ..

REM Clean up
rmdir /s /q mobile-fixed

echo MOBILE FIXED ZIP created: project-records-mobile-fixed.zip
echo This is the MOBILE FIXED version with all text visibility issues resolved.
echo File size should be under 100KB for Cloudflare upload.
pause
