import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug, isValidSlug } from '@/lib/slug';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/pages/[id] - Dapatkan butiran satu halaman
export async function GET(request: NextRequest, props: RouteContext) {
  try {
    const { id } = await props.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID halaman diperlukan.' },
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Halaman tidak dijumpai.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    console.error('Error fetching page by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mendapatkan data halaman: ' + (error?.message || 'Ralat pelayan') },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Kemaskini halaman
export async function PUT(request: NextRequest, props: RouteContext) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const { title, slug, htmlContent, isPublished } = body;

    // Semak kewujudan halaman
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Halaman yang hendak dikemaskini tidak dijumpai.' },
        { status: 404 }
      );
    }

    // Pengesahan tajuk
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Tajuk halaman diperlukan.' },
        { status: 400 }
      );
    }

    // Pengesahan slug
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

    // Jika slug berubah, semak jika slug baru sudah dimiliki oleh rekod lain
    if (cleanSlug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: { slug: cleanSlug },
      });

      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          {
            success: false,
            error: `Slug "${cleanSlug}" telah digunakan oleh halaman lain. Sila pilih slug yang berbeza.`,
          },
          { status: 409 }
        );
      }
    }

    // Kemaskini rekod
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        htmlContent: typeof htmlContent === 'string' ? htmlContent : existingPage.htmlContent,
        isPublished: typeof isPublished === 'boolean' ? isPublished : existingPage.isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: 'Halaman berjaya dikemaskini!',
    });
  } catch (error: any) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengemaskini halaman: ' + (error?.message || 'Ralat pelayan') },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Padam halaman
export async function DELETE(request: NextRequest, props: RouteContext) {
  try {
    const { id } = await props.params;

    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Halaman tidak dijumpai atau telah dipadam.' },
        { status: 404 }
      );
    }

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Halaman "${existingPage.title}" berjaya dipadam.`,
    });
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memadam halaman: ' + (error?.message || 'Ralat pelayan') },
      { status: 500 }
    );
  }
}
