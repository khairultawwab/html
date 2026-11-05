import { execSync } from 'child_process';
import net from 'net';

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function ensurePostgres() {
  const isRunning = await checkPort(5432);
  if (!isRunning) {
    console.log('[ensure-db] Starting PostgreSQL 15...');
    try {
      execSync('su appuser -c "/opt/postgres/usr/lib/postgresql/15/bin/pg_ctl -D /opt/postgres/data -o \'-p 5432 -k /tmp\' start"', { stdio: 'inherit' });
      execSync('sleep 2');
    } catch (e) {
      console.warn('[ensure-db] Could not start pg_ctl:', e.message);
    }
  } else {
    console.log('[ensure-db] PostgreSQL is already running.');
  }

  try {
    console.log('[ensure-db] Syncing schema...');
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'postgresql://appuser@localhost:5432/minicms' },
      stdio: 'inherit'
    });
  } catch (e) {
    console.warn('[ensure-db] prisma db push notice:', e.message);
  }
}

ensurePostgres().catch(console.error);
