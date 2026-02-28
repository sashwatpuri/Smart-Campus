import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCampusStore } from '@/store/campusStore';
import { Sparkline } from '@/components/charts/Sparkline';
import { TrendingUp, AlertTriangle, Clock, MapPin, Info } from 'lucide-react';
import type { SmartBin } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export function SmartBinNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { bins } = useCampusStore();
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [hoveredBin, setHoveredBin] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelector('.map-container'),
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelectorAll('.info-card'),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelectorAll('.bin-marker'),
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'back.out(1.7)',
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

  const getBinColor = (fillLevel: number) => {
    if (fillLevel > 80) return '#FF4D6D';
    if (fillLevel > 50) return '#F59E0B';
    return '#27C59A';
  };

  const getBinTypeIcon = (type: SmartBin['type']) => {
    switch (type) {
      case 'wet':
        return '🍃';
      case 'dry':
        return '🗑️';
      case 'recyclable':
        return '♻️';
    }
  };

  // Calculate stats
  const criticalBins = bins.filter(b => b.fillLevel > 80).length;
  const warningBins = bins.filter(b => b.fillLevel > 50 && b.fillLevel <= 80).length;

  // Mock trend data
  const trendData = [45, 52, 48, 61, 55, 67, 72];

  return (
    <section
      id="bins"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="section-title mb-3">Smart Bin Network</h2>
          <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
            AI-enabled waste monitoring across campus with predictive collection scheduling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Map Container */}
          <div className="map-container lg:col-span-3 glass-panel rounded-2xl p-4 md:p-6 relative overflow-hidden">
            {/* Legend */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111827]/80 backdrop-blur">
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C59A]" />
                <span className="text-[10px] mono text-[#A9B3C2]">&lt;50%</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111827]/80 backdrop-blur">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] mono text-[#A9B3C2]">50-80%</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111827]/80 backdrop-blur">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]" />
                <span className="text-[10px] mono text-[#A9B3C2]">&gt;80%</span>
              </div>
            </div>

            {/* Campus Map (Schematic) */}
            <div className="relative w-full aspect-[4/3] bg-[#111827] rounded-xl overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(#2A3449 1px, transparent 1px),
                    linear-gradient(90deg, #2A3449 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Building Outlines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                {/* Main Buildings */}
                <rect x="100" y="80" width="120" height="80" fill="#232D42" rx="4" />
                <rect x="300" y="60" width="100" height="120" fill="#232D42" rx="4" />
                <rect x="500" y="100" width="140" height="90" fill="#232D42" rx="4" />
                <rect x="80" y="250" width="90" height="100" fill="#232D42" rx="4" />
                <rect x="250" y="280" width="110" height="80" fill="#232D42" rx="4" />
                <rect x="450" y="260" width="130" height="110" fill="#232D42" rx="4" />
                <rect x="120" y="420" width="100" height="90" fill="#232D42" rx="4" />
                <rect x="320" y="440" width="120" height="80" fill="#232D42" rx="4" />
                <rect x="550" y="400" width="100" height="100" fill="#232D42" rx="4" />

                {/* Roads */}
                <line x1="0" y1="200" x2="800" y2="200" stroke="#2A3449" strokeWidth="20" />
                <line x1="220" y1="0" x2="220" y2="600" stroke="#2A3449" strokeWidth="20" />
                <line x1="420" y1="0" x2="420" y2="600" stroke="#2A3449" strokeWidth="20" />
                <line x1="0" y1="380" x2="800" y2="380" stroke="#2A3449" strokeWidth="20" />
              </svg>

              {/* Bin Markers */}
              {bins.map((bin, index) => {
                // Calculate position based on index (mock positioning)
                const row = Math.floor(index / 5);
                const col = index % 5;
                const x = 15 + col * 17 + (row % 2) * 8;
                const y = 15 + row * 18;
                const color = getBinColor(bin.fillLevel);
                const isHovered = hoveredBin === bin.id;
                const isSelected = selectedBin?.id === bin.id;

                return (
                  <button
                    key={bin.id}
                    className="bin-marker absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      zIndex: isHovered || isSelected ? 20 : 10,
                    }}
                    onMouseEnter={() => setHoveredBin(bin.id)}
                    onMouseLeave={() => setHoveredBin(null)}
                    onClick={() => setSelectedBin(bin)}
                  >
                    <div
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        isHovered || isSelected
                          ? 'scale-125 shadow-lg'
                          : ''
                      }`}
                      style={{
                        backgroundColor: '#111827',
                        borderColor: color,
                        boxShadow: isHovered || isSelected ? `0 0 16px ${color}60` : 'none',
                      }}
                    >
                      <span className="text-xs">{getBinTypeIcon(bin.type)}</span>
                      
                      {/* Fill indicator */}
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full overflow-hidden bg-[#2A3449]"
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bin.fillLevel}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hover Tooltip */}
                    {(isHovered || isSelected) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1A2233] border border-[#2A3449] rounded-lg whitespace-nowrap z-30">
                        <div className="text-xs font-medium text-[#F2F5F9]">{bin.name}</div>
                        <div className="text-[10px] mono text-[#A9B3C2] mt-1">
                          Fill: <span style={{ color }}>{bin.fillLevel}%</span>
                        </div>
                        <div className="text-[10px] mono text-[#A9B3C2]">
                          Next: {new Date(bin.predictedFillTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Map Stats */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F2F5F9]">{bins.length}</div>
                  <div className="text-[10px] mono text-[#A9B3C2]">TOTAL BINS</div>
                </div>
                <div className="w-px h-8 bg-[#2A3449]" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#27C59A]">{bins.filter(b => b.status === 'healthy').length}</div>
                  <div className="text-[10px] mono text-[#A9B3C2]">HEALTHY</div>
                </div>
                <div className="w-px h-8 bg-[#2A3449]" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF4D6D]">{criticalBins}</div>
                  <div className="text-[10px] mono text-[#A9B3C2]">CRITICAL</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-[#A9B3C2]">
                <Info className="w-4 h-4" />
                <span>Click bins for details</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            {/* Fill Level Trend */}
            <div className="info-card glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F2F5F9]">Fill Level Trend</h3>
                    <p className="text-xs text-[#A9B3C2]">24-hour average</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#27C59A]">+4.2%</div>
                  <div className="text-[10px] mono text-[#A9B3C2]">vs last week</div>
                </div>
              </div>
              <Sparkline data={trendData} width={280} height={60} color="#00F0FF" />
            </div>

            {/* Next Predicted Pickup */}
            <div className="info-card glass-panel rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Next Predicted Pickup</h3>
                  <p className="text-xs text-[#A9B3C2]">AI-optimized schedule</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#111827] rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[#F2F5F9]">Zone C - Canteen Area</div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-[#A9B3C2]" />
                    <span className="text-xs text-[#A9B3C2]">4 bins ready</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#F59E0B]">14:30</div>
                  <div className="text-[10px] mono text-[#A9B3C2]">in 45 min</div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="info-card glass-panel rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Active Alerts</h3>
                  <p className="text-xs text-[#A9B3C2]">Requiring attention</p>
                </div>
              </div>
              <div className="space-y-3">
                {criticalBins > 0 && (
                  <div className="flex items-center justify-between p-3 bg-[#FF4D6D]/5 border border-[#FF4D6D]/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                      <span className="text-sm text-[#F2F5F9]">{criticalBins} bin{criticalBins > 1 ? 's' : ''} &gt;80% full</span>
                    </div>
                    <span className="text-xs mono text-[#FF4D6D]">CRITICAL</span>
                  </div>
                )}
                {warningBins > 0 && (
                  <div className="flex items-center justify-between p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-sm text-[#F2F5F9]">{warningBins} bin{warningBins > 1 ? 's' : ''} 50-80% full</span>
                    </div>
                    <span className="text-xs mono text-[#F59E0B]">WARNING</span>
                  </div>
                )}
                {criticalBins === 0 && warningBins === 0 && (
                  <div className="flex items-center justify-center p-4 bg-[#27C59A]/5 border border-[#27C59A]/20 rounded-lg">
                    <span className="text-sm text-[#27C59A]">All bins operating normally</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Bin Details */}
            {selectedBin && (
              <div className="info-card glass-panel rounded-xl p-5 border-[#00F0FF]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#F2F5F9]">{selectedBin.name}</h3>
                  <button
                    onClick={() => setSelectedBin(null)}
                    className="p-1 rounded hover:bg-[#232D42] transition-colors"
                  >
                    <span className="text-[#A9B3C2]">×</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9B3C2]">Fill Level</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: getBinColor(selectedBin.fillLevel) }}
                    >
                      {selectedBin.fillLevel}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9B3C2]">Type</span>
                    <span className="text-sm text-[#F2F5F9] capitalize">{selectedBin.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9B3C2]">Last Collection</span>
                    <span className="text-sm text-[#F2F5F9]">
                      {new Date(selectedBin.lastCollection).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9B3C2]">Predicted Full</span>
                    <span className="text-sm text-[#00F0FF]">
                      {new Date(selectedBin.predictedFillTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A9B3C2]">Battery</span>
                    <span className="text-sm text-[#F2F5F9]">{selectedBin.batteryLevel}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-[#A9B3C2] mb-2 block">24h History</span>
                  <Sparkline data={selectedBin.history} width={240} height={50} color="#00F0FF" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
