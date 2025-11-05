import type { FC } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <header className="border-b bg-card p-4 px-6">
      <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </header>
  );
};
