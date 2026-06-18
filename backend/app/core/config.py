from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"

    database_url: str

    cors_origins: list[str] = []

    session_cookie_name: str = "session_id"
    session_ttl_days: int = 7
    session_cookie_secure: bool = False
    session_cookie_samesite: str = "lax"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
