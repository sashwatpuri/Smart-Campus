import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCampusStore } from '@/store/campusStore';
import { CircularProgress } from '@/components/charts/CircularProgress';
import { Sparkline } from '@/components/charts/Sparkline';
import { Download, TrendingUp, TrendingDown, Minus, Award, Droplets, Leaf, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SustainabilityScore() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { sustainabilityMetrics } = useCampusStore();

  // Mock trend data
  const trendData = [72, 75, 73, 78, 80, 82, 84];

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelector('.main-score'),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
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
        content.querySelectorAll('.breakdown-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
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
    }, section);

    return () => ctx.revert();
  }, []);

  const getTrendIcon = (value: number, target: number) => {
    if (value >= target) return <TrendingUp className="w-4 h-4 text-[#27C59A]" />;
    if (value >= target * 0.8) return <Minus className="w-4 h-4 text-[#F59E0B]" />;
    return <TrendingDown className="w-4 h-4 text-[#FF4D6D]" />;
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting sustainability report... (PDF generation would be implemented here)');
  };

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="section-title mb-3">Sustainability Score</h2>
            <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
              Campus environmental impact metrics and circular economy performance
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-lg text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* Main Score & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-8 md:mb-12">
          {/* Main Circular Score */}
          <div className="main-score flex flex-col items-center">
            <CircularProgress
              value={sustainabilityMetrics.overallScore}
              maxValue={100}
              size={320}
              strokeWidth={20}
              color="#00F0FF"
              label="Sustainability Score"
              sublabel="Campus Living Lab"
              showTrend={true}
              trend="up"
            />
            
            {/* Trend Chart */}
            <div className="mt-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs mono text-[#A9B3C2]">7-DAY TREND</span>
                <span className="text-xs text-[#27C59A]">+12% this month</span>
              </div>
              <Sparkline data={trendData} width={320} height={50} color="#00F0FF" />
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Circular Economy */}
            <div className="breakdown-card glass-panel rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Circular Economy</h3>
                  <p className="text-xs text-[#A9B3C2]">Waste diversion rate</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#00F0FF]">
                    {sustainabilityMetrics.circularEconomy}%
                  </div>
                  <div className="text-xs text-[#A9B3C2] mt-1">
                    Target: <span className="text-[#27C59A]">85%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#27C59A]/10">
                  {getTrendIcon(sustainabilityMetrics.circularEconomy, 85)}
                  <span className="text-xs text-[#27C59A]">On track</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-[#2A3449] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#27C59A]"
                  style={{ width: `${sustainabilityMetrics.circularEconomy}%` }}
                />
              </div>
            </div>

            {/* Water Autonomy */}
            <div className="breakdown-card glass-panel rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#27C59A]/10 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-[#27C59A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Water Autonomy</h3>
                  <p className="text-xs text-[#A9B3C2]">Recycled water usage</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#27C59A]">
                    {sustainabilityMetrics.waterAutonomy}%
                  </div>
                  <div className="text-xs text-[#A9B3C2] mt-1">
                    Target: <span className="text-[#27C59A]">40%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#F59E0B]/10">
                  {getTrendIcon(sustainabilityMetrics.waterAutonomy, 40)}
                  <span className="text-xs text-[#F59E0B]">+53%</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-[#2A3449] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#27C59A] to-[#00F0FF]"
                  style={{ width: `${(sustainabilityMetrics.waterAutonomy / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Carbon Avoidance */}
            <div className="breakdown-card glass-panel rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Carbon Avoidance</h3>
                  <p className="text-xs text-[#A9B3C2]">CO₂e saved this month</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#F59E0B]">
                    {sustainabilityMetrics.carbonAvoidance}
                  </div>
                  <div className="text-xs text-[#A9B3C2] mt-1">tonnes CO₂e</div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#27C59A]/10">
                  <TrendingUp className="w-4 h-4 text-[#27C59A]" />
                  <span className="text-xs text-[#27C59A]">+8%</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#2A3449] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FF4D6D]"
                    style={{ width: '65%' }}
                  />
                </div>
                <span className="text-xs mono text-[#A9B3C2]">65%</span>
              </div>
            </div>

            {/* Behavioral Engagement */}
            <div className="breakdown-card glass-panel rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F2F5F9]">Engagement</h3>
                  <p className="text-xs text-[#A9B3C2]">Student participation</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-[#FF4D6D]">
                    {sustainabilityMetrics.engagementRate}%
                  </div>
                  <div className="text-xs text-[#A9B3C2] mt-1">Active participants</div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#27C59A]/10">
                  <TrendingUp className="w-4 h-4 text-[#27C59A]" />
                  <span className="text-xs text-[#27C59A]">+5%</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-[#2A3449] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#F59E0B]"
                  style={{ width: `${sustainabilityMetrics.engagementRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hostel Leaderboard */}
        <div className="glass-panel rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-semibold text-[#F2F5F9]">Hostel Leaderboard</h3>
            <span className="text-xs text-[#A9B3C2]">Top performers this month</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sustainabilityMetrics.hostelLeaderboard.map((hostel, index) => (
              <div
                key={hostel.name}
                className={`relative p-4 rounded-lg border ${
                  index === 0
                    ? 'bg-[#00F0FF]/5 border-[#00F0FF]/30'
                    : index === 1
                    ? 'bg-[#27C59A]/5 border-[#27C59A]/20'
                    : 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
                }`}
              >
                {/* Rank Badge */}
                <div
                  className={`absolute -top-3 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? 'bg-[#00F0FF] text-[#0B0F17]'
                      : index === 1
                      ? 'bg-[#27C59A] text-[#0B0F17]'
                      : 'bg-[#F59E0B] text-[#0B0F17]'
                  }`}
                >
                  #{hostel.rank}
                </div>

                <div className="pt-2">
                  <div className="text-lg font-bold text-[#F2F5F9]">{hostel.name}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <div className="text-xs mono text-[#A9B3C2]">SCORE</div>
                      <div
                        className={`text-xl font-bold ${
                          index === 0
                            ? 'text-[#00F0FF]'
                            : index === 1
                            ? 'text-[#27C59A]'
                            : 'text-[#F59E0B]'
                        }`}
                      >
                        {hostel.score}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs mono text-[#A9B3C2]">PARTICIPATION</div>
                      <div className="text-lg font-bold text-[#F2F5F9]">{hostel.participation}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
