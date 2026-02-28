import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCampusStore } from '@/store/campusStore';
import { generateSimulationScenarios } from '@/lib/mockData';
import { 
  Settings, 
  Search, 
  Battery, 
  Wifi, 
  WifiOff, 
  Sliders,
  Play,
  Users,
  TrendingUp,
  Check
} from 'lucide-react';
import type { SimulationScenario } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export function AdminControl() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { bins, stpSensors, alertThresholds, setAlertThreshold, setSimulationScenario } = useCampusStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = generateSimulationScenarios();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelector('.sensor-registry'),
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelector('.control-panel'),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelector('.cta-section'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bin.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'online' && bin.batteryLevel > 20) ||
                         (filterStatus === 'offline' && bin.batteryLevel <= 20);
    return matchesSearch && matchesStatus;
  });

  const runSimulation = () => {
    if (!selectedScenario) return;
    setIsSimulating(true);
    setSimulationScenario(selectedScenario);
    
    // Simulate for 3 seconds
    setTimeout(() => {
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <section
      id="admin"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="section-title mb-3">Admin Control</h2>
          <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
            Sensor registry, alert configuration, and scenario simulation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Sensor Registry */}
          <div className="sensor-registry lg:col-span-2 glass-panel rounded-xl overflow-hidden">
            <div className="p-4 md:p-5 border-b border-[#2A3449]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-[#00F0FF]" />
                  <h3 className="font-semibold text-[#F2F5F9]">Sensor Registry</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-xs">
                    {bins.length + stpSensors.length} devices
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9B3C2]" />
                    <input
                      type="text"
                      placeholder="Search sensors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-[#111827] border border-[#2A3449] rounded-lg text-sm text-[#F2F5F9] placeholder-[#A9B3C2] focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3 py-2 bg-[#111827] border border-[#2A3449] rounded-lg text-sm text-[#F2F5F9] focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="all">All</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sensor Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111827]">
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">ID</th>
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">NAME</th>
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">TYPE</th>
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">BATTERY</th>
                    <th className="px-4 py-3 text-left text-xs mono text-[#A9B3C2]">LAST PING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3449]">
                  {filteredBins.slice(0, 8).map((bin) => (
                    <tr key={bin.id} className="hover:bg-[#232D42]/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-[#00F0FF] font-mono">{bin.id}</td>
                      <td className="px-4 py-3 text-sm text-[#F2F5F9]">{bin.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-[#1A2233] text-xs text-[#A9B3C2] capitalize">
                          {bin.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {bin.batteryLevel > 20 ? (
                            <Wifi className="w-4 h-4 text-[#27C59A]" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-[#FF4D6D]" />
                          )}
                          <span className={`text-xs ${bin.batteryLevel > 20 ? 'text-[#27C59A]' : 'text-[#FF4D6D]'}`}>
                            {bin.batteryLevel > 20 ? 'Online' : 'Low Battery'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Battery className={`w-4 h-4 ${
                            bin.batteryLevel > 50 ? 'text-[#27C59A]' : 
                            bin.batteryLevel > 20 ? 'text-[#F59E0B]' : 'text-[#FF4D6D]'
                          }`} />
                          <span className="text-sm text-[#F2F5F9]">{bin.batteryLevel}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#A9B3C2]">
                        {new Date(bin.lastPing).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show more */}
            {filteredBins.length > 8 && (
              <div className="p-4 text-center border-t border-[#2A3449]">
                <button className="text-sm text-[#00F0FF] hover:underline">
                  Show {filteredBins.length - 8} more sensors
                </button>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="control-panel space-y-6">
            {/* Alert Rules */}
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="font-semibold text-[#F2F5F9]">Alert Rules</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#A9B3C2]">Bin Fill Warning</span>
                    <span className="text-sm text-[#F59E0B]">{alertThresholds.binFillWarning}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={alertThresholds.binFillWarning}
                    onChange={(e) => setAlertThreshold('binFillWarning', Number(e.target.value))}
                    className="w-full h-2 bg-[#2A3449] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#A9B3C2]">Bin Fill Critical</span>
                    <span className="text-sm text-[#FF4D6D]">{alertThresholds.binFillCritical}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={alertThresholds.binFillCritical}
                    onChange={(e) => setAlertThreshold('binFillCritical', Number(e.target.value))}
                    className="w-full h-2 bg-[#2A3449] rounded-lg appearance-none cursor-pointer accent-[#FF4D6D]"
                  />
                </div>

                <div className="pt-3 border-t border-[#2A3449]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A9B3C2]">pH Range</span>
                    <span className="text-sm text-[#00F0FF]">
                      {alertThresholds.phMin} - {alertThresholds.phMax}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Mode */}
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Play className="w-5 h-5 text-[#27C59A]" />
                <h3 className="font-semibold text-[#F2F5F9]">What-If Simulation</h3>
              </div>

              <div className="space-y-3 mb-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedScenario?.id === scenario.id
                        ? 'bg-[#27C59A]/10 border-[#27C59A]/50'
                        : 'bg-[#111827] border-[#2A3449] hover:border-[#00F0FF]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F2F5F9]">{scenario.name}</span>
                      {selectedScenario?.id === scenario.id && (
                        <Check className="w-4 h-4 text-[#27C59A]" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-[#A9B3C2]">
                        <Users className="w-3 h-3" />
                        {scenario.attendance.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#F59E0B]">
                        <TrendingUp className="w-3 h-3" />
                        +{scenario.predictedWasteIncrease}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedScenario && (
                <div className="p-3 bg-[#111827] rounded-lg border border-[#2A3449] mb-4">
                  <div className="text-xs mono text-[#A9B3C2] mb-2">PREDICTED IMPACT</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F2F5F9]">Waste Increase</span>
                      <span className="text-sm text-[#FF4D6D]">+{selectedScenario.predictedWasteIncrease}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F2F5F9]">Water Increase</span>
                      <span className="text-sm text-[#F59E0B]">+{selectedScenario.predictedWaterIncrease}%</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={runSimulation}
                disabled={!selectedScenario || isSimulating}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isSimulating
                    ? 'bg-[#27C59A]/50 text-[#F2F5F9] cursor-not-allowed'
                    : 'bg-[#27C59A] text-[#0B0F17] hover:bg-[#27C59A]/90'
                }`}
              >
                {isSimulating ? 'Running Simulation...' : 'Run Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section mt-12 glass-panel rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[#F2F5F9] mb-4">
            Ready to deploy your own living lab?
          </h3>
          <p className="text-[#A9B3C2] max-w-2xl mx-auto mb-8">
            Campus Pulse is built for Danger Rider edge-to-cloud performance. Transform your campus into a smart city prototype with our scalable IoT infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-3 bg-[#00F0FF] text-[#0B0F17] rounded-lg font-semibold hover:bg-[#00F0FF]/90 transition-colors">
              Request a Demo
            </button>
            <button className="px-6 py-3 bg-[#1A2233] border border-[#2A3449] text-[#F2F5F9] rounded-lg font-semibold hover:border-[#00F0FF]/30 transition-colors">
              Download Brief
            </button>
          </div>
          
          {/* Danger Rider Badge */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ED1C24] flex items-center justify-center">
                <span className="text-white font-bold text-xs">DR</span>
              </div>
              <span className="text-sm text-[#A9B3C2]">Powered by Danger Rider Team</span>
            </div>
            <div className="w-px h-6 bg-[#2A3449]" />
            <div className="text-sm text-[#A9B3C2]">
              Edge-to-Cloud Architecture
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
