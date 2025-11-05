import { getTouristPlaces } from '@/lib/data';
import { PageHeader } from '@/components/admin/PageHeader';
import { FilterControls, type Filters } from '@/components/admin/FilterControls';
import { PlaceCard } from '@/components/admin/PlaceCard';
import type { TouristPlace } from '@/lib/types';
import { Suspense } from 'react';
import { PlacesList } from './_components/places-list';

export const dynamic = 'force-dynamic';

export default async function TouristPlacesPage() {
  const places = await getTouristPlaces();

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Tourist Places"
        description="Manage and verify approved tourist places."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PlacesList places={places} />
      </Suspense>
    </div>
  );
}
