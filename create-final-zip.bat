@echo off
echo Creating FINAL ZIP for Cloudflare deployment...

REM Create temporary directory
if not exist "final-deploy" mkdir final-deploy

REM Copy essential files only
copy "login.html" "final-deploy\"
copy "Project Records.html" "final-deploy\"
copy "invoice_system.html" "final-deploy\"
copy "client_database.html" "final-deploy\"
copy "reset-password.html" "final-deploy\"
copy "index.html" "final-deploy\"
copy "styles-chisomo.css" "final-deploy\"
copy "logo-styles.css" "final-deploy\"
copy "chisomo-script.js" "final-deploy\"
copy "config.js" "final-deploy\"
copy "storage-manager.js" "final-deploy\"
copy "user-info-fix.js" "final-deploy\"
copy "quick-fix.js" "final-deploy\"
copy "direct-fix.js" "final-deploy\"
copy "projects-table-fix.js" "final-deploy\"
copy "firebase-config.js" "final-deploy\"
copy "firebase-auth.js" "final-deploy\"
copy "mobile-responsive.css" "final-deploy\"

REM Create ZIP from temp directory
cd final-deploy
powershell Compress-Archive -Path * -DestinationPath "../project-records-final.zip" -Force
cd ..

REM Clean up
rmdir /s /q final-deploy

echo FINAL ZIP created: project-records-final.zip
echo This is the FINAL version with all mobile responsive fixes.
echo File size should be under 100KB for Cloudflare upload.
pause
