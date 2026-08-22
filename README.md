# e-vet

Aplikacja full-stack do obsługi wizyt weterynaryjnych.

Projekt składa się z dwóch głównych części:

```text
e-vet/
├── frontend/              # Angular
├── backend/               # FastAPI
├── docker-compose.dev.yml
├── .env.dev
└── README.md
```

## Development

### Wymagania

Do lokalnego uruchomienia projektu potrzebne są:

* Docker Desktop
* Node.js 24
* Corepack
* Yarn 4.9.2

Backend oraz baza danych uruchamiane są przez Docker Compose. Frontend uruchamiany jest osobno z katalogu `frontend/`.

---

## Backend + PostgreSQL

Komendy Docker Compose należy wykonywać z głównego katalogu projektu:

```powershell
cd D:\Users\Makar\Desktop\Projects\e-vet
```

### Uruchomienie backendu

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d api
```

Uruchomione zostaną:

* FastAPI: `http://localhost:8000`
* PostgreSQL: `localhost:5433`

Serwis `api` posiada zależność od bazy danych, dlatego PostgreSQL zostanie uruchomiony automatycznie.

### Sprawdzenie statusu kontenerów

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml ps
```

### Logi backendu

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml logs -f api
```

Wyjście z podglądu logów:

```text
Ctrl+C
```

Nie zatrzymuje to kontenera API.

### Health check API

```powershell
curl.exe http://localhost:8000/health
```

Przykładowa odpowiedź:

```json
{
  "status": "healthy"
}
```

### Zatrzymanie środowiska

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```

### Przebudowanie backendu

Przebudowanie obrazu jest potrzebne m.in. po zmianie `Dockerfile` lub zależności Pythona:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d --build api
```

Przy zwykłych zmianach kodu backendu rebuild nie jest wymagany, ponieważ kod jest montowany do kontenera w środowisku developerskim.

---

## Migracje bazy danych

Migracje obsługiwane są przez Alembic.

### Wykonanie wszystkich oczekujących migracji

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml run --rm api alembic upgrade head
```

### Aktualna migracja

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml run --rm api alembic current
```

### Historia migracji

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml run --rm api alembic history
```

### Cofnięcie ostatniej migracji

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml run --rm api alembic downgrade -1
```

---

## Frontend

Frontend znajduje się w osobnym katalogu:

```powershell
cd frontend
```

### Instalacja zależności

Przy pierwszym uruchomieniu lub po zmianie zależności:

```powershell
corepack yarn install
```

### Uruchomienie Angulara

```powershell
corepack yarn start
```

Frontend będzie dostępny pod:

```text
http://localhost:4200
```

### Production build

```powershell
corepack yarn build
```

Wynik buildu zostanie zapisany w:

```text
frontend/dist/e-vet-szczecin
```

### Testy

```powershell
corepack yarn test
```

---

## Typowy lokalny workflow

Projekt najlepiej uruchomić w dwóch terminalach.

### Terminal 1 — backend + baza danych

Z katalogu głównego projektu:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d api
```

### Terminal 2 — frontend

```powershell
cd frontend
corepack yarn start
```

Po uruchomieniu:

```text
Frontend        http://localhost:4200
Backend API     http://localhost:8000
PostgreSQL      localhost:5433
```

Po zakończeniu pracy backend i bazę można zatrzymać z katalogu głównego:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```
