@echo off
echo Creating minimal ZIP for Cloudflare deployment...

REM Create temporary directory
if not exist "temp-deploy" mkdir temp-deploy

REM Copy essential files only
copy "login.html" "temp-deploy\"
copy "Project Records.html" "temp-deploy\"
copy "invoice_system.html" "temp-deploy\"
copy "client_database.html" "temp-deploy\"
copy "reset-password.html" "temp-deploy\"
copy "index.html" "temp-deploy\"
copy "styles-chisomo.css" "temp-deploy\"
copy "logo-styles.css" "temp-deploy\"
copy "chisomo-script.js" "temp-deploy\"
copy "config.js" "temp-deploy\"
copy "storage-manager.js" "temp-deploy\"
copy "user-info-fix.js" "temp-deploy\"
copy "quick-fix.js" "temp-deploy\"
copy "direct-fix.js" "temp-deploy\"
copy "projects-table-fix.js" "temp-deploy\"
copy "firebase-config.js" "temp-deploy\"
copy "firebase-auth.js" "temp-deploy\"

REM Create ZIP from temp directory
cd temp-deploy
powershell Compress-Archive -Path * -DestinationPath "../project-records-minimal.zip" -Force
cd ..

REM Clean up
rmdir /s /q temp-deploy

echo Minimal ZIP created: project-records-minimal.zip
echo This should be under 5MB for Cloudflare upload.
pause
