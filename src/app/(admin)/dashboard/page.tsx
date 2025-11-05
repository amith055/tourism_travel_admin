import { getDashboardStats } from '@/lib/data';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { CalendarDays, FileCheck2, MapPin } from 'lucide-react';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Dashboard"
        description="An overview of your tourism and travel data."
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Tourist Places"
            value={stats.places}
            icon={MapPin}
          />
          <StatCard
            title="Total Cultural Events"
            value={stats.events}
            icon={CalendarDays}
          />
          <StatCard
            title="Pending Submissions"
            value={stats.submissions}
            icon={FileCheck2}
          />
        </div>
      </main>
    </div>
  );
}
