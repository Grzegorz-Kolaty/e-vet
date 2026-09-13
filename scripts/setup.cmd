@echo off
setlocal EnableExtensions EnableDelayedExpansion

for %%I in ("%~dp0..") do set "ROOT=%%~fI"

cd /d "%ROOT%"

set "ENV_FILE=%ROOT%\.env.dev"
set "COMPOSE_FILE=%ROOT%\docker-compose.dev.yml"
set "POSTGRES_VOLUME=e-vet_postgres_data_dev"

echo.
echo ==========================================
echo   e-vet - development setup
echo ==========================================
echo.

REM ==================================================
REM Git
REM ==================================================

where git.exe >nul 2>&1

if errorlevel 1 (
    echo [ERROR] Git is not installed.
    echo.
    echo Install Git first:
    echo winget install --id Git.Git -e
    exit /b 1
)

echo [OK] Git detected:
git --version
echo.


REM ==================================================
REM Node.js
REM ==================================================

where node.exe >nul 2>&1

if errorlevel 1 (
    echo [INFO] Node.js was not found.
    echo [INFO] Installing Node.js LTS...
    echo.

    winget install --id OpenJS.NodeJS.LTS -e

    if errorlevel 1 (
        echo.
        echo [ERROR] Node.js installation failed.
        exit /b 1
    )

    REM Refresh common Node installation path
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

where node.exe >nul 2>&1

if errorlevel 1 (
    echo [ERROR] Node.js was installed but is not available in PATH.
    echo Open a new terminal and run setup.cmd again.
    exit /b 1
)

for /f "tokens=1 delims=." %%V in ('node --version') do (
    set "NODE_MAJOR=%%V"
)

set "NODE_MAJOR=!NODE_MAJOR:v=!"

if not "!NODE_MAJOR!"=="24" (
    echo.
    echo [ERROR] e-vet requires Node.js 24.
    echo Current version:
    node --version
    exit /b 1
)

echo [OK] Node.js detected:
node --version
echo.


REM ==================================================
REM npm
REM ==================================================

where npm.cmd >nul 2>&1

if errorlevel 1 (
    echo [ERROR] npm was not found.
    exit /b 1
)

echo [OK] npm detected:
npm.cmd --version
echo.


REM ==================================================
REM Corepack
REM ==================================================

where corepack.cmd >nul 2>&1

if errorlevel 1 (
    echo [ERROR] Corepack was not found.
    echo Reinstall Node.js 24 LTS.
    exit /b 1
)

echo [OK] Corepack detected:
corepack.cmd --version
echo.


REM ==================================================
REM Docker Desktop
REM ==================================================

where docker.exe >nul 2>&1

if errorlevel 1 (
    echo [INFO] Docker Desktop was not found.
    echo [INFO] Installing Docker Desktop...
    echo.

    winget install -e --id Docker.DockerDesktop

    if errorlevel 1 (
        echo.
        echo [ERROR] Docker Desktop installation failed.
        exit /b 1
    )

    REM Refresh known Docker Desktop paths
    set "PATH=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin;%ProgramFiles%\Docker\Docker\resources\bin;%PATH%"
)

where docker.exe >nul 2>&1

if errorlevel 1 (
    echo [ERROR] Docker Desktop is installed but docker.exe
    echo         is not available in this terminal.
    echo.
    echo Open a new terminal and run setup.cmd again.
    exit /b 1
)

echo [OK] Docker detected:
docker --version
echo.


REM ==================================================
REM Start Docker Desktop
REM ==================================================

docker info >nul 2>&1

if errorlevel 1 (
    echo [INFO] Docker Engine is not running.
    echo [INFO] Starting Docker Desktop...
    echo.

    docker desktop start >nul 2>&1
)

echo [INFO] Waiting for Docker Engine...

for /L %%I in (1,1,30) do (
    docker info >nul 2>&1

    if not errorlevel 1 (
        goto docker_ready
    )

    timeout /t 2 /nobreak >nul
)

echo.
echo [ERROR] Docker Engine did not start correctly.
echo.
echo Open Docker Desktop manually and make sure it is running,
echo then run setup.cmd again.
exit /b 1

:docker_ready

echo [OK] Docker Engine is running.
echo.


REM ==================================================
REM Environment
REM ==================================================

set "ENV_CREATED=0"

if exist "%ENV_FILE%" (
    echo [OK] .env.dev already exists.
) else (
    echo [INFO] Creating .env.dev...
    echo.

    node "%ROOT%\scripts\setup-env.mjs"

    if errorlevel 1 (
        echo.
        echo [ERROR] .env.dev setup failed.
        exit /b 1
    )

    set "ENV_CREATED=1"
)

echo.


REM ==================================================
REM Existing PostgreSQL volume
REM ==================================================

if "!ENV_CREATED!"=="1" (
    docker volume inspect "%POSTGRES_VOLUME%" >nul 2>&1

    if not errorlevel 1 (
        echo.
        echo [WARN] Existing PostgreSQL development volume detected.
        echo [WARN] A new .env.dev contains a newly generated database password.
        echo.
        echo Existing local database data must be reset before continuing.
        echo.
        echo WARNING: this deletes the LOCAL development database.
        echo.

        choice /C YN /N /M "Remove old PostgreSQL development volume? [Y/N]: "

        if errorlevel 2 (
            echo.
            echo [INFO] Setup stopped. No database data was removed.
            exit /b 2
        )

        echo.
        echo [INFO] Removing old PostgreSQL development database...

        docker compose ^
            --env-file "%ENV_FILE%" ^
            -f "%COMPOSE_FILE%" ^
            down

        docker volume rm "%POSTGRES_VOLUME%"

        if errorlevel 1 (
            echo.
            echo [ERROR] PostgreSQL volume could not be removed.
            exit /b 1
        )

        echo [OK] Old PostgreSQL development database removed.
    )
)


REM ==================================================
REM Frontend dependencies
REM ==================================================

echo.
echo [INFO] Installing frontend dependencies...
echo.

pushd "%ROOT%\frontend"

echo [INFO] Project Yarn version:
corepack.cmd yarn --version

if errorlevel 1 (
    popd
    echo.
    echo [ERROR] Yarn could not be started through Corepack.
    exit /b 1
)

corepack.cmd yarn install

if errorlevel 1 (
    popd
    echo.
    echo [ERROR] Frontend dependency installation failed.
    exit /b 1
)

popd

echo.
echo [OK] Frontend dependencies installed.


REM ==================================================
REM Start PostgreSQL + API
REM ==================================================

echo.
echo [INFO] Starting PostgreSQL and API...
echo.

docker compose ^
    --env-file "%ENV_FILE%" ^
    -f "%COMPOSE_FILE%" ^
    up -d

if errorlevel 1 (
    echo.
    echo [ERROR] Docker Compose failed.
    exit /b 1
)


REM ==================================================
REM Wait for PostgreSQL
REM ==================================================

echo.
echo [INFO] Waiting for PostgreSQL...

for /L %%I in (1,1,30) do (
    docker compose ^
        --env-file "%ENV_FILE%" ^
        -f "%COMPOSE_FILE%" ^
        exec -T db ^
        pg_isready -U evet_user -d evet_dev >nul 2>&1

    if not errorlevel 1 (
        goto postgres_ready
    )

    timeout /t 1 /nobreak >nul
)

echo.
echo [ERROR] PostgreSQL did not become ready.
exit /b 1

:postgres_ready

echo [OK] PostgreSQL is ready.


REM ==================================================
REM Database migrations
REM ==================================================

echo.
echo [INFO] Running database migrations...
echo.

docker compose ^
    --env-file "%ENV_FILE%" ^
    -f "%COMPOSE_FILE%" ^
    exec -T api ^
    alembic upgrade head

if errorlevel 1 (
    echo.
    echo [ERROR] Database migration failed.
    exit /b 1
)

echo.
echo [INFO] Current migration:

docker compose ^
    --env-file "%ENV_FILE%" ^
    -f "%COMPOSE_FILE%" ^
    exec -T api ^
    alembic current

if errorlevel 1 (
    echo.
    echo [ERROR] Could not verify database migration.
    exit /b 1
)


REM ==================================================
REM API health check
REM ==================================================

echo.
echo [INFO] Checking API...

for /L %%I in (1,1,20) do (
    curl.exe --fail --silent ^
        http://localhost:8000/health >nul 2>&1

    if not errorlevel 1 (
        goto api_ready
    )

    timeout /t 1 /nobreak >nul
)

echo.
echo [ERROR] API health check failed.
exit /b 1

:api_ready

echo [OK] API is healthy.


REM ==================================================
REM Finished
REM ==================================================

echo.
echo ==========================================
echo   e-vet setup completed successfully
echo ==========================================
echo.
echo Backend:    http://localhost:8000
echo PostgreSQL: localhost:5433
echo.
echo Start the complete development environment with:
echo.
echo   dev.cmd up
echo.

exit /b 0
