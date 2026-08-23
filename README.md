# e-vet

Aplikacja full-stack do obsługi wizyt weterynaryjnych.

## Struktura projektu

```text
e-vet/
├── frontend/                 # Angular
├── backend/                  # FastAPI
├── nginx/                    # konfiguracja nginx dla produkcji
├── docker-compose.dev.yml    # Docker Compose dla developmentu
├── docker-compose.prod.yml   # Docker Compose dla produkcji
├── dev.ps1                   # pomocniczy skrypt developerski
├── .env.dev
└── README.md
```

---

# Development

## Wymagania

Do lokalnego uruchomienia projektu potrzebne są:

* Docker Desktop
* Node.js 24
* Corepack
* Yarn 4.9.2
* Windows PowerShell

Backend oraz PostgreSQL działają w Dockerze.

Frontend Angular uruchamiany jest lokalnie przez Yarn.

Skrypt `dev.ps1` pozwala zarządzać całym środowiskiem developerskim z jednej komendy.

---

# Szybki start

Komendy należy wykonywać z głównego katalogu projektu:

```powershell
cd D:\Users\Makar\Desktop\Projects\e-vet
```

## Uruchomienie całego projektu

```powershell
.\dev.ps1 up
```

Komenda uruchamia:

```text
Frontend        http://localhost:4200
Backend API     http://localhost:8000
PostgreSQL      localhost:5433
```

Uruchamiane są:

* PostgreSQL w Dockerze,
* FastAPI w Dockerze,
* Angular lokalnie przez Yarn.

Frontend jest uruchamiany w osobnym oknie PowerShell.

Jeżeli port `4200` jest już zajęty przez działający frontend, skrypt nie uruchomi drugiej instancji Angulara.

---

## Zatrzymanie całego projektu

```powershell
.\dev.ps1 down
```

Komenda:

1. wyszukuje proces nasłuchujący na porcie `4200`,
2. zatrzymuje frontend,
3. zatrzymuje backend i PostgreSQL,
4. usuwa kontenery oraz sieć developerską Docker Compose.

Named volumes nie są usuwane, dlatego dane PostgreSQL i uploadowane pliki pozostają zachowane.

---

# Najczęściej używane komendy

## Całe środowisko

Uruchomienie:

```powershell
.\dev.ps1 up
```

Zatrzymanie:

```powershell
.\dev.ps1 down
```

---

## Backend

Zatrzymanie tylko API:

```powershell
.\dev.ps1 stop
```

Uruchomienie tylko API:

```powershell
.\dev.ps1 start
```

Restart API:

```powershell
.\dev.ps1 restart
```

Przebudowanie obrazu API:

```powershell
.\dev.ps1 build
```

Przebudowanie jest potrzebne m.in. po zmianie:

* `Dockerfile`,
* `requirements.txt`,
* zależności Pythona.

Przy zwykłych zmianach kodu backendu rebuild nie jest wymagany, ponieważ katalog:

```text
backend/app
```

jest montowany do kontenera developerskiego.

FastAPI działa w trybie:

```text
fastapi dev
```

i automatycznie przeładowuje aplikację po zmianach kodu.

---

## Logi backendu

```powershell
.\dev.ps1 logs
```

Wyjście z logów:

```text
Ctrl+C
```

Nie zatrzymuje to backendu.

---

## Status kontenerów

```powershell
.\dev.ps1 ps
```

---

# Frontend

Uruchomienie tylko frontendu:

```powershell
.\dev.ps1 frontend
```

Zatrzymanie tylko frontendu:

```powershell
.\dev.ps1 frontend-stop
```

Skrypt identyfikuje frontend na podstawie procesu nasłuchującego na porcie:

```text
4200
```

Dzięki temu może zatrzymać Angulara również wtedy, gdy został uruchomiony ręcznie w innym terminalu.

---

# Migracje bazy danych

Migracje obsługiwane są przez Alembic.

Migracja oznacza zmianę wersji struktury bazy danych, np.:

* dodanie lub usunięcie kolumny,
* utworzenie tabeli,
* zmianę typu kolumny,
* dodanie klucza obcego,
* dodanie indeksu lub constraintu,
* jednorazową zmianę danych potrzebną do przejścia na nową strukturę.

## Wykonanie wszystkich oczekujących migracji

```powershell
.\dev.ps1 migrate
```

Odpowiada to:

```text
alembic upgrade head
```

---

## Sprawdzenie aktualnej migracji

```powershell
.\dev.ps1 migration
```

---

## Historia migracji

```powershell
.\dev.ps1 history
```

---

## Cofnięcie ostatniej migracji

```powershell
.\dev.ps1 downgrade
```

---

# Health check API

Po uruchomieniu backendu:

```powershell
curl.exe http://localhost:8000/health
```

Przykładowa odpowiedź:

```json
{
  "status": "healthy"
}
```

---

# Dane trwałe

Środowisko developerskie wykorzystuje Docker named volumes.

PostgreSQL:

```text
e-vet_postgres_data_dev
```

Uploadowane pliki:

```text
e-vet_uploads_data_dev
```

Dzięki temu dane nie znikają po wykonaniu:

```powershell
.\dev.ps1 down
```

Nie należy usuwać volumes, jeżeli dane mają zostać zachowane.

W szczególności należy uważać na:

```powershell
docker compose down -v
```

Opcja `-v` usuwa named volumes.

---

# Ręczne uruchamianie

`dev.ps1` jest zalecanym sposobem pracy lokalnej, ale poszczególne części projektu można również uruchamiać ręcznie.

## Backend + PostgreSQL

Z głównego katalogu projektu:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml up -d
```

Zatrzymanie:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```

Logi API:

```powershell
docker compose --env-file .env.dev -f docker-compose.dev.yml logs -f api
```

---

## Frontend ręcznie

```powershell
cd frontend
corepack yarn start
```

Frontend:

```text
http://localhost:4200
```

---

# Instalacja zależności frontendu

Przy pierwszym uruchomieniu lub po zmianie zależności:

```powershell
cd frontend
corepack yarn install
```

---

# Production build frontendu

```powershell
cd frontend
corepack yarn build
```

Wynik:

```text
frontend/dist/e-vet-szczecin
```

---

# Testy frontendu

```powershell
cd frontend
corepack yarn test
```

---

# Typowy workflow

Na początku pracy:

```powershell
.\dev.ps1 up
```

Jeżeli pojawiła się nowa migracja:

```powershell
.\dev.ps1 migrate
```

Podgląd logów backendu:

```powershell
.\dev.ps1 logs
```

Po zakończeniu pracy:

```powershell
.\dev.ps1 down
```

W większości przypadków do codziennej pracy wystarczą więc cztery komendy:

```powershell
.\dev.ps1 up
.\dev.ps1 migrate
.\dev.ps1 logs
.\dev.ps1 down
```
