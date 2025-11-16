'use client';

import { useState, useMemo } from 'react';
import { FilterControls, type Filters } from '@/components/admin/FilterControls';
import { SubmissionCard } from '@/components/admin/SubmissionCard';
import type { getSubmissions,  Submission } from '@/lib/submissions';

export function SubmissionsList({ submissions }: { submissions: Submission[] }) {
  const [filters, setFilters] = useState<Filters>({ name: '', city: '', state: '' });

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission =>
      submission.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      submission.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      submission.state.toLowerCase().includes(filters.state.toLowerCase())
    );
  }, [submissions, filters]);

  return (
    <>
      <FilterControls onFilterChange={setFilters} />
      <main className="flex-1 overflow-y-auto p-6">
        {filteredSubmissions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSubmissions.map(submission => (
              <SubmissionCard key={submission.id} item={submission} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <h3 className="text-lg font-semibold">No Submissions Found</h3>
            <p className="text-sm">The submission queue is empty.</p>
          </div>
        )}
      </main>
    </>
  );
}
