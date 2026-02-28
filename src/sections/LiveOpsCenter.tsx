import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RadialGauge } from '@/components/charts/RadialGauge';
import { useCampusStore } from '@/store/campusStore';
import { Trash2, Droplets, Shield, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LiveOpsCenter() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { campusVitals } = useCampusStore();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        content.querySelectorAll('.gauge-item'),
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelectorAll('.metric-card'),
        { opacity: 0, y: 30 },
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
        content.querySelector('.section-header'),
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="live"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-12 md:mb-16">
          <h2 className="section-title mb-3">Live Ops Center</h2>
          <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl mx-auto">
            Real-time campus intelligence powered by Danger Rider edge-to-cloud architecture
          </p>
        </div>

        {/* Radial Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Waste Health Gauge */}
          <div className="gauge-item flex flex-col items-center">
            <div className="relative">
              <RadialGauge
                value={campusVitals.wasteHealth}
                label="Waste Health"
                color="#00F0FF"
                size={220}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2233] border border-[#2A3449]">
                <Trash2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-xs mono text-[#A9B3C2]">24 Bins</span>
              </div>
            </div>
          </div>

          {/* Water Health Gauge */}
          <div className="gauge-item flex flex-col items-center">
            <div className="relative">
              <RadialGauge
                value={campusVitals.waterHealth}
                label="Water Health"
                color="#27C59A"
                size={220}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2233] border border-[#2A3449]">
                <Droplets className="w-3.5 h-3.5 text-[#27C59A]" />
                <span className="text-xs mono text-[#A9B3C2]">STP Active</span>
              </div>
            </div>
          </div>

          {/* Safety Score Gauge */}
          <div className="gauge-item flex flex-col items-center">
            <div className="relative">
              <RadialGauge
                value={campusVitals.safetyScore}
                label="Safety Score"
                color="#F59E0B"
                size={220}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2233] border border-[#2A3449]">
                <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="text-xs mono text-[#A9B3C2]">All Clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="metric-card glass-panel p-4 md:p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <span className="data-label">Bins Monitored</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#F2F5F9]">
              {campusVitals.binsMonitored}
            </div>
            <div className="mt-2 text-xs text-[#27C59A] flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Real-time</span>
            </div>
          </div>

          <div className="metric-card glass-panel p-4 md:p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#27C59A]/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#27C59A]" />
              </div>
              <span className="data-label">STP Sensors</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#F2F5F9]">
              {campusVitals.stpSensors}
            </div>
            <div className="mt-2 text-xs text-[#27C59A] flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Online</span>
            </div>
          </div>

          <div className="metric-card glass-panel p-4 md:p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <span className="data-label">Avg Response</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#F2F5F9]">
              {campusVitals.avgResponse.toFixed(1)}s
            </div>
            <div className="mt-2 text-xs text-[#27C59A] flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Optimal</span>
            </div>
          </div>

          <div className="metric-card glass-panel p-4 md:p-6 card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00F0FF]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <span className="data-label">Edge Latency</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#00F0FF]">
              {campusVitals.edgeLatency}
              <span className="text-lg text-[#A9B3C2] ml-1">ms</span>
            </div>
            <div className="mt-2 text-xs text-[#00F0FF] flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Danger Rider Processing</span>
            </div>
          </div>
        </div>

        {/* Danger Rider Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1A2233] border border-[#2A3449]">
            <span className="text-xs mono text-[#A9B3C2]">Powered by</span>
            <span className="text-sm font-bold text-[#00F0FF]">Danger Rider</span>
            <span className="text-xs mono text-[#A9B3C2]">Edge-to-Cloud Architecture</span>
          </div>
        </div>
      </div>
    </section>
  );
}
