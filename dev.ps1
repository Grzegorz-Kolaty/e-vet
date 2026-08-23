param(
  [Parameter(Position = 0)]
  [string]$Command = "help"
)

$FrontendPort = 4200
$Root = $PSScriptRoot

$Compose = @(
  "compose",
  "--env-file", "$Root\.env.dev",
  "-f", "$Root\docker-compose.dev.yml"
)


function Get-FrontendProcessIds
{
  return Get-NetTCPConnection `
        -LocalPort $FrontendPort `
        -State Listen `
        -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
}


function Start-Frontend
{
  $processIds = Get-FrontendProcessIds

  if ($processIds)
  {
    Write-Host "Frontend jest juz uruchomiony na porcie $FrontendPort."
    return
  }

  Write-Host "Uruchamiam frontend..."
  Start-Process `
        powershell.exe `
        -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$Root\frontend'; corepack yarn start"
  )

  Write-Host "Frontend uruchomiony."
}


function Stop-Frontend
{
  $processIds = Get-FrontendProcessIds

  if (-not $processIds)
  {
    Write-Host "Frontend nie jest uruchomiony na porcie $FrontendPort."
    return
  }

  foreach ($processId in $processIds)
  {
    Write-Host "Zatrzymuje frontend. PID: $processId"

    taskkill /PID $processId /T /F | Out-Null
  }

  Write-Host "Frontend zatrzymany."
}


switch ($Command)
{
  "up" {
    Write-Host "Uruchamiam backend i baze..."
    docker @Compose up -d

    if ($LASTEXITCODE -ne 0)
    {
      Write-Error "Nie udalo sie uruchomic Dockera."
      exit 1
    }

    Start-Frontend
    Write-Host ""
    Write-Host "e-vet uruchomiony:"
    Write-Host "Frontend:   http://localhost:4200"
    Write-Host "Backend:    http://localhost:8000"
    Write-Host "PostgreSQL: localhost:5433"
  }

  "down" {
    Stop-Frontend

    Write-Host "Zatrzymuje backend i baze..."

    docker @Compose down

    Write-Host ""
    Write-Host "e-vet zatrzymany."
  }

  "stop" {
    docker @Compose stop api
  }

  "start" {
    docker @Compose up -d api
  }

  "restart" {
    docker @Compose restart api
  }

  "build" {
    docker @Compose up -d --build api
  }

  "logs" {
    docker @Compose logs -f api
  }

  "ps" {
    docker @Compose ps
  }

  "migrate" {
    docker @Compose run --rm api alembic upgrade head
  }

  "migration" {
    docker @Compose run --rm api alembic current
  }

  "history" {
    docker @Compose run --rm api alembic history
  }

  "downgrade" {
    docker @Compose run --rm api alembic downgrade -1
  }

  "frontend" {
    Start-Frontend
  }

  "frontend-stop" {
    Stop-Frontend
  }

  default {
    Write-Host ""
    Write-Host "e-vet development"
    Write-Host ""
    Write-Host "  .\dev.ps1 up             Uruchom caly projekt"
    Write-Host "  .\dev.ps1 down           Zatrzymaj caly projekt"
    Write-Host ""
    Write-Host "  .\dev.ps1 stop           Zatrzymaj tylko API"
    Write-Host "  .\dev.ps1 start          Uruchom tylko API"
    Write-Host "  .\dev.ps1 restart        Restart API"
    Write-Host "  .\dev.ps1 build          Przebuduj API"
    Write-Host "  .\dev.ps1 logs           Logi API"
    Write-Host "  .\dev.ps1 ps             Status kontenerow"
    Write-Host ""
    Write-Host "  .\dev.ps1 frontend       Uruchom tylko frontend"
    Write-Host "  .\dev.ps1 frontend-stop  Zatrzymaj tylko frontend"
    Write-Host ""
    Write-Host "  .\dev.ps1 migrate        Alembic upgrade head"
    Write-Host "  .\dev.ps1 migration      Aktualna migracja"
    Write-Host "  .\dev.ps1 history        Historia migracji"
    Write-Host "  .\dev.ps1 downgrade      Cofnij migracje"
    Write-Host ""
  }
}
