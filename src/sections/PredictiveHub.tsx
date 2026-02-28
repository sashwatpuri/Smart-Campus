import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { TrendingUp, Route, Droplets, Wrench, ChevronDown, ChevronUp, AlertTriangle, Brain, Calendar } from 'lucide-react';
import { generateTimeSeriesData } from '@/lib/mockData';

gsap.registerPlugin(ScrollTrigger);

export function PredictiveHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

  // Generate mock chart data
  const wasteData = generateTimeSeriesData(12, 250, 50).map((d, i) => ({
    ...d,
    label: `${i * 2}:00`,
    predicted: d.predicted ? d.predicted + 20 : undefined,
  }));

  const waterData = generateTimeSeriesData(24, 150, 30);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.forecast-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelector('.transparency-panel'),
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

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'waste':
        return '#00F0FF';
      case 'route':
        return '#27C59A';
      case 'water':
        return '#F59E0B';
      case 'maintenance':
        return '#FF4D6D';
      default:
        return '#00F0FF';
    }
  };

  return (
    <section
      id="predict"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="section-title mb-3">Predictive Hub</h2>
          <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
            AI-powered forecasting for demand, risk, and maintenance windows
          </p>
        </div>

        {/* Forecast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Waste Generation Forecast */}
          <div className="forecast-card glass-panel rounded-xl p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getPredictionColor('waste')}15` }}
                >
                  <TrendingUp
                    className="w-5 h-5"
                    style={{ color: getPredictionColor('waste') }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Waste Generation (24h)</h3>
                  <p className="text-xs text-[#A9B3C2]">Predicted with 87% confidence</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#00F0FF]">340</div>
                <div className="text-[10px] mono text-[#A9B3C2]">kg peak</div>
              </div>
            </div>

            <BarChart
              data={wasteData.map(d => ({
                label: d.label,
                value: d.value,
                predicted: d.predicted,
              }))}
              width={350}
              height={150}
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs mono text-[#A9B3C2]">PEAK TIME</div>
                  <div className="text-sm font-medium text-[#F2F5F9]">14:00</div>
                </div>
                <div className="w-px h-8 bg-[#2A3449]" />
                <div className="text-center">
                  <div className="text-xs mono text-[#A9B3C2]">CONFIDENCE</div>
                  <div className="text-sm font-medium text-[#27C59A]">87%</div>
                </div>
              </div>
              <button
                onClick={() => setExpandedPrediction(expandedPrediction === 'waste' ? null : 'waste')}
                className="flex items-center gap-1 text-xs text-[#00F0FF] hover:underline"
              >
                {expandedPrediction === 'waste' ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Why this prediction?
                  </>
                )}
              </button>
            </div>

            {expandedPrediction === 'waste' && (
              <div className="mt-4 p-4 bg-[#111827] rounded-lg border border-[#2A3449]">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[#00F0FF]" />
                  <span className="text-sm font-medium text-[#F2F5F9]">Model Features</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[#A9B3C2]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    Historical fill rate patterns (weight: 0.42)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#A9B3C2]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    Event schedule - Tech Fest Day 2 (weight: 0.31)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#A9B3C2]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    Day of week pattern - Tuesday (weight: 0.27)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Optimal Collection Routes */}
          <div className="forecast-card glass-panel rounded-xl p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getPredictionColor('route')}15` }}
                >
                  <Route
                    className="w-5 h-5"
                    style={{ color: getPredictionColor('route') }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Optimal Collection Routes</h3>
                  <p className="text-xs text-[#A9B3C2]">Route A optimized</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#27C59A]">23</div>
                <div className="text-[10px] mono text-[#A9B3C2]">min saved</div>
              </div>
            </div>

            {/* Route Visualization */}
            <div className="relative h-36 bg-[#111827] rounded-lg overflow-hidden mb-4">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120">
                {/* Route Path */}
                <path
                  d="M 30 60 Q 80 30, 130 60 T 230 60 T 270 40"
                  fill="none"
                  stroke="#2A3449"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 30 60 Q 80 30, 130 60 T 230 60 T 270 40"
                  fill="none"
                  stroke="#27C59A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
                {/* Waypoints */}
                <circle cx="30" cy="60" r="6" fill="#27C59A" />
                <circle cx="130" cy="60" r="6" fill="#27C59A" />
                <circle cx="230" cy="60" r="6" fill="#27C59A" />
                <circle cx="270" cy="40" r="8" fill="#00F0FF" />
                {/* Vehicle */}
                <circle cx="180" cy="55" r="5" fill="#F59E0B">
                  <animate
                    attributeName="cx"
                    values="30;130;230;270"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values="60;60;60;40"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#F2F5F9]">12</div>
                <div className="text-[10px] mono text-[#A9B3C2]">BINS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#F2F5F9]">3.2</div>
                <div className="text-[10px] mono text-[#A9B3C2]">KM</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#27C59A]">1.8L</div>
                <div className="text-[10px] mono text-[#A9B3C2]">FUEL SAVED</div>
              </div>
            </div>
          </div>

          {/* Water Demand Spike */}
          <div className="forecast-card glass-panel rounded-xl p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getPredictionColor('water')}15` }}
                >
                  <Droplets
                    className="w-5 h-5"
                    style={{ color: getPredictionColor('water') }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Water Demand Spike</h3>
                  <p className="text-xs text-[#A9B3C2]">Event calendar integration</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#F59E0B]">+28%</div>
                <div className="text-[10px] mono text-[#A9B3C2]">expected</div>
              </div>
            </div>

            <LineChart data={waterData} width={350} height={120} />

            <div className="mt-4 p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#F2F5F9]">Sports Event + Hostel Usage</span>
              </div>
              <p className="text-xs text-[#A9B3C2] mt-1">
                Tuesday 6-8 PM: Cricket match + regular hostel peak overlap
              </p>
            </div>
          </div>

          {/* STP Maintenance Window */}
          <div className="forecast-card glass-panel rounded-xl p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getPredictionColor('maintenance')}15` }}
                >
                  <Wrench
                    className="w-5 h-5"
                    style={{ color: getPredictionColor('maintenance') }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">STP Maintenance Window</h3>
                  <p className="text-xs text-[#A9B3C2]">Equipment health analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#FF4D6D]">73%</div>
                <div className="text-[10px] mono text-[#A9B3C2]">health score</div>
              </div>
            </div>

            {/* Equipment Health Bars */}
            <div className="space-y-3 mb-4">
              {[
                { name: 'Aerator Motor', health: 78 },
                { name: 'Filter Pump', health: 65 },
                { name: 'Clarifier Drive', health: 82 },
                { name: 'Control System', health: 91 },
              ].map((equipment) => (
                <div key={equipment.name} className="flex items-center gap-3">
                  <span className="text-xs text-[#A9B3C2] w-28">{equipment.name}</span>
                  <div className="flex-1 h-2 bg-[#2A3449] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${equipment.health}%`,
                        backgroundColor: equipment.health > 80 ? '#27C59A' : equipment.health > 60 ? '#F59E0B' : '#FF4D6D',
                      }}
                    />
                  </div>
                  <span className="text-xs mono text-[#F2F5F9] w-8 text-right">{equipment.health}%</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#111827] rounded-lg border border-[#2A3449]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs mono text-[#A9B3C2]">RECOMMENDED WINDOW</div>
                  <div className="text-sm font-medium text-[#F2F5F9]">Sunday 2:00 - 6:00 AM</div>
                </div>
                <div className="text-right">
                  <div className="text-xs mono text-[#A9B3C2]">DURATION</div>
                  <div className="text-sm font-medium text-[#00F0FF]">4 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Alert Preview */}
        <div className="transparency-panel glass-panel rounded-xl p-5 md:p-6 border border-[#F59E0B]/30 bg-[#F59E0B]/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Upcoming Alert Preview</h3>
                  <p className="text-sm text-[#A9B3C2]">High odor risk predicted based on current trends</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs mono text-[#A9B3C2]">WHEN</div>
                    <div className="text-sm font-medium text-[#F2F5F9]">Tuesday 2-4 PM</div>
                  </div>
                  <div className="w-px h-8 bg-[#2A3449]" />
                  <div className="text-right">
                    <div className="text-xs mono text-[#A9B3C2]">CONFIDENCE</div>
                    <div className="text-sm font-medium text-[#F59E0B]">87%</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#111827] text-xs text-[#A9B3C2]">
                  H₂S levels rising
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111827] text-xs text-[#A9B3C2]">
                  Low wind forecast
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111827] text-xs text-[#A9B3C2]">
                  High organic load
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
