from __future__ import annotations

import html

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

    async def send_verify_email(
        self,
        *,
        to: str,
        name: str,
        token: str,
    ) -> None:
        verify_url = f"{settings.frontend_url}/auth/verify-email?token={token}"
        safe_name = html.escape(name)
        safe_url = html.escape(verify_url, quote=True)

        await self.send_email(
            to=to,
            subject="Potwierdź adres email w VetReservation",
            html=f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>VetReservation</h2>
                <p>Cześć {safe_name},</p>
                <p>Dziękujemy za rejestrację. Kliknij poniższy przycisk, aby potwierdzić adres email.</p>
                <p>
                    <a href="{safe_url}"
                       style="display:inline-block;padding:10px 16px;background:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;">
                        Potwierdź email
                    </a>
                </p>
                <p>Jeśli przycisk nie działa, skopiuj ten link do przeglądarki:</p>
                <p>{safe_url}</p>
                <p>Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
            </div>
            """,
        )

    async def send_password_reset_email(
        self,
        *,
        to: str,
        name: str,
        token: str,
    ) -> None:
        reset_url = f"{settings.frontend_url}/auth/reset-password?token={token}"
        safe_name = html.escape(name)
        safe_url = html.escape(reset_url, quote=True)

        await self.send_email(
            to=to,
            subject="Reset hasła w VetReservation",
            html=f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>VetReservation</h2>
                <p>Cześć {safe_name},</p>
                <p>Otrzymaliśmy prośbę o reset hasła do Twojego konta.</p>
                <p>
                    <a href="{safe_url}"
                       style="display:inline-block;padding:10px 16px;background:#0d6efd;color:#ffffff;text-decoration:none;border-radius:6px;">
                        Ustaw nowe hasło
                    </a>
                </p>
                <p>Jeśli przycisk nie działa, skopiuj ten link do przeglądarki:</p>
                <p>{safe_url}</p>
                <p>Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
            </div>
            """,
        )


email_service = EmailService()
