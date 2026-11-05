import 'dotenv/config';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://appuser@localhost:5432/minicms';
}
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function getOrCreateDefaultUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'khairultawwab@gmail.com',
        password: 'hashed_password_default',
        role: 'ADMIN',
      },
    });

    // Seed sample pages
    await prisma.page.createMany({
      data: [
        {
          title: 'Laman Pendaratan Produk (Landing Page)',
          slug: 'produk-hebat',
          isPublished: true,
          userId: user.id,
          htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Produk Hebat 2026</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #0f172a; color: #f8fafc; }
    .hero { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
    .badge { background: #3b82f6; color: white; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; }
    h1 { font-size: 3.5rem; font-weight: 800; margin: 0 0 1rem; background: linear-gradient(135deg, #60a5fa, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin: 0 0 2rem; line-height: 1.6; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 0.85rem 2rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 1.1rem; box-shadow: 0 10px 25px -5px rgba(37,99,235,0.5); }
    .btn:hover { background: #1d4ed8; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; max-width: 1000px; width: 100%; margin: 3rem auto 0; padding: 0 1rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 1rem; padding: 1.75rem; text-align: left; }
    .card h3 { color: #38bdf8; margin-top: 0; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="badge">Edisi Terhad 2026</div>
    <h1>Revolusi Hosting HTML Segera</h1>
    <p>Hoskan halaman web HTML, CSS, dan JavaScript anda dalam beberapa saat tanpa persediaan pelayan yang rumit.</p>
    <a href="#daftar" class="btn">Mulakan Sekarang &rarr;</a>
    <div class="features">
      <div class="card">
        <h3>⚡ Sangat Pantas</h3>
        <p style="font-size: 0.95rem;">Dikuasakan oleh Next.js 15 & PostgreSQL untuk kelajuan capaian optimum.</p>
      </div>
      <div class="card">
        <h3>📱 QR Code Terus</h3>
        <p style="font-size: 0.95rem;">Jana kod QR pantas untuk perkongsian mudah di media sosial atau risalah.</p>
      </div>
      <div class="card">
        <h3>🔒 Kawalan Status</h3>
        <p style="font-size: 0.95rem;">Simpan sebagai Draf atau Terbitkan secara langsung dengan satu klik.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
        },
        {
          title: 'Kad Perniagaan Digital & Portfolio',
          slug: 'biodata-khairul',
          isPublished: true,
          userId: user.id,
          htmlContent: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Khairul Tawwab - Profil Digital</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
    .card { background: white; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); width: 100%; max-width: 440px; padding: 2.5rem; text-align: center; }
    .avatar { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; margin: 0 auto 1.25rem; }
    h2 { margin: 0 0 0.25rem; font-size: 1.5rem; }
    .role { color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; }
    .links a { display: block; margin-bottom: 0.75rem; padding: 0.85rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: #0f172a; font-weight: 500; transition: all 0.2s; }
    .links a:hover { background: #4f46e5; color: white; border-color: #4f46e5; transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">KT</div>
    <h2>Khairul Tawwab</h2>
    <div class="role">Jurutera Web & Pembina Sistem</div>
    <div class="links">
      <a href="mailto:khairultawwab@gmail.com">✉️ Emel: khairultawwab@gmail.com</a>
      <a href="https://github.com" target="_blank">💻 Projek GitHub</a>
      <a href="https://linkedin.com" target="_blank">👔 Profil LinkedIn</a>
    </div>
  </div>
</body>
</html>`,
        },
        {
          title: 'Draf Dokumen Acara Komuniti',
          slug: 'jemputan-acara-2026',
          isPublished: false,
          userId: user.id,
          htmlContent: `<h1>Jemputan Acara Komuniti 2026</h1><p>Halaman ini masih dalam status Draf dan belum diterbitkan.</p>`,
        },
      ],
    });
  }
  return user;
}
