param(
  [Parameter(Position = 0)]
  [string]$Command = "help",

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$Arguments = @()
)


$FrontendPort = 4200
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

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
    "Set-Location '$Root\frontend'; corepack.cmd yarn start"
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


function Invoke-Alembic
{
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & docker @Compose run --rm api alembic @Arguments

  if ($LASTEXITCODE -ne 0)
  {
    throw "Polecenie Alembic nie powiodlo sie. Kod wyjscia: $LASTEXITCODE"
  }
}


function Get-AlembicOutput
{
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $output = & docker @Compose run --rm api alembic @Arguments
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0)
  {
    throw "Polecenie Alembic nie powiodlo sie. Kod wyjscia: $exitCode"
  }

  return @(
  $output |
    ForEach-Object {
      "$_"
    }
  )
}


function Assert-AlembicReadyForRevision
{
  Write-Host ""
  Write-Host "Sprawdzam stan migracji Alembic..."

  # --------------------------------------------------
  # HEADS
  # --------------------------------------------------

  $headsOutput = Get-AlembicOutput -Arguments @(
    "heads"
  )

  $heads = @()

  foreach ($line in $headsOutput)
  {
    if ($line -match '^\s*(\S+)\s+\(head\)\s*$')
    {
      $heads += $Matches[1]
    }
  }

  if ($heads.Count -eq 0)
  {
    throw "Alembic nie posiada zadnego head revision."
  }

  if ($heads.Count -gt 1)
  {
    Write-Host ""
    Write-Host "Wykryto wiele Alembic heads:" -ForegroundColor Red

    foreach ($head in $heads)
    {
      Write-Host "  $head" -ForegroundColor Red
    }

    throw @"
Nie mozna utworzyc nowej migracji.

Historia Alembic jest rozgaleziona i posiada wiecej niz jeden head.
Najpierw nalezy rozwiazac lub polaczyc migracje.
"@
  }

  $headRevision = $heads[0]

  # --------------------------------------------------
  # CURRENT
  # --------------------------------------------------

  $currentOutput = Get-AlembicOutput -Arguments @(
    "current"
  )

  $currentRevisions = @()

  foreach ($line in $currentOutput)
  {
    if ($line -match '^\s*([A-Za-z0-9_.-]+)(?:\s+\([^)]+\))?\s*$')
    {
      $currentRevisions += $Matches[1]
    }
  }

  if ($currentRevisions.Count -eq 0)
  {
    throw @"
Baza danych nie posiada aktualnej rewizji Alembic.

Uruchom:

    .\evet.cmd migrate

przed utworzeniem kolejnej migracji.
"@
  }

  if ($currentRevisions.Count -gt 1)
  {
    throw @"
Baza danych posiada wiele aktywnych rewizji Alembic.

Nie tworz nowej migracji, dopoki historia nie zostanie uporzadkowana.
"@
  }

  $currentRevision = $currentRevisions[0]

  # --------------------------------------------------
  # CURRENT must equal HEAD
  # --------------------------------------------------

  if ($currentRevision -ne $headRevision)
  {
    throw @"
Baza danych nie znajduje sie na najnowszej migracji.

Current: $currentRevision
Head:    $headRevision

Najpierw uruchom:

    .\evet.cmd migrate

Dopiero potem utworz kolejna migracje.
"@
  }

  Write-Host "Stan migracji jest poprawny." -ForegroundColor Green
  Write-Host "Current: $currentRevision"
  Write-Host "Head:    $headRevision"
}


