import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageForm from '@/components/PageForm';
import type { Metadata } from 'next';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: EditPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const page = await prisma.page.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: page ? `Sunting: ${page.title}` : 'Sunting Halaman',
  };
}

export default async function EditPage(props: EditPageProps) {
  // Mengisytiharkan params sebagai Promise dan wajib di-await (Next.js 15)
  const { id } = await props.params;

  const page = await prisma.page.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-2">
      <PageForm
        isEdit={true}
        initialData={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          htmlContent: page.htmlContent,
          isPublished: page.isPublished,
        }}
      />
    </div>
  );
}
