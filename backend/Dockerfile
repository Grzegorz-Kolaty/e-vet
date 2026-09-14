FROM python:3.12-slim

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY alembic.ini .
COPY alembic ./alembic
COPY app ./app

RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
