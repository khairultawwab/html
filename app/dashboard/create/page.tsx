'use client';

import PageForm from '@/components/PageForm';

export default function CreatePage() {
  return (
    <div className="max-w-5xl mx-auto py-2">
      <PageForm isEdit={false} />
    </div>
  );
}
