'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Mail, MapPin, X } from 'lucide-react';
import type { Submission } from '@/lib/types';
import { approveSubmission, rejectSubmission } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface SubmissionCardProps {
  item: Submission;
}

export function SubmissionCard({ item }: SubmissionCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAction = (action: 'approve' | 'reject') => {
    startTransition(async () => {
      const formData = new FormData();
      const result = action === 'approve' 
        ? await approveSubmission(item.id, formData) 
        : await rejectSubmission(item.id, formData);
      
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
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
        <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Submitted by: {item.submittedBy}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/50 p-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('reject')}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => handleAction('approve')}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
