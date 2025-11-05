'use client';

import { useState, useMemo } from 'react';
import { FilterControls, type Filters } from '@/components/admin/FilterControls';
import { PlaceCard } from '@/components/admin/PlaceCard';
import type { CulturalEvent } from '@/lib/types';

export function EventsList({ events }: { events: CulturalEvent[] }) {
  const [filters, setFilters] = useState<Filters>({ name: '', city: '', state: '' });

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      event.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      event.state.toLowerCase().includes(filters.state.toLowerCase())
    );
  }, [events, filters]);

  return (
    <>
      <FilterControls onFilterChange={setFilters} />
      <main className="flex-1 overflow-y-auto p-6">
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map(event => (
              <PlaceCard key={event.id} item={event} type="event" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <h3 className="text-lg font-semibold">No Events Found</h3>
            <p className="text-sm">Try adjusting your filters or add a new event.</p>
          </div>
        )}
      </main>
    </>
  );
}
