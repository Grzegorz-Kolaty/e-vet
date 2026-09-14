import {randomBytes} from 'node:crypto';
import {existsSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '..');
const envPath = resolve(projectRoot, '.env.dev');

if (existsSync(envPath)) {
  console.log('[OK] .env.dev already exists. Nothing to do.');
  process.exit(0);
}

function readSecret(prompt) {
  return new Promise((resolveSecret) => {
    process.stdout.write(prompt);

    let value = '';

    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
    };

    const onData = (key) => {
      if (key === '\u0003') {
        cleanup();
        console.log('\nCancelled.');
        process.exit(130);
      }

      if (key === '\r' || key === '\n') {
        cleanup();
        process.stdout.write('\n');
        resolveSecret(value);
        return;
      }

      if (key === '\u0008' || key === '\u007f') {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write('\b \b');
        }

        return;
      }

      if (key.charCodeAt(0) < 32) {
        return;
      }

      value += key;
      process.stdout.write('*');
    };

    process.stdin.on('data', onData);
  });
}

function isValidDomain(value) {
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(value);
}

function normalizeDomain(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function dockerVolumeExists(name) {
  try {
    execFileSync('docker', ['volume', 'inspect', name], {
      stdio: 'ignore',
    });

    return true;
  } catch {
    return false;
  }
}

// Resend API key

let resendApiKey;

while (true) {
  resendApiKey = (await readSecret('Resend API Key: ')).trim();

  if (!resendApiKey) {
    console.log('[ERROR] API key cannot be empty.');
    continue;
  }

  if (!resendApiKey.startsWith('re_')) {
    console.log('[ERROR] Resend API key should start with "re_".');
    continue;
  }

  break;
}

// Resend domain

const rl = createInterface({input, output});

let resendDomain;

while (true) {
  const value = await rl.question('Resend domain: ');

  resendDomain = normalizeDomain(value);

  if (!resendDomain) {
    console.log('[ERROR] Domain cannot be empty.');
    continue;
  }

  if (!isValidDomain(resendDomain)) {
    console.log('[ERROR] Enter a valid domain, for example: example.com');
    continue;
  }

  break;
}

rl.close();

// Database

const dbName = 'evet_dev';
const dbUser = 'evet_user';
const dbPassword = randomBytes(24).toString('base64url');

const senderEmail = `system@${resendDomain}`;
const mailFrom = `VetReservation <${senderEmail}>`;

const env = `ENVIRONMENT=development

POSTGRES_DB=${dbName}
POSTGRES_USER=${dbUser}
POSTGRES_PASSWORD=${dbPassword}

DATABASE_URL=postgresql+psycopg://${dbUser}:${encodeURIComponent(dbPassword)}@db:5432/${dbName}
SQL_ECHO=true

CORS_ORIGINS=["http://localhost:4200"]

SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAMESITE=lax
SESSION_COOKIE_NAME=session_id
SESSION_TTL_DAYS=7

MAIL_PROVIDER=resend
RESEND_API_KEY=${resendApiKey}
MAIL_FROM=${mailFrom}
FRONTEND_URL=http://localhost:4200
`;

writeFileSync(envPath, env, {
  encoding: 'utf8',
  flag: 'wx',
});

console.log('');
console.log('[OK] Created .env.dev');
console.log(`[OK] PostgreSQL database: ${dbName}`);
console.log(`[OK] PostgreSQL user: ${dbUser}`);
console.log('[OK] PostgreSQL password generated automatically.');
console.log('[OK] Resend API key configured.');
console.log(`[OK] Resend domain configured: ${resendDomain}`);
console.log(`[OK] Mail sender configured: ${mailFrom}`);

// Existing PostgreSQL volume check

const postgresVolume = 'e-vet_postgres_data_dev';

if (dockerVolumeExists(postgresVolume)) {
  console.log('');
  console.log(`[WARN] Existing PostgreSQL volume detected: ${postgresVolume}`);
  console.log('[WARN] It may have been initialized with different credentials.');
  console.log('');
  console.log('If this is a fresh development setup, remove it before starting:');
  console.log('');
  console.log('docker compose --env-file .env.dev -f docker-compose.dev.yml down');
  console.log(`docker volume rm ${postgresVolume}`);
}
