import React from 'react';
import { AlertCircle } from 'lucide-react'; // Icon
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Custom UI Components
import { Button } from '@/components/ui/button'; // Custom Button

// Define TypeScript type for alert
type AlertType = 'error' | 'warning' | 'info';

type Alert = {
  id: string;
  message: string;
  type: AlertType;
};

type SystemAlertsProps = {
  alerts: Alert[];
  onResolve?: (id: string) => void;
};

const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts, onResolve }) => {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-lg">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="flex items-center space-x-2 lg:space-x-3 text-amber-800">
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <span className="text-lg lg:text-xl">System Alerts ({alerts.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 lg:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border shadow-sm transition-all duration-300 hover:shadow-md ${
                alert.type === 'error'
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50 text-red-800'
                  : alert.type === 'warning'
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50 text-amber-800'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50 text-blue-800'
              }`}
            >
              <span className="font-semibold text-sm lg:text-base">{alert.message}</span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs lg:text-sm font-medium hover:shadow-md transition-shadow w-full sm:w-auto"
                onClick={() => onResolve?.(alert.id)}
              >
                Resolve
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
