import { NextRequest, NextResponse } from 'next/server';
import { prisma, getOrCreateDefaultUser } from '@/lib/prisma';
import { generateSlug, isValidSlug } from '@/lib/slug';

// GET /api/pages - Senaraikan semua halaman
export async function GET() {
  try {
    await getOrCreateDefaultUser();
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mendapatkan senarai halaman: ' + (error?.message || 'Ralat pelayan') },
      { status: 500 }
    );
  }
}

// POST /api/pages - Cipta halaman baru
export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    const body = await request.json();
    const { title, slug, htmlContent, isPublished } = body;

    // Pengesahan input
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Tajuk halaman diperlukan.' },
        { status: 400 }
      );
    }

    const cleanSlug = generateSlug(slug || title);
    if (!cleanSlug || !isValidSlug(cleanSlug)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug tidak sah. Sila gunakan huruf kecil, nombor, dan tanda sempang (-).',
        },
        { status: 400 }
      );
    }

    // Semak keunikan slug
    const existing = await prisma.page.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Slug "${cleanSlug}" telah digunakan. Sila pilih slug yang berbeza.`,
        },
        { status: 409 }
      );
    }

    // Cipta halaman baru
    const newPage = await prisma.page.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        htmlContent: typeof htmlContent === 'string' ? htmlContent : '',
        isPublished: Boolean(isPublished),
        userId: user.id,
      },
    });

    return NextResponse.json(
      { success: true, data: newPage, message: 'Halaman berjaya dicipta!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencipta halaman: ' + (error?.message || 'Ralat pelayan') },
      { status: 500 }
    );
  }
}
