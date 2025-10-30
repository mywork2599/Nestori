@echo off
cd "C:\Users\hp\Desktop\Nestori\Nestori-main\Nestori-main"
:loop
git add .
git commit -m "Auto update from VS Code"
git push origin main
timeout /t 120 >nul
goto loop
