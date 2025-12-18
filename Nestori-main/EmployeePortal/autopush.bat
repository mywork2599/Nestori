@echo off
cd "C:\Users\hp\Desktop\Nestori\Nestori-main\EmployeePortal"
:loop
git add .
git commit -m "Auto update from VS Code"
git push
timeout /t 120 >nul
goto loop
