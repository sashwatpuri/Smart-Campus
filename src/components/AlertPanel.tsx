import { useState } from 'react';
import { AlertTriangle, X, Bell, Check } from 'lucide-react';
import { useCampusStore } from '@/store/campusStore';
import type { Alert } from '@/types';

export function AlertPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, acknowledgeAlert } = useCampusStore();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalCount = unacknowledgedAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = unacknowledgedAlerts.filter(a => a.severity === 'warning').length;

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-[#FF4D6D] border-[#FF4D6D]/30 bg-[#FF4D6D]/5';
      case 'warning':
        return 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5';
      case 'info':
        return 'text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-[#FF4D6D]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'info':
        return <Bell className="w-4 h-4 text-[#00F0FF]" />;
    }
  };

  return (
    <>
      {/* Alert Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 md:right-6 top-20 z-50 w-10 h-10 rounded-xl bg-[#1A2233] border border-[#2A3449] flex items-center justify-center hover:border-[#00F0FF]/30 transition-colors"
      >
        <Bell className="w-5 h-5 text-[#A9B3C2]" />
        {(criticalCount > 0 || warningCount > 0) && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4D6D] flex items-center justify-center text-[10px] font-bold text-white">
            {criticalCount + warningCount}
          </div>
        )}
      </button>

      {/* Alert Panel */}
      {isOpen && (
        <div className="fixed right-4 md:right-6 top-32 z-50 w-80 md:w-96 max-h-[70vh] bg-[#1A2233]/95 backdrop-blur-lg border border-[#2A3449] rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3449]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-semibold text-sm text-[#F2F5F9]">Alerts</span>
              {unacknowledgedAlerts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-xs">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[#232D42] transition-colors"
            >
              <X className="w-4 h-4 text-[#A9B3C2]" />
            </button>
          </div>

          {/* Alert List */}
          <div className="overflow-y-auto max-h-[50vh]">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-[#2A3449] mx-auto mb-2" />
                <p className="text-sm text-[#A9B3C2]">No alerts</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2A3449]">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 ${alert.acknowledged ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm text-[#F2F5F9] truncate">
                            {alert.title}
                          </h4>
                          {!alert.acknowledged && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="p-1 rounded hover:bg-[#232D42] transition-colors flex-shrink-0"
                              title="Acknowledge"
                            >
                              <Check className="w-3.5 h-3.5 text-[#27C59A]" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#A9B3C2] mt-1 line-clamp-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] mono text-[#A9B3C2]">
                            {alert.source}
                          </span>
                          <span className="text-[10px] mono text-[#A9B3C2]">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[#2A3449] bg-[#111827]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A9B3C2]">
                {criticalCount > 0 && (
                  <span className="text-[#FF4D6D]">{criticalCount} Critical</span>
                )}
                {criticalCount > 0 && warningCount > 0 && (
                  <span className="text-[#A9B3C2] mx-1">·</span>
                )}
                {warningCount > 0 && (
                  <span className="text-[#F59E0B]">{warningCount} Warning</span>
                )}
              </span>
              <button
                onClick={() => alerts.filter(a => !a.acknowledged).forEach(a => acknowledgeAlert(a.id))}
                className="text-[#00F0FF] hover:underline"
              >
                Acknowledge all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
