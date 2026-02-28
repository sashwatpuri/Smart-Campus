# Campus Pulse - Smart Campus Living Lab Dashboard

![Campus Pulse Dashboard](https://img.shields.io/badge/AMD-Slingshot%20Hackathon-ED1C24)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000)

> **"The campus, seen in real time."**

Campus Pulse is an AI-powered circular resource intelligence system for university campuses, treating them as living laboratories for scalable smart city solutions. Built for the AMD Slingshot Hackathon, this dashboard demonstrates edge-to-cloud architecture with real-time monitoring, predictive analytics, and 3D digital twin visualization.

## 🚀 Features

### 1. Live Ops Center
- **Campus Vitals**: Three radial gauges showing Waste Health, Water Health, and Safety Score
- **Real-time Metrics**: Bins monitored, STP sensors, average response time, edge latency
- **AMD Edge Processing**: Live latency display showing "Data processed in Xms on AMD Kria"

### 2. Smart Bin Network
- **Interactive Campus Map**: 25+ smart bin markers with color-coded fill levels
- **Hover Details**: Bin ID, fill percentage, last collection, AI-predicted fill time
- **Click for History**: 24-hour fill history sparkline for each bin
- **Status Legend**: Green (<50%), Amber (50-80%), Red (>80%)

### 3. STP Command
- **Treatment Flow Diagram**: 6-stage sewage treatment process visualization
- **Live Sensor Values**: pH, turbidity, dissolved oxygen, flow rate
- **Animated Flow Lines**: Speed indicates flow volume
- **Odor Risk Toggle**: H₂S/NH₃ gas sensor monitoring with risk scoring

### 4. Resource Flow Digital Twin
- **3D Canvas**: Abstract campus model with Three.js
- **Particle Systems**: 
  - Waste stream (cyan): bins → collection → segregation → compost/recycling
  - Water cycle (green): buildings → STP → treatment → irrigation
  - Energy flow (amber): Power distribution visualization
- **Time Controls**: Play/pause, speed multiplier (1x to 10x)
- **Layer Toggles**: Show/hide individual flow types

### 5. Predictive Hub
- **Forecast Cards**:
  - Waste generation next 24h with confidence intervals
  - Optimal collection routes with time savings
  - Water demand spike predictions
  - STP maintenance window recommendations
- **Model Transparency**: "Why this prediction?" with top 3 input features
- **Alert Preview**: Upcoming high odor risk warnings

### 6. Sustainability Score
- **Main Score**: Large circular progress (0-100) with trend arrow
- **Breakdown Grid**:
  - Circular Economy: % waste diverted (target: 85%)
  - Water Autonomy: % demand from recycling (target: 40%)
  - Carbon Avoidance: CO₂e saved this month
  - Behavioral Engagement: Participation rate + hostel leaderboard
- **Export Button**: Generate PDF report with all metrics

### 7. Admin Control
- **Sensor Registry**: Table with status, last ping, battery, calibration date
- **Alert Rules**: Configurable thresholds for bin fill levels and sensor ranges
- **Simulation Mode**: "What-if" scenario runner for festivals, exams, holidays

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui |
| **State Management** | Zustand |
| **Data Fetching** | React Query |
| **3D Graphics** | React Three Fiber + Three.js |
| **Charts** | D3.js (custom components) |
| **Animations** | GSAP + ScrollTrigger |
| **Icons** | Lucide React |

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/           # D3 chart components
│   │   ├── RadialGauge.tsx
│   │   ├── Sparkline.tsx
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   └── CircularProgress.tsx
│   ├── Header.tsx        # Top navigation bar
│   ├── Navigation.tsx    # Side navigation rail
│   └── AlertPanel.tsx    # Alert notifications panel
├── sections/             # Main dashboard sections
│   ├── LiveOpsCenter.tsx
│   ├── SmartBinNetwork.tsx
│   ├── STPCommand.tsx
│   ├── DigitalTwin.tsx
│   ├── PredictiveHub.tsx
│   ├── SustainabilityScore.tsx
│   └── AdminControl.tsx
├── store/
│   └── campusStore.ts    # Zustand global state
├── hooks/
│   └── useWebSocket.ts   # Real-time data simulation
├── lib/
│   └── mockData.ts       # Data generators
├── types/
│   └── index.ts          # TypeScript type definitions
└── App.tsx               # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🏗️ Architecture Decisions

### 1. State Management with Zustand
- **Why**: Lightweight, TypeScript-friendly, minimal boilerplate
- **Usage**: Global state for bins, sensors, alerts, predictions
- **Persistence**: Alert thresholds and UI preferences saved to localStorage

### 2. Real-time Data Simulation
- **WebSocket Mock**: 2-second update intervals simulating edge device data
- **Random Variations**: Realistic sensor fluctuations with diurnal patterns
- **Alert Generation**: Automatic critical alerts when thresholds exceeded

### 3. D3 for Custom Charts
- **Why**: Full control over styling, animations, and performance
- **Approach**: SVG-based components with GSAP integration
- **Responsive**: Charts adapt to container size

### 4. Three.js for Digital Twin
- **Why**: Hardware-accelerated 3D graphics in browser
- **Optimization**: InstancedMesh for particle systems (150+ particles)
- **Interactivity**: OrbitControls for camera manipulation

### 5. GSAP ScrollTrigger
- **Why**: Smooth scroll-driven animations with pinning
- **Implementation**: Section-by-section reveal animations
- **Performance**: GPU-accelerated transforms only

## 🔧 AMD Integration Points

### Edge Processing Emphasis
```typescript
// Live edge latency display
<div className="text-[#00F0FF]">
  {campusVitals.edgeLatency}ms
  <span className="text-[10px]">AMD Kria Processing</span>
</div>
```

### Performance Optimizations
1. **Instanced Rendering**: Particle systems use Three.js InstancedMesh
2. **Request Animation Frame**: All animations use RAF for 60fps
3. **Transform-only Animations**: No layout thrashing
4. **Lazy Loading**: Sections load as they enter viewport

### Scalable Architecture
- **Modular Sections**: Each module is self-contained
- **Plugin-based Charts**: Easy to add new visualization types
- **Configurable Thresholds**: Alert rules customizable per deployment

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--cp-bg-primary` | `#0B0F17` | Main background |
| `--cp-accent` | `#00F0FF` | Primary accent (cyan) |
| `--cp-success` | `#27C59A` | Healthy status |
| `--cp-warning` | `#F59E0B` | Warning status |
| `--cp-danger` | `#FF4D6D` | Critical status |

### Typography
- **Headings**: Space Grotesk (600-700 weight)
- **Body**: Inter (400-500 weight)
- **Data/Labels**: IBM Plex Mono (500 weight)

### Spacing
- Section padding: `py-20 px-4 md:px-6 lg:pl-28`
- Card padding: `p-5` or `p-6`
- Grid gaps: `gap-4 md:gap-6`

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked gauges |
| Tablet | 640-1024px | 2-column grids |
| Desktop | 1024-1440px | Full layout with side nav |
| Large | > 1440px | Max-width containers |

## 🔮 Future Enhancements

1. **Real Backend Integration**
   - MQTT broker for IoT device communication
   - TimescaleDB for time-series data storage
   - WebSocket server for live updates

2. **Advanced Predictions**
   - Machine learning model integration
   - Weather API correlation
   - Event calendar API integration

3. **Mobile App**
   - React Native companion app
   - Push notifications for alerts
   - QR code scanning for bin reporting

4. **PWA Features**
   - Service worker for offline mode
   - Background sync for alerts
   - Home screen installation

## 👥 Team

Built for the **AMD Slingshot Hackathon** - Smart Campus Living Lab challenge.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- AMD for the hackathon opportunity
- shadcn/ui for the component library
- Three.js community for 3D graphics examples
- GSAP team for animation tools

---

**Campus Pulse** - Transforming campuses into smart city prototypes, one sensor at a time.
#   S m a r t - C a m p u s  
 