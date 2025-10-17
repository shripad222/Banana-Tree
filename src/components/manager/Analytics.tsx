import { ParkingStats } from '@/types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, ParkingSquare, Clock, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsProps {
  stats: ParkingStats;
}

export const Analytics = ({ stats }: AnalyticsProps) => {
  const statCards = [
    {
      title: 'Total Spots',
      value: stats.total,
      icon: ParkingSquare,
      color: 'text-primary',
    },
    {
      title: 'Available',
      value: stats.free,
      icon: Car,
      color: 'text-status-free',
    },
    {
      title: 'Occupied',
      value: stats.occupied,
      icon: Clock,
      color: 'text-status-occupied',
    },
    {
      title: 'Reserved',
      value: stats.reserved,
      icon: TrendingUp,
      color: 'text-status-reserved',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-primary">
                  {(stats.occupancyRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.occupancyRate * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.occupied + stats.reserved} of {stats.total} spots in use
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-primary">
                ₹{stats.averagePrice.toFixed(2)}
                <span className="text-lg text-muted-foreground ml-2">/hr</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dynamic pricing based on current occupancy
              </p>
              {stats.occupancyRate > 0.75 && (
                <p className="text-sm text-status-reserved font-medium">
                  🔥 High demand - surge pricing active
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Spot Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-status-free">Available</span>
                  <span className="font-semibold">{stats.free} spots</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-status-free h-2 rounded-full transition-all"
                    style={{ width: `${(stats.free / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-status-occupied">Occupied</span>
                  <span className="font-semibold">{stats.occupied} spots</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-status-occupied h-2 rounded-full transition-all"
                    style={{ width: `${(stats.occupied / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-status-reserved">Reserved</span>
                  <span className="font-semibold">{stats.reserved} spots</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-status-reserved h-2 rounded-full transition-all"
                    style={{ width: `${(stats.reserved / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Efficiency Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Utilization Rate</span>
                <span className="text-2xl font-bold text-primary">
                  {((stats.occupied + stats.reserved) / stats.total * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-status-free/10 rounded-lg">
                <span className="text-sm font-medium">Availability</span>
                <span className="text-2xl font-bold text-status-free">
                  {(stats.free / stats.total * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-status-reserved/10 rounded-lg">
                <span className="text-sm font-medium">Reserved</span>
                <span className="text-2xl font-bold text-status-reserved">
                  {(stats.reserved / stats.total * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
