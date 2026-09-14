@echo off
setlocal EnableExtensions

cd /d "%~dp0"

REM ==================================================
REM Development tools PATH
REM ==================================================

if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" (
    set "PATH=%ProgramFiles%\Docker\Docker\resources\bin;%PATH%"
)

if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin;%PATH%"
)

if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

REM ==================================================
REM Wait briefly for Docker after fresh installation
REM ==================================================

where docker.exe >nul 2>&1

if errorlevel 1 (
    for /L %%I in (1,1,10) do (
        if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" (
            set "PATH=%ProgramFiles%\Docker\Docker\resources\bin;%PATH%"
            goto docker_path_ready
        )

        if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" (
            set "PATH=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin;%PATH%"
            goto docker_path_ready
        )

        timeout /t 1 /nobreak >nul
    )
)

:docker_path_ready

REM ==================================================
REM Command
REM ==================================================

if "%~1"=="" goto :help

set "COMMAND=%~1"

if /I "%COMMAND%"=="setup" goto :setup

powershell.exe ^
    -NoProfile ^
    -ExecutionPolicy Bypass ^
    -File "%~dp0scripts\dev.ps1" %*

exit /b %ERRORLEVEL%


:setup

call "%~dp0scripts\setup.cmd"
exit /b %ERRORLEVEL%


:help

echo.
echo ==========================================
echo   e-vet development CLI
echo ==========================================
echo.
echo Usage:
echo.
echo   .\evet.cmd setup
echo.
echo   .\evet.cmd up
echo   .\evet.cmd down
echo   .\evet.cmd start
echo   .\evet.cmd stop
echo   .\evet.cmd restart
echo   .\evet.cmd build
echo   .\evet.cmd logs
echo   .\evet.cmd ps
echo.
echo   .\evet.cmd makemigration "migration description"
echo   .\evet.cmd migrate
echo   .\evet.cmd check
echo   .\evet.cmd migration
echo   .\evet.cmd heads
echo   .\evet.cmd history
echo   .\evet.cmd downgrade
echo.
echo   .\evet.cmd frontend
echo   .\evet.cmd frontend-stop
echo.

exit /b 0