switch ($Command)
{
  "up" {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Startowanie srodowiska e-vet (dev)" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""

    # Krok 1: Baza danych
    Write-Host "[1/4] Uruchamiam baze danych PostgreSQL..." -NoNewline
    docker @Compose up -d db | Out-Null

    if ($LASTEXITCODE -ne 0)
    {
      Write-Host " [BLAD]" -ForegroundColor Red
      Write-Error "Nie udalo sie uruchomic kontenera PostgreSQL."
      exit 1
    }

    $dbHealthy = $false
    for ($i = 1; $i -le 30; $i++)
    {
      $status = (docker inspect --format '{{.State.Health.Status}}' evet-db-dev 2>$null)
      if ($status -eq "healthy")
      {
        $dbHealthy = $true
        break
      }
      Start-Sleep -Seconds 1
      Write-Host "." -NoNewline
    }

    if (-not $dbHealthy)
    {
      Write-Host " [TIMEOUT]" -ForegroundColor Red
      Write-Error "PostgreSQL nie osiagnal stanu healthy w wyznaczonym czasie."
      exit 1
    }
    Write-Host " [OK - Baza gotowa i nasluchuje]" -ForegroundColor Green

    # Krok 2: Migracje Alembic
    Write-Host "[2/4] Weryfikuje i aplikuje migracje bazy danych..."
    Invoke-Alembic -Arguments @("upgrade", "head")
    Write-Host "      Aktualna rewizja bazy: " -NoNewline
    Invoke-Alembic -Arguments @("current")
    Write-Host "[OK - Schemat bazy danych zsynchronizowany]" -ForegroundColor Green

    # Krok 3: Backend FastAPI
    Write-Host "[3/4] Uruchamiam backend API (FastAPI)..." -NoNewline
    docker @Compose up -d api | Out-Null

    if ($LASTEXITCODE -ne 0)
    {
      Write-Host " [BLAD]" -ForegroundColor Red
      Write-Error "Nie udalo sie uruchomic kontenera API."
      exit 1
    }

    $apiReady = $false
    for ($i = 1; $i -le 20; $i++)
    {
      try
      {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health/db" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.status -eq "healthy" -and $response.database -eq "connected")
        {
          $apiReady = $true
          break
        }
      }
      catch {}
      Start-Sleep -Seconds 1
      Write-Host "." -NoNewline
    }

    if ($apiReady)
    {
      Write-Host " [OK - API gotowe, SELECT 1 potwierdzony]" -ForegroundColor Green
    }
    else
    {
      Write-Host " [OSTRZEZENIE - API uruchomione, oczekiwanie na odpowiedz...]" -ForegroundColor Yellow
    }

    # Krok 4: Frontend
    Write-Host "[4/4] Uruchamiam frontend (Angular)..."
    Start-Frontend

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  e-vet dziala poprawnie!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Frontend:        http://localhost:4200"
    Write-Host "Backend API:     http://127.0.0.1:8000"
    Write-Host "Dokumentacja:    http://127.0.0.1:8000/docs"
    Write-Host "PostgreSQL:      localhost:5433"
    Write-Host ""
    Write-Host "Podglad zapytan i logow na zywo:" -ForegroundColor Yellow
    Write-Host "  .\evet.cmd logs       (baza + API ze wszystkimi zapytaniami SQL)"
    Write-Host "  .\evet.cmd logs api   (tylko backend API)"
    Write-Host "  .\evet.cmd logs db    (tylko baza danych)"
    Write-Host ""
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
    $target = if ($Arguments.Count -gt 0) { $Arguments[0] } else { "" }
    if ($target)
    {
      docker @Compose logs -f $target
    }
    else
    {
      docker @Compose logs -f
    }
  }


  "ps" {
    docker @Compose ps
  }


  # ==================================================
  # Alembic
  # ==================================================

  "makemigration" {
    $message = ($Arguments -join " ").Trim()

    if ([string]::IsNullOrWhiteSpace($message))
    {
      throw @"
Opis migracji jest wymagany.

Przyklad:

    .\evet.cmd makemigration "add clinic status"
"@
    }

    Assert-AlembicReadyForRevision

    Write-Host ""
    Write-Host "Tworze migracje:"
    Write-Host "  $message"
    Write-Host ""

    Invoke-Alembic -Arguments @(
      "revision",
      "--autogenerate",
      "-m",
      $message
    )

    Write-Host ""
    Write-Host "Migracja zostala utworzona." -ForegroundColor Green
    Write-Host ""
    Write-Host "Nowy Alembic head:"

    Invoke-Alembic -Arguments @(
      "heads"
    )

    Write-Host ""
    Write-Host "UWAGA:" -ForegroundColor Yellow
    Write-Host "Przejrzyj wygenerowany plik migracji przed uruchomieniem migrate."
    Write-Host ""
    Write-Host "Jesli migracja zmienia lub przenosi dane, autogenerate moze wymagac"
    Write-Host "recznej korekty upgrade() i downgrade()."
  }


  "migrate" {
    Write-Host "Uruchamiam migracje..."

    Invoke-Alembic -Arguments @(
      "upgrade",
      "head"
    )

    Write-Host ""
    Write-Host "Aktualna migracja:"

    Invoke-Alembic -Arguments @(
      "current"
    )
  }


  "migration" {
    Invoke-Alembic -Arguments @(
      "current"
    )
  }


  "heads" {
    Invoke-Alembic -Arguments @(
      "heads"
    )
  }


  "check" {
    Write-Host "Sprawdzam synchronizacje modeli SQLAlchemy z baza danych (alembic check)..." -ForegroundColor Cyan
    Invoke-Alembic -Arguments @(
      "check"
    )

    Write-Host ""
    Write-Host "Stan bazy:" -ForegroundColor Cyan
    Write-Host "Current:" -NoNewline
    Invoke-Alembic -Arguments @("current")
    Write-Host "Head:   " -NoNewline
    Invoke-Alembic -Arguments @("heads")
  }


  "history" {
    Invoke-Alembic -Arguments @(
      "history"
    )
  }


  "downgrade" {
    Write-Host "Cofam ostatnia migracje..."

    Invoke-Alembic -Arguments @(
      "downgrade",
      "-1"
    )

    Write-Host ""
    Write-Host "Aktualna migracja:"

    Invoke-Alembic -Arguments @(
      "current"
    )
  }


  # ==================================================
  # Frontend
  # ==================================================

  "frontend" {
    Start-Frontend
  }


  "frontend-stop" {
    Stop-Frontend
  }


  # ==================================================
  # Help
  # ==================================================

  default {
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "  e-vet development CLI"
    Write-Host "=========================================="
    Write-Host ""

    Write-Host "Projekt:"
    Write-Host ""
    Write-Host "  .\evet.cmd up"
    Write-Host "  .\evet.cmd down"
    Write-Host ""

    Write-Host "Backend:"
    Write-Host ""
    Write-Host "  .\evet.cmd start"
    Write-Host "  .\evet.cmd stop"
    Write-Host "  .\evet.cmd restart"
    Write-Host "  .\evet.cmd build"
    Write-Host "  .\evet.cmd logs [api|db]  (domyslnie wszystkie lub wybrany)"
    Write-Host "  .\evet.cmd ps"
    Write-Host ""

    Write-Host "Frontend:"
    Write-Host ""
    Write-Host "  .\evet.cmd frontend"
    Write-Host "  .\evet.cmd frontend-stop"
    Write-Host ""

    Write-Host "Migracje:"
    Write-Host ""
    Write-Host '  .\evet.cmd makemigration "opis migracji"'
    Write-Host "  .\evet.cmd migrate"
    Write-Host "  .\evet.cmd migration"
    Write-Host "  .\evet.cmd heads"
    Write-Host "  .\evet.cmd history"
    Write-Host "  .\evet.cmd downgrade"
    Write-Host ""
  }
}
