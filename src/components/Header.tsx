import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { useCampusStore } from '@/store/campusStore';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { campusVitals, activeSection, setActiveSection } = useCampusStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'live', label: 'Live' },
    { id: 'bins', label: 'Bins' },
    { id: 'water', label: 'Water' },
    { id: 'twin', label: 'Twin' },
    { id: 'predict', label: 'Predict' },
    { id: 'impact', label: 'Impact' },
    { id: 'admin', label: 'Admin' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F17]/90 backdrop-blur-lg border-b border-[#2A3449]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#00F0FF]" />
            <span className="font-bold tracking-wider text-sm md:text-base text-[#F2F5F9]">
              CAMPUS <span className="text-[#00F0FF]">PULSE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                    : 'text-[#A9B3C2] hover:text-[#F2F5F9] hover:bg-[#1A2233]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Status & Edge Latency */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A2233] border border-[#2A3449]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#27C59A] animate-pulse" />
              <span className="text-xs mono text-[#A9B3C2]">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A2233] border border-[#2A3449]">
              <span className="text-xs mono text-[#00F0FF]">
                {campusVitals.edgeLatency}ms
              </span>
              <span className="text-[10px] mono text-[#A9B3C2]">EDGE</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#1A2233] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#F2F5F9]" />
            ) : (
              <Menu className="w-5 h-5 text-[#F2F5F9]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[#2A3449]">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                      : 'text-[#A9B3C2] hover:text-[#F2F5F9] hover:bg-[#1A2233]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Status */}
            <div className="mt-4 pt-4 border-t border-[#2A3449] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#27C59A] animate-pulse" />
                <span className="text-xs mono text-[#A9B3C2]">SYSTEM ONLINE</span>
              </div>
              <span className="text-xs mono text-[#00F0FF]">{campusVitals.edgeLatency}ms EDGE</span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
