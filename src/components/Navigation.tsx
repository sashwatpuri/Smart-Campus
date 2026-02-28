import { 
  Activity, 
  Trash2, 
  Droplets, 
  Box, 
  TrendingUp, 
  Leaf, 
  Settings 
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const navItems = [
    { id: 'live', label: 'Live Ops', icon: Activity },
    { id: 'bins', label: 'Smart Bins', icon: Trash2 },
    { id: 'water', label: 'STP Command', icon: Droplets },
    { id: 'twin', label: 'Digital Twin', icon: Box },
    { id: 'predict', label: 'Predictions', icon: TrendingUp },
    { id: 'impact', label: 'Sustainability', icon: Leaf },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-20 bg-[#0B0F17]/95 backdrop-blur-lg border-r border-[#2A3449] z-40 hidden lg:flex flex-col items-center py-6">
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/50'
                  : 'hover:bg-[#1A2233] border border-transparent'
              }`}
              title={item.label}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-[#00F0FF]' : 'text-[#A9B3C2] group-hover:text-[#F2F5F9]'
                }`}
              />
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#00F0FF] rounded-l" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1A2233] border border-[#2A3449] rounded-lg text-xs font-medium text-[#F2F5F9] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1A2233] border-l border-b border-[#2A3449] rotate-45" />
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Bottom Section - Danger Rider Badge */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-8 h-px bg-[#2A3449]" />
        <div className="text-[10px] mono text-[#A9B3C2] text-center leading-tight">
          <span className="text-[#00F0FF]">DANGER</span>
          <br />
          RIDER
        </div>
      </div>
    </aside>
  );
}
