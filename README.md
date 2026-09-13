# e-vet

Aplikacja full-stack do obsługi wizyt weterynaryjnych.

## Stack

- Angular
- FastAPI
- PostgreSQL
- Docker Compose

## Struktura

```text
e-vet/
├── backend/
├── frontend/
├── nginx/
├── scripts/
│   ├── dev.ps1
│   ├── setup.cmd
│   └── setup-env.mjs
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── evet.cmd
└── README.md
```

`evet.cmd` jest głównym entrypointem do pracy developerskiej. Plików z `scripts/` nie trzeba uruchamiać bezpośrednio.

---

# Pierwsza instalacja

## 1. Wymagania

Potrzebne są:

- Windows PowerShell
- WinGet
- Git

Jeżeli Git nie jest zainstalowany:

```powershell
winget install --id Git.Git -e
```

## 2. Sklonuj repozytorium

```powershell
mkdir "$HOME\Projects" -ErrorAction SilentlyContinue
cd "$HOME\Projects"

git clone https://github.com/Grzegorz-Kolaty/e-vet.git
cd e-vet
```

## 3. Przygotuj Resend

Przed setupem przygotuj:

- konto Resend,
- zweryfikowaną domenę,
- API key z uprawnieniami do wysyłania wiadomości.

## 4. Uruchom setup

```powershell
.\evet.cmd setup
```

Setup automatycznie:

- instaluje/sprawdza Node.js 24,
- sprawdza npm i Corepack,
- instaluje/sprawdza Docker Desktop,
- generuje `.env.dev`,
- instaluje zależności frontendu,
- uruchamia PostgreSQL i FastAPI,
- wykonuje migracje Alembic,
- sprawdza health check API.

Podczas setupu zostaniesz poproszony o:

```text
Resend API Key:
Resend domain:
```

`.env.dev` nie jest nadpisywany przy ponownym uruchomieniu setupu.

---

# Uruchamianie projektu

Start:

```powershell
.\evet.cmd up
```

Stop:

```powershell
.\evet.cmd down
```

Adresy:

```text
Frontend        http://localhost:4200
Backend API     http://localhost:8000
PostgreSQL      localhost:5433
```

---

# Najczęściej używane komendy

```powershell
.\evet.cmd up
.\evet.cmd down
.\evet.cmd start
.\evet.cmd stop
.\evet.cmd restart
.\evet.cmd build
.\evet.cmd logs
.\evet.cmd ps
.\evet.cmd migrate
.\evet.cmd migration
.\evet.cmd history
.\evet.cmd downgrade
.\evet.cmd frontend
.\evet.cmd frontend-stop
```

---

# Migracje

Wykonanie oczekujących migracji:

```powershell
.\evet.cmd migrate
```

Aktualna migracja:

```powershell
.\evet.cmd migration
```

Historia:

```powershell
.\evet.cmd history
```

Cofnięcie ostatniej:

```powershell
.\evet.cmd downgrade
```

---

# Health check

```powershell
curl.exe http://localhost:8000/health
```

Oczekiwana odpowiedź:

```json
{
  "status": "healthy"
}
```

---

# Dane trwałe

Development korzysta z named volumes:

```text
e-vet_postgres_data_dev
e-vet_uploads_data_dev
```

`.\evet.cmd down` nie usuwa danych.

Uważaj na:

```powershell
docker compose down -v
```

Opcja `-v` usuwa named volumes.

---

# Frontend ręcznie

```powershell
cd frontend
corepack.cmd yarn install
corepack.cmd yarn start
```

Projekt przypina Yarn:

```text
4.9.2
```

Sprawdzenie:

```powershell
corepack.cmd yarn --version
```

---

# Backend ręcznie

Start:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d
```

Stop:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```

Logi API:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml logs -f api
```

---

# Typowy workflow

```powershell
.\evet.cmd up
.\evet.cmd migrate
.\evet.cmd logs
.\evet.cmd down
```
