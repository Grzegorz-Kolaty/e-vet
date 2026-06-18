from __future__ import annotations

import httpx

from app.core.config import settings


class EmailSendError(Exception):
    pass


class EmailService:
    def __init__(self) -> None:
        self.provider = settings.mail_provider
        self.api_key = settings.resend_api_key
        self.mail_from = settings.mail_from

    async def send_email(
        self,
        *,
        to: str,
        subject: str,
        html: str,
    ) -> None:
        if self.provider != "resend":
            raise EmailSendError(f"Unsupported mail provider: {self.provider}")

        if not self.api_key:
            raise EmailSendError("RESEND_API_KEY is not configured")

        payload = {
            "from": self.mail_from,
            "to": [to],
            "subject": subject,
            "html": html,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
            )

        if response.status_code >= 400:
            raise EmailSendError(
                f"Resend error {response.status_code}: {response.text}"
            )


email_service = EmailService()
