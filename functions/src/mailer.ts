import {createTransport, Transporter} from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

export let cachedTransporter: Transporter | null = null;

async function initNodeMailer(): Promise<Transporter> {
  const email = process.env.GMAIL_EMAIL
  const pass = process.env.GMAIL_PASS

  cachedTransporter = createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: pass,
    },
  });

  return cachedTransporter
}

export const sendVerificationEmail = async (to: string, link: string) => {
  const transporter = cachedTransporter ?? await initNodeMailer();

  await transporter.sendMail({
    from: '"PetCare" <kontakt@petcare.pl>',
    to,
    subject: 'Potwierdzenie email',
    html: `
  <div style="background: linear-gradient(135deg, #4158D0 0%, #C850C0 100%); padding: 40px 0; font-family: Arial, sans-serif; text-align: center; color: #fff;">
    <div style="background: rgba(255, 255, 255, 0.15); max-width: 480px; margin: auto; padding: 30px 20px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
      <h1 style="margin-bottom: 20px; font-size: 24px;">Potwierdzenie adresu e-mail</h2>
      <p style="font-size: 18px; line-height: 1.5; color: #f0f0f0;">Dziękujemy za rejestrację w PetCare!</p>
      <p style="font-size: 16px; line-height: 1.4; color: #e0e0e0;">Kliknij przycisk poniżej, aby potwierdzić swój adres e-mail:</p>
      <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #ffffff; color: #4158D0; text-decoration: none; border-radius: 8px; font-weight: bold;">Potwierdź e-mail</a>
      <p style="font-size: 12px; color: #ccc;">Jeśli nie rejestrowałeś się w PetCare, zignoruj tę wiadomość.</p>
    </div>
    <p style="margin-top: 40px; font-size: 12px; color: #dddddd;">PetCare © 2025</p>
  </div>
`,
  });

};
