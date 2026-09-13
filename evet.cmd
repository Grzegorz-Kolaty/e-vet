@echo off
setlocal EnableExtensions

cd /d "%~dp0"

if "%~1"=="" goto :help

set "COMMAND=%~1"

if /I "%COMMAND%"=="setup" (
    call "%~dp0scripts\setup.cmd"
    exit /b %ERRORLEVEL%
)

powershell.exe ^
    -NoProfile ^
    -ExecutionPolicy Bypass ^
    -File "%~dp0scripts\dev.ps1" %*

exit /b %ERRORLEVEL%


:help

echo.
echo ==========================================
echo   e-vet development CLI
echo ==========================================
echo.
echo Usage:
echo.
echo   evet.cmd setup        First-time project setup
echo   evet.cmd up           Start development environment
echo   evet.cmd down         Stop development environment
echo   evet.cmd start        Start backend
echo   evet.cmd stop         Stop backend
echo   evet.cmd restart      Restart backend
echo   evet.cmd build        Rebuild backend image
echo   evet.cmd logs         Show backend logs
echo   evet.cmd ps           Show container status
echo   evet.cmd migrate      Run database migrations
echo   evet.cmd migration    Show current migration
echo   evet.cmd history      Show migration history
echo   evet.cmd downgrade    Revert last migration
echo   evet.cmd frontend     Start frontend
echo   evet.cmd frontend-stop Stop frontend
echo.

exit /b 0