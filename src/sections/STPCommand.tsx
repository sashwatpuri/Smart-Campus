import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCampusStore } from '@/store/campusStore';
import { Droplets, Wind, AlertTriangle, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STAGE_NAMES = ['INLET', 'SCREENING', 'AERATION', 'CLARIFIER', 'FILTER', 'OUTLET'];
const STAGE_ICONS = ['🌊', '🔍', '💨', '⚗️', '🔬', '✅'];

export function STPCommand() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { stpSensors, stpStages } = useCampusStore();
  const [showOdorRisk, setShowOdorRisk] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Flow line animation
      gsap.fromTo(
        content.querySelector('.flow-line'),
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );

      // Stage nodes animation
      gsap.fromTo(
        content.querySelectorAll('.stage-node'),
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Sensor cards animation
      gsap.fromTo(
        content.querySelectorAll('.sensor-card'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
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

  const getSensorValue = (type: string) => {
    const sensor = stpSensors.find(s => s.type === type);
    return sensor ? `${sensor.value} ${sensor.unit}` : '--';
  };

  const getSensorStatus = (type: string) => {
    const sensor = stpSensors.find(s => s.type === type);
    return sensor?.status || 'offline';
  };

  // Calculate odor risk score
  const h2sValue = stpSensors.find(s => s.id === 'SENS-GAS-01')?.value || 0;
  const nh3Value = stpSensors.find(s => s.id === 'SENS-GAS-02')?.value || 0;
  const odorRiskScore = Math.min(100, (h2sValue * 20 + nh3Value * 10));
  const isOdorRiskHigh = odorRiskScore > 50;

  return (
    <section
      id="water"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="section-title mb-3">STP Command</h2>
              <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
                Real-time sewage treatment plant monitoring with live sensor feeds
              </p>
            </div>
            
            {/* Odor Risk Toggle */}
            <button
              onClick={() => setShowOdorRisk(!showOdorRisk)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                showOdorRisk
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]/50 text-[#F59E0B]'
                  : 'bg-[#1A2233] border-[#2A3449] text-[#A9B3C2] hover:text-[#F2F5F9]'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span className="text-sm">Odor Risk</span>
              {isOdorRiskHigh && (
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
          {/* Treatment Stages */}
          <div className="relative">
            {/* Flow Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
              <svg className="w-full h-4" preserveAspectRatio="none">
                <line
                  x1="8%"
                  y1="50%"
                  x2="92%"
                  y2="50%"
                  stroke="#2A3449"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  className="flow-line"
                  x1="8%"
                  y1="50%"
                  x2="92%"
                  y2="50%"
                  stroke="#00F0FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="20 10"
                />
              </svg>
            </div>

            {/* Stage Nodes */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-2">
              {STAGE_NAMES.map((name, index) => {
                const stage = stpStages.find(s => s.order === index + 1);
                const isActive = stage?.isActive ?? true;
                
                return (
                  <div
                    key={name}
                    className={`stage-node relative flex flex-col items-center ${
                      index >= 3 ? 'md:mt-0 mt-4' : ''
                    }`}
                  >
                    {/* Node Circle */}
                    <div
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl border-2 transition-all ${
                        isActive
                          ? 'bg-[#1A2233] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                          : 'bg-[#111827] border-[#2A3449]'
                      }`}
                    >
                      {STAGE_ICONS[index]}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#27C59A] border-2 border-[#0B0F17]" />
                      )}
                    </div>
                    
                    {/* Stage Name */}
                    <div className="mt-3 text-center">
                      <div className="text-[10px] md:text-xs mono font-medium text-[#F2F5F9]">
                        {name}
                      </div>
                      {stage && (
                        <div className="text-[9px] md:text-[10px] mono text-[#A9B3C2] mt-1">
                          {stage.flowRate} m³/h
                        </div>
                      )}
                    </div>

                    {/* Arrow (mobile only) */}
                    {index < STAGE_NAMES.length - 1 && index % 3 !== 2 && (
                      <div className="md:hidden absolute -right-2 top-8 text-[#2A3449]">→</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sensor Readouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* pH Sensor */}
          <div className="sensor-card glass-panel rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-xs mono text-[#A9B3C2]">pH LEVEL</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-[#F2F5F9]">
              {getSensorValue('ph')}
            </div>
            <div className="mt-2 flex items-center gap-1">
              {getSensorStatus('ph') === 'online' ? (
                <>
                  <Check className="w-3 h-3 text-[#27C59A]" />
                  <span className="text-xs text-[#27C59A]">Normal</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                  <span className="text-xs text-[#F59E0B]">Check</span>
                </>
              )}
            </div>
          </div>

          {/* Turbidity */}
          <div className="sensor-card glass-panel rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-[#27C59A]" />
              <span className="text-xs mono text-[#A9B3C2]">TURBIDITY</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-[#F2F5F9]">
              {getSensorValue('turbidity')}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Check className="w-3 h-3 text-[#27C59A]" />
              <span className="text-xs text-[#27C59A]">Clear</span>
            </div>
          </div>

          {/* Dissolved Oxygen */}
          <div className="sensor-card glass-panel rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs mono text-[#A9B3C2]">DISSOLVED O₂</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-[#F2F5F9]">
              {getSensorValue('dissolved_oxygen')}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Check className="w-3 h-3 text-[#27C59A]" />
              <span className="text-xs text-[#27C59A]">Optimal</span>
            </div>
          </div>

          {/* Flow Rate */}
          <div className="sensor-card glass-panel rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-xs mono text-[#A9B3C2]">FLOW RATE</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-[#F2F5F9]">
              {getSensorValue('flow_rate')}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Check className="w-3 h-3 text-[#27C59A]" />
              <span className="text-xs text-[#27C59A]">Steady</span>
            </div>
          </div>
        </div>

        {/* Odor Risk Panel */}
        {showOdorRisk && (
          <div className={`glass-panel rounded-xl p-5 md:p-6 border ${
            isOdorRiskHigh ? 'border-[#FF4D6D]/30 bg-[#FF4D6D]/5' : 'border-[#27C59A]/30 bg-[#27C59A]/5'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isOdorRiskHigh ? 'bg-[#FF4D6D]/10' : 'bg-[#27C59A]/10'
                }`}>
                  <Wind className={`w-6 h-6 ${isOdorRiskHigh ? 'text-[#FF4D6D]' : 'text-[#27C59A]'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Odor Risk Assessment</h3>
                  <p className="text-xs text-[#A9B3C2]">Based on H₂S and NH₃ gas sensors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs mono text-[#A9B3C2] mb-1">H₂S</div>
                  <div className="text-lg font-bold text-[#F2F5F9]">{h2sValue} ppm</div>
                </div>
                <div className="text-center">
                  <div className="text-xs mono text-[#A9B3C2] mb-1">NH₃</div>
                  <div className="text-lg font-bold text-[#F2F5F9]">{nh3Value} ppm</div>
                </div>
                <div className="w-px h-10 bg-[#2A3449]" />
                <div className="text-center">
                  <div className="text-xs mono text-[#A9B3C2] mb-1">RISK SCORE</div>
                  <div className={`text-2xl font-bold ${isOdorRiskHigh ? 'text-[#FF4D6D]' : 'text-[#27C59A]'}`}>
                    {Math.round(odorRiskScore)}%
                  </div>
                </div>
              </div>
            </div>
            
            {isOdorRiskHigh && (
              <div className="mt-4 p-3 bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF4D6D]" />
                  <span className="text-sm text-[#FF4D6D]">
                    Elevated odor risk detected. Consider increasing aeration or scheduling maintenance.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
