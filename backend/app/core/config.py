from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"

    database_url: str

    cors_origins: list[str] = []

    session_cookie_name: str = "session_id"
    session_ttl_days: int = 7
    session_cookie_secure: bool = False
    session_cookie_samesite: str = "lax"

    mail_provider: str = "resend"
    resend_api_key: str | None = None
    mail_from: str = "VetReservation <system@mail.vetreservation.com>"
    frontend_url: str = "http://localhost:4200"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
