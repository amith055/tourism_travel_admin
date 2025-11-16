'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin } from 'lucide-react';
import type { Submission } from '@/lib/types';

interface SubmissionCardProps {
  item: Submission;
}

export function SubmissionCard({ item }: SubmissionCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/submissions/${item.id}`); // ✅ navigate to details page
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
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
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-2 h-4 w-4" />
          Submitted by: {item.submittedBy}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/50 p-3">
        <Button size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
