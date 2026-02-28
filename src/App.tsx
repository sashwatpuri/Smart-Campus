import { useEffect } from 'react';
import { useCampusStore } from '@/store/campusStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { AlertPanel } from '@/components/AlertPanel';
import { LiveOpsCenter } from '@/sections/LiveOpsCenter';
import { SmartBinNetwork } from '@/sections/SmartBinNetwork';
import { STPCommand } from '@/sections/STPCommand';
import { DigitalTwin } from '@/sections/DigitalTwin';
import { PredictiveHub } from '@/sections/PredictiveHub';
import { SustainabilityScore } from '@/sections/SustainabilityScore';
import { AdminControl } from '@/sections/AdminControl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { activeSection, setActiveSection } = useCampusStore();
  useWebSocket();

  // Update active section based on scroll
  useEffect(() => {
    const sections = ['live', 'bins', 'water', 'twin', 'predict', 'impact', 'admin'];
    
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        ScrollTrigger.create({
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [setActiveSection]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F2F5F9] overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      
      {/* Radial Vignette */}
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none" />
      
      {/* Header */}
      <Header />
      
      {/* Navigation Rail */}
      <Navigation activeSection={activeSection} />
      
      {/* Alert Panel */}
      <AlertPanel />
      
      {/* Main Content */}
      <main className="relative z-10">
        <LiveOpsCenter />
        <SmartBinNetwork />
        <STPCommand />
        <DigitalTwin />
        <PredictiveHub />
        <SustainabilityScore />
        <AdminControl />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-[#2A3449] bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#00F0FF] font-bold tracking-wider">CAMPUS PULSE</span>
            <span className="text-[#A9B3C2] text-sm">Smart Campus Living Lab</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[#A9B3C2] text-xs mono">Powered by Danger Rider</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#27C59A] animate-pulse" />
              <span className="text-[#27C59A] text-xs mono">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
