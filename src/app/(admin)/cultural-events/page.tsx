import { getCulturalEvents } from '@/lib/data';
import { PageHeader } from '@/components/admin/PageHeader';
import { Suspense } from 'react';
import { EventsList } from './_components/events-list';

export const dynamic = 'force-dynamic';

export default async function CulturalEventsPage() {
  const events = await getCulturalEvents();

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Cultural Events"
        description="Manage and verify approved cultural events."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <EventsList events={events} />
      </Suspense>
    </div>
  );
}
