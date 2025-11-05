import { getSubmissions } from '@/lib/data';
import { PageHeader } from '@/components/admin/PageHeader';
import { Suspense } from 'react';
import { SubmissionsList } from './_components/submissions-list';

export const dynamic = 'force-dynamic';

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Submissions"
        description="Review and approve new tourist places and events."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <SubmissionsList submissions={submissions} />
      </Suspense>
    </div>
  );
}
