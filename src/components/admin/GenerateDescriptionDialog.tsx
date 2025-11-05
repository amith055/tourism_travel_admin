'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import type { BaseLocation } from '@/lib/types';
import {
  generateLocationDescription,
  GenerateLocationDescriptionInput,
} from '@/ai/flows/generate-location-description';
import { useToast } from '@/hooks/use-toast';

interface GenerateDescriptionDialogProps {
  item: BaseLocation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateDescriptionDialog({ item, open, onOpenChange }: GenerateDescriptionDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [formData, setFormData] = useState<GenerateLocationDescriptionInput>({
    coordinates: item.coordinates || '',
    landmarks: item.landmarks || '',
    infrastructure: item.infrastructure || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedDescription('');
    startTransition(async () => {
      try {
        const result = await generateLocationDescription(formData);
        setGeneratedDescription(result.description);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate description.',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            Generate Description for {item.name}
          </DialogTitle>
          <DialogDescription>
            Use AI to generate a compelling description based on the location's details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coordinates" className="text-right">
              Coordinates
            </Label>
            <Input id="coordinates" name="coordinates" value={formData.coordinates} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="landmarks" className="text-right">
              Landmarks
            </Label>
            <Input id="landmarks" name="landmarks" value={formData.landmarks} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="infrastructure" className="text-right">
              Infrastructure
            </Label>
            <Input id="infrastructure" name="infrastructure" value={formData.infrastructure} onChange={handleInputChange} className="col-span-3" />
          </div>
          {generatedDescription && (
            <div className="rounded-md border bg-muted p-4">
              <h4 className="font-semibold mb-2">Generated Description:</h4>
              <p className="text-sm text-muted-foreground">{generatedDescription}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
