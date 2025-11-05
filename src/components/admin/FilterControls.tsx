'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Filters = {
  name: string;
  city: string;
  state: string;
};

interface FilterControlsProps {
  onFilterChange: (filters: Filters) => void;
}

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [filters, setFilters] = useState<Filters>({
    name: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ name: '', city: '', state: '' });
  };
  
  const hasFilters = filters.name || filters.city || filters.state;

  return (
    <div className="sticky top-0 z-10 bg-card p-4 px-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="name"
            placeholder="Filter by name..."
            value={filters.name}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <Input
            name="city"
            placeholder="Filter by city..."
            value={filters.city}
            onChange={handleInputChange}
          />
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <Input
            name="state"
            placeholder="Filter by state..."
            value={filters.state}
            onChange={handleInputChange}
          />
        </div>
        {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Clear
            </Button>
        )}
      </div>
    </div>
  );
}
