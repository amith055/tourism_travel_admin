'use client';

import { useState, useMemo } from 'react';
import { FilterControls, type Filters } from '@/components/admin/FilterControls';
import { PlaceCard } from '@/components/admin/PlaceCard';
import type { TouristPlace } from '@/lib/types';

export function PlacesList({ places }: { places: TouristPlace[] }) {
  const [filters, setFilters] = useState<Filters>({ name: '', city: '', state: '' });

  const filteredPlaces = useMemo(() => {
    return places.filter(place =>
      (place.name || '').toLowerCase().includes(filters.name.toLowerCase()) &&
      (place.city || '').toLowerCase().includes(filters.city.toLowerCase()) &&
      (place.state || '').toLowerCase().includes(filters.state.toLowerCase())
    );
  }, [places, filters]);

  return (
    <>
      <FilterControls onFilterChange={setFilters} />
      <main className="flex-1 overflow-y-auto p-6">
        {filteredPlaces.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.id} item={place} type="place" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <h3 className="text-lg font-semibold">No Places Found</h3>
            <p className="text-sm">Try adjusting your filters or add a new place.</p>
          </div>
        )}
      </main>
    </>
  );
}
