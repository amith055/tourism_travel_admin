'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pencil, Sparkles, Trash } from 'lucide-react';
import type { CulturalEvent, TouristPlace } from '@/lib/types';
import { GenerateDescriptionDialog } from './GenerateDescriptionDialog';

interface PlaceCardProps {
  item: TouristPlace | CulturalEvent;
  type: 'place' | 'event';
}

export function PlaceCard({ item, type }: PlaceCardProps) {
  const [isGenerateOpen, setGenerateOpen] = useState(false);

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
          </div>
          <div className="p-6 pb-2">
            <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 pt-1">
              <MapPin className="h-4 w-4" />
              {item.city}, {item.state}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-2">
          <Badge variant={type === 'place' ? 'secondary' : 'default'} className={type === 'event' ? 'bg-accent text-accent-foreground' : ''}>
            {type === 'place' ? 'Tourist Place' : 'Cultural Event'}
          </Badge>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-3">
          {type === 'place' && (
            <Button variant="outline" size="sm" onClick={() => setGenerateOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>
      {type === 'place' && <GenerateDescriptionDialog item={item} open={isGenerateOpen} onOpenChange={setGenerateOpen} />}
    </>
  );
}
