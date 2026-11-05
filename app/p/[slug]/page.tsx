import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

// Jana metadata dinamik berasaskan kandungan halaman
export async function generateMetadata(props: PublicPageProps): Promise<Metadata> {
  const { slug } = await props.params;

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, isPublished: true },
  });

  if (!page || !page.isPublished) {
    return {
      title: '404 - Halaman Tidak Dijumpai',
      description: 'Halaman yang dicari tidak wujud atau belum diterbitkan.',
    };
  }

  return {
    title: page.title,
    description: `Halaman HTML awam: ${page.title}`,
  };
}

// Server Component untuk paparan HTML mentah
export default async function PublicPage(props: PublicPageProps) {
  // Wajib di-await mengikut piawaian Next.js 15
  const { slug } = await props.params;

  const page = await prisma.page.findUnique({
    where: { slug },
  });

  // Jika tidak wujud atau masih draf, pulangkan 404
  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div
      className="min-h-screen w-full"
      dangerouslySetInnerHTML={{ __html: page.htmlContent }}
    />
  );
}
