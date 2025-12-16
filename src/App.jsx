import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, ScatterChart, Scatter, ZAxis, Cell 
} from 'recharts';
import { 
  LayoutDashboard, TrendingUp, Trash2, Utensils, Users, Settings, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar, Filter, 
  Download, Search, Info, ChefHat, DollarSign, Truck, PieChart,
  UserCheck, ClipboardX, Clock, QrCode, Cpu, Lightbulb, Coffee, Croissant, Target, Package, Scale
} from 'lucide-react';

// --- MOCK DATA GENERATION ---

// 1. Executive Overview Data
const kpiData = [
  { title: 'Total Forecast', value: '14,250', unit: 'Items', trend: '+5.2%', status: 'good' },
  { title: 'COGS vs Revenue', value: '42.1%', unit: '% (High)', trend: '+3.5%', status: 'warning' }, 
  { title: 'QR Order Adoption', value: '45%', unit: '% of Trans', trend: '+12%', status: 'good' }, 
  { title: 'Peak Hour Traffic', value: '18:00', unit: 'Avg Peak', trend: 'Stable', status: 'neutral' }, 
];

// 2. Forecast Data
const forecastData = [
  { day: 'Mon', actual: 1200, forecast: 1250, lower: 1100, upper: 1400, event: '' },
  { day: 'Tue', actual: 1350, forecast: 1300, lower: 1150, upper: 1450, event: '' },
  { day: 'Wed', actual: 1400, forecast: 1380, lower: 1200, upper: 1550, event: 'Promo' },
  { day: 'Thu', actual: null, forecast: 1450, lower: 1300, upper: 1600, event: '' },
  { day: 'Fri', actual: null, forecast: 1800, lower: 1600, upper: 2000, event: 'Payday' },
  { day: 'Sat', actual: null, forecast: 2200, lower: 1900, upper: 2500, event: 'Weekend' },
  { day: 'Sun', actual: null, forecast: 2100, lower: 1850, upper: 2350, event: 'Weekend' },
];

const channelSplitData = [
  { name: 'Mon', DineIn: 400, Delivery: 600, CloudKitchen: 200 },
  { name: 'Tue', DineIn: 450, Delivery: 650, CloudKitchen: 250 },
  { name: 'Wed', DineIn: 500, Delivery: 700, CloudKitchen: 200 },
  { name: 'Thu', DineIn: 480, Delivery: 720, CloudKitchen: 250 },
  { name: 'Fri', DineIn: 600, Delivery: 900, CloudKitchen: 300 },
  { name: 'Sat', DineIn: 900, Delivery: 1100, CloudKitchen: 400 },
  { name: 'Sun', DineIn: 850, Delivery: 1050, CloudKitchen: 350 },
];

// 3. Inventory & Waste Data
const wasteDetailedData = [
  { id: 1, name: 'Matcha Croissant', category: 'Pastry', produced: 150, sold: 138, wasted: 12, sellThrough: 92.0 },
  { id: 2, name: 'Hojicha Puff', category: 'Pastry', produced: 100, sold: 95, wasted: 5, sellThrough: 95.0 },
  { id: 3, name: 'Strawberry Daifuku', category: 'Seasonal', produced: 80, sold: 45, wasted: 35, sellThrough: 56.2 },
  { id: 4, name: 'Mille Crepe', category: 'Pastry', produced: 60, sold: 48, wasted: 12, sellThrough: 80.0 },
  { id: 5, name: 'Sakura Tea Latte', category: 'Seasonal', produced: 200, sold: 180, wasted: 20, sellThrough: 90.0 },
];

const wasteChartData = wasteDetailedData.map(item => ({
  name: item.name,
  sold: item.sold,
  wasted: item.wasted
}));

// Helper to determine status based on business rules
const getSellThroughStatus = (pct) => {
  if (pct >= 90) return 'Optimal';
  if (pct >= 75) return 'Warning';
  return 'Critical';
};

// 4. Menu Engineering Data
const menuMatrixData = [
  { name: 'Signature Matcha Latte', x: 95, y: 80, z: 500, category: 'Star' }, 
  { name: 'Matcha Ice Cream', x: 90, y: 40, z: 450, category: 'Plowhorse' }, 
  { name: 'Hojicha Latte', x: 40, y: 75, z: 200, category: 'Puzzle' }, 
  { name: 'Seasonal Sakura Tea', x: 20, y: 30, z: 100, category: 'Dog' }, 
  { name: 'Matcha Croissant', x: 70, y: 65, z: 300, category: 'Star' },
  { name: 'Matcha Mille Crepe', x: 85, y: 55, z: 350, category: 'Star' }, 
  { name: 'Strawberry Daifuku', x: 30, y: 40, z: 120, category: 'Dog' }, 
  { name: 'Hojicha Puff', x: 60, y: 30, z: 150, category: 'Puzzle' },
];

// Pareto Data
const paretoData = [
  { name: 'Sig. Matcha Latte', revenue: 50000000, cumulativePercentage: 35 },
  { name: 'Matcha Ice Cream', revenue: 40000000, cumulativePercentage: 63 },
  { name: 'Matcha Croissant', revenue: 20000000, cumulativePercentage: 77 },
  { name: 'Mille Crepe', revenue: 15000000, cumulativePercentage: 88 }, 
  { name: 'Hojicha Latte', revenue: 8000000, cumulativePercentage: 93 },
  { name: 'Strawberry Daifuku', revenue: 5000000, cumulativePercentage: 97 }, 
  { name: 'Sakura Tea', revenue: 4000000, cumulativePercentage: 100 },
];

// 5. Operations Data
const techImpactData = [
  { metric: 'Prep Time (sec)', manual: 180, machine: 90, improvement: '50% Faster' },
  { metric: 'Error Rate (%)', manual: 4.5, machine: 0.8, improvement: '82% Less Errors' },
  { metric: 'Staff Training (Days)', manual: 14, machine: 3, improvement: 'Faster Onboarding' },
];

const errorSourceData = [
  { source: 'Cashier Input (Manual)', count: 45 },
  { source: 'QR Ordering (User)', count: 5 }, 
  { source: 'Kitchen Prep (Human)', count: 12 },
  { source: 'Machine Calibration', count: 2 }, 
];

const hourlyTrafficData = [
  { time: '10:00', Kemang: 45, PIK: 30, Bintaro: 25 },
  { time: '11:00', Kemang: 60, PIK: 45, Bintaro: 35 },
  { time: '12:00', Kemang: 120, PIK: 90, Bintaro: 80 }, // Lunch Peak
  { time: '13:00', Kemang: 100, PIK: 85, Bintaro: 70 },
  { time: '14:00', Kemang: 50, PIK: 40, Bintaro: 30 },
  { time: '15:00', Kemang: 55, PIK: 45, Bintaro: 35 },
  { time: '16:00', Kemang: 70, PIK: 60, Bintaro: 50 },
  { time: '17:00', Kemang: 90, PIK: 80, Bintaro: 60 },
  { time: '18:00', Kemang: 110, PIK: 120, Bintaro: 90 }, // Dinner/After work Peak
  { time: '19:00', Kemang: 95, PIK: 110, Bintaro: 85 },
  { time: '20:00', Kemang: 70, PIK: 80, Bintaro: 60 },
  { time: '21:00', Kemang: 40, PIK: 50, Bintaro: 30 },
];

// 6. Inventory Data
const inventoryData = [
    { id: 1, item: 'Ceremonial Matcha', unit: 'kg', current: 4.2, min: 2.0, max: 5.0, consumption: 0.5, status: 'Optimal' },
    { id: 2, item: 'Fresh Milk', unit: 'L', current: 12, min: 20, max: 40, consumption: 15, status: 'Low Stock' },
    { id: 3, item: 'Hojicha Powder', unit: 'kg', current: 3.5, min: 1.0, max: 3.0, consumption: 0.2, status: 'Overstock' },
    { id: 4, item: 'Pastry Flour', unit: 'kg', current: 15, min: 10, max: 25, consumption: 3, status: 'Optimal' },
    { id: 5, item: 'Red Bean Paste', unit: 'kg', current: 2.1, min: 2.0, max: 6.0, consumption: 0.4, status: 'Warning' },
];

// 7. Alerts
const alerts = [
  { id: 1, type: 'critical', msg: 'Strawberry Daifuku Waste > 35%' },
  { id: 2, type: 'info', msg: 'Cuzen Machine Maintenance Scheduled' },
  { id: 3, type: 'critical', msg: 'QR Adoption at PIK Avenue < 20%' },
];

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 w-full ${className}`}>
    {children}
  </div>
);

const Badge = ({ status, text }) => {
  const colors = {
    good: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    critical: 'bg-rose-100 text-rose-800',
    neutral: 'bg-slate-100 text-slate-800',
    info: 'bg-blue-100 text-blue-800',
    optimal: 'bg-emerald-100 text-emerald-800',
    'low stock': 'bg-rose-100 text-rose-800',
    'overstock': 'bg-purple-100 text-purple-800'
  };
  const statusLower = status.toLowerCase();
  const colorClass = colors[statusLower] || colors.neutral;
  
  return <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>{text}</span>;
};

// --- MAIN APP COMPONENT ---

const FeelMatchaDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOutlet, setSelectedOutlet] = useState('All Network');
  
  // Date State
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split('T')[0]);

  const dateInfo = useMemo(() => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    
    if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        return { rangeStr: '-', endStr: '-', endStrShort: '-' }; 
    }

    const startStr = sDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const endStr = eDate.toLocaleDateString('en-US', dateOptions);
    const endStrShort = eDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const rangeStr = `${startStr} - ${endStr}`;

    return { rangeStr, endStr, endStrShort };
  }, [startDate, endDate]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory & Par', icon: ChefHat },
    { id: 'waste', label: 'Waste Control', icon: Trash2 },
    { id: 'menu', label: 'Menu Engineering', icon: Utensils },
    { id: 'ops', label: 'Tech & Ops Impact', icon: Cpu },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewView dateInfo={dateInfo} />;
      case 'forecast': return <ForecastView dateInfo={dateInfo} />;
      case 'inventory': return <InventoryView dateInfo={dateInfo} />;
      case 'waste': return <WasteView dateInfo={dateInfo} />;
      case 'menu': return <MenuAnalysisView dateInfo={dateInfo} />;
      case 'ops': return <OperationsView dateInfo={dateInfo} />;
      default: return <OverviewView dateInfo={dateInfo} />;
    }
  };

  // --- SUB-VIEWS ---

  const OverviewView = ({ dateInfo }) => (
    <div className="space-y-6 w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Overview</h2>
        <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Selected Period: <span className="text-slate-900 font-bold">{dateInfo.rangeStr}</span></span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {kpiData.map((kpi, idx) => (
          <Card key={idx}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-500 text-sm font-medium">{kpi.title}</span>
              {kpi.status === 'good' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : 
               kpi.status === 'warning' ? <ArrowUpRight className="w-4 h-4 text-rose-500" /> :
               <ArrowDownRight className="w-4 h-4 text-slate-400" />}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
              <span className="text-xs text-slate-400">{kpi.unit}</span>
            </div>
            <div className={`text-xs mt-2 font-medium ${kpi.trend === 'Stable' ? 'text-blue-600' : kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {kpi.trend} <span className="text-slate-400 font-normal">vs prev period</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 w-full">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Network Demand Trend</h3>
                <p className="text-sm text-slate-500">Actual Sales vs Forecasted Demand ({dateInfo.rangeStr})</p>
              </div>
              <div className="flex gap-2">
                 <Badge status="info" text="Model: ETS + Holt-Winters" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip formatter={(value, name) => [value, name === 'forecast' ? 'Forecast Demand' : name === 'actual' ? 'Actual Sales' : name]} />
                  <Legend />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="#f1f5f9" name="Confidence Interval" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" /> 
                  <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={3} dot={{r: 4}} name="Forecast" />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Operational Anomalies
            </h3>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">{alert.msg}</span>
                <Badge status={alert.type} text={alert.type === 'critical' ? 'ALERT' : 'INFO'} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            System detects anomalies based on historical deviation &gt; 15%
          </div>
        </Card>
      </div>
      <Card>
        <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Demand by Channel Forecast</h3>
            <p className="text-sm text-slate-500">Projected split for {dateInfo.rangeStr}</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelSplitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Legend />
              <Bar dataKey="DineIn" stackId="a" fill="#10b981" name="Dine-in" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Delivery" stackId="a" fill="#3b82f6" name="Delivery (Grab/Go)" />
              <Bar dataKey="CloudKitchen" stackId="a" fill="#f59e0b" name="Cloud Kitchen" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  const ForecastView = ({ dateInfo }) => (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Demand Projections</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
            <Calendar className="w-4 h-4" />
            <span>Target Period: <span className="font-semibold text-slate-700">{dateInfo.rangeStr}</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Scenario: Standard
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 shadow-sm">
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>
      <Card>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="forecast" stroke="#10b981" fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" dataKey="lower" stackId="1" stroke="none" fill="transparent" />
                    <Area type="monotone" dataKey="upper" stackId="1" stroke="#cbd5e1" fill="#f1f5f9" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex gap-2 items-start">
             <Info className="w-5 h-5 shrink-0" />
             <div>
                 <strong>Data Insight:</strong> High confidence interval detected for {dateInfo.endStrShort}. Historical pattern suggests payday spike.
             </div>
         </div>
      </Card>
      <div className="overflow-x-auto rounded-xl border border-slate-200 w-full">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Projected Demand</th>
                    <th className="px-6 py-4">Confidence Level</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                <tr>
                    <td className="px-6 py-4 font-medium">Core Beverages</td>
                    <td className="px-6 py-4">1,204 cups</td>
                    <td className="px-6 py-4"><span className="text-emerald-600 font-bold">High</span></td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-medium">Seasonal: Sakura Series</td>
                    <td className="px-6 py-4">150 cups</td>
                    <td className="px-6 py-4"><span className="text-amber-600 font-bold">Med</span></td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-medium">Pastry (Croissant/Mille Crepe)</td>
                    <td className="px-6 py-4">320 pcs</td>
                    <td className="px-6 py-4"><span className="text-emerald-600 font-bold">High</span></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );

  const InventoryView = ({ dateInfo }) => (
    <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Inventory & Par Levels</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <span>Data As Of: <span className="font-semibold text-slate-600">{dateInfo.endStr}</span></span>
              </div>
            </div>
            <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg flex items-center gap-2">
                    <Download className="w-4 h-4" /> Order List
                 </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
             <Card className="bg-slate-50 border-slate-200">
                 <div className="flex justify-between">
                     <span className="text-sm font-medium text-slate-500">Stock Value</span>
                     <DollarSign className="w-4 h-4 text-emerald-600" />
                 </div>
                 <div className="text-2xl font-bold text-slate-800 mt-2">Rp 45.2M</div>
                 <div className="text-xs text-slate-500 mt-1">Acceptable range</div>
             </Card>
             <Card className="bg-rose-50 border-rose-100">
                 <div className="flex justify-between">
                     <span className="text-sm font-medium text-rose-800">Low Stock Items</span>
                     <AlertTriangle className="w-4 h-4 text-rose-500" />
                 </div>
                 <div className="text-2xl font-bold text-rose-700 mt-2">3 Items</div>
                 <div className="text-xs text-rose-600 mt-1">Action needed today</div>
             </Card>
             <Card className="bg-slate-50 border-slate-200">
                 <div className="flex justify-between">
                     <span className="text-sm font-medium text-slate-500">Variance (Loss)</span>
                     <Scale className="w-4 h-4 text-amber-500" />
                 </div>
                 <div className="text-2xl font-bold text-slate-800 mt-2">1.2%</div>
                 <div className="text-xs text-slate-500 mt-1">Within tolerance (&lt;2%)</div>
             </Card>
        </div>
        <Card>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-500" /> Raw Ingredient Levels vs Par
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Ingredient</th>
                            <th className="px-4 py-3">Unit</th>
                            <th className="px-4 py-3">Current Stock</th>
                            <th className="px-4 py-3">Par Level (Min-Max)</th>
                            <th className="px-4 py-3">Visual Status</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inventoryData.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-700">{item.item}</td>
                                <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">{item.current}</td>
                                <td className="px-4 py-3 text-slate-500">{item.min} - {item.max}</td>
                                <td className="px-4 py-3 w-48">
                                    <div className="h-2 w-full bg-slate-200 rounded-full relative">
                                        <div 
                                            className={`h-full rounded-full ${item.status === 'Low Stock' ? 'bg-rose-500' : item.status === 'Overstock' ? 'bg-purple-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${Math.min((item.current / item.max) * 100, 100)}%` }}
                                        ></div>
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-black/30" style={{ left: `${(item.min / item.max) * 100}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Badge status={item.status} text={item.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );

  const WasteView = ({ dateInfo }) => (
    <div className="space-y-6 w-full">
       <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Waste & Sell-Through Data</h2>
              <p className="text-slate-500">Monitoring performance for: <span className="font-semibold">{dateInfo.rangeStr}</span></p>
            </div>
            <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Report
                 </button>
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 w-full">
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-3">
                 <div className="p-2 bg-white rounded-full shadow-sm">
                     <Target className="w-4 h-4 text-emerald-600" />
                 </div>
                 <div>
                     <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Optimal</p>
                     <p className="text-sm font-medium text-slate-700">&ge; 90% Sell-Through</p>
                 </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-center gap-3">
                 <div className="p-2 bg-white rounded-full shadow-sm">
                     <AlertTriangle className="w-4 h-4 text-amber-500" />
                 </div>
                 <div>
                     <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">Warning</p>
                     <p className="text-sm font-medium text-slate-700">75% - 89% Sell-Through</p>
                 </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-center gap-3">
                 <div className="p-2 bg-white rounded-full shadow-sm">
                     <Trash2 className="w-4 h-4 text-rose-500" />
                 </div>
                 <div>
                     <p className="text-xs text-rose-800 font-bold uppercase tracking-wider">Critical</p>
                     <p className="text-sm font-medium text-slate-700">&lt; 75% Sell-Through</p>
                 </div>
            </div>
       </div>

       <div className="grid grid-cols-1 gap-6 w-full">
            <Card>
                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Sell-Through Overview (Pastry vs Seasonal)</h3>
                    <div className="flex gap-2 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Sold</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Waste</div>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={wasteChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="sold" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="wasted" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 justify-between w-full">
                    <div className="flex items-center gap-2">
                        <ClipboardX className="w-5 h-5 text-slate-500" /> Daily Sell-Through Report
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Period: {dateInfo.rangeStr}</span>
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3">Item Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-center">Prep</th>
                                <th className="px-4 py-3 text-center">Sold</th>
                                <th className="px-4 py-3 text-center">Waste</th>
                                <th className="px-4 py-3 text-center">Sell-Through %</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {wasteDetailedData.map((item) => {
                                const status = getSellThroughStatus(item.sellThrough);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                                        <td className="px-4 py-3 text-xs">
                                            <span className={`px-2 py-1 rounded-full ${item.category === 'Seasonal' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">{item.produced}</td>
                                        <td className="px-4 py-3 text-center">{item.sold}</td>
                                        <td className="px-4 py-3 text-center text-rose-600 font-bold">{item.wasted}</td>
                                        <td className="px-4 py-3 text-center font-medium">
                                            {item.sellThrough.toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge status={status} text={status} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
       </div>
    </div>
  );

  const MenuAnalysisView = ({ dateInfo }) => {
    const [viewMode, setViewMode] = useState('matrix'); 

    return (
      <div className="space-y-6 w-full">
          <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Menu Engineering Analysis</h2>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <span>Analyze Profitability vs Popularity • <span className="font-semibold text-slate-600">Period: {dateInfo.rangeStr}</span></span>
                </div>
              </div>
              <div className="bg-white p-1 rounded-lg border border-slate-200 flex">
                   <button 
                     onClick={() => setViewMode('matrix')}
                     className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'matrix' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     Profit Matrix
                   </button>
                   <button 
                     onClick={() => setViewMode('pareto')}
                     className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'pareto' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     Pareto (ABC)
                   </button>
              </div>
          </div>

          {viewMode === 'matrix' ? (
             <>
                <Card>
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold text-slate-700">Profitability vs Volume Matrix</h3>
                        <div className="flex gap-2 text-xs">
                             <Badge status="neutral" text="X: Contribution Margin %" />
                             <Badge status="neutral" text="Y: Sales Volume" />
                        </div>
                    </div>
                    <div className="h-[400px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="Margin" unit="%" domain={[0, 100]} />
                                <YAxis type="number" dataKey="y" name="Volume" unit=" orders" domain={[0, 100]} />
                                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Revenue" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Menu Items" data={menuMatrixData} fill="#8884d8">
                                    {menuMatrixData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={
                                            entry.category === 'Star' ? '#10b981' : 
                                            entry.category === 'Plowhorse' ? '#3b82f6' : 
                                            entry.category === 'Dog' ? '#f43f5e' : '#f59e0b'
                                        } />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                        {/* Quadrant Labels Overlay */}
                        <div className="absolute top-4 right-4 text-emerald-600 font-bold text-sm bg-white/80 p-1">STARS</div>
                        <div className="absolute top-4 left-16 text-blue-600 font-bold text-sm bg-white/80 p-1">PLOWHORSES</div>
                        <div className="absolute bottom-12 right-4 text-amber-600 font-bold text-sm bg-white/80 p-1">PUZZLES</div>
                        <div className="absolute bottom-12 left-16 text-rose-600 font-bold text-sm bg-white/80 p-1">DOGS</div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <Card className="border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Coffee className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800">Beverage Classification (Matcha Focus)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                <p><strong>Signature Matcha Latte</strong>: Classified as <strong>Star</strong> (High Vol, High Margin).</p>
                            </li>
                            <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                <p><strong>Matcha Ice Cream</strong>: Classified as <strong>Plowhorse</strong> (High Vol, Low Margin).</p>
                            </li>
                            <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                <p><strong>Hojicha Latte</strong>: Classified as <strong>Puzzle</strong>. High margin contribution but currently low volume.</p>
                            </li>
                        </ul>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Croissant className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800">Pastry & Seasonal Classification</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                <p><strong>Matcha Mille Crepe</strong>: Classified as <strong>Star</strong>. Consistent high revenue contribution.</p>
                            </li>
                            <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                                <p><strong>Strawberry Daifuku</strong>: Classified as <strong>Dog</strong> (Low Vol, Low Margin due to waste factor).</p>
                            </li>
                             <li className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                <p><strong>Data Note:</strong> Pastry check average is 18% higher when sold in bundles.</p>
                            </li>
                        </ul>
                    </Card>
                </div>
             </>
          ) : (
             <Card>
                 <div className="flex justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-slate-700">Pareto (ABC) Analysis - by Revenue</h3>
                        <p className="text-sm text-slate-500">Identify top contributors (80/20 Rule)</p>
                    </div>
                    <div className="flex gap-2 items-center text-sm">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> Revenue</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 h-0.5"></div> Cumulative %</div>
                    </div>
                 </div>
                 <div className="h-[500px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={paretoData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="name" scale="band" />
                             <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                             <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" unit="%" domain={[0, 100]} />
                             <Tooltip />
                             <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" barSize={40} name="Revenue (IDR)" radius={[4, 4, 0, 0]} />
                             <Line yAxisId="right" type="monotone" dataKey="cumulativePercentage" stroke="#f43f5e" strokeWidth={2} name="Cumulative %" dot={{r:4}} />
                         </ComposedChart>
                     </ResponsiveContainer>
                 </div>
                 <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                     <h4 className="font-bold text-slate-800 text-sm">Data Summary:</h4>
                     <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                         <li>Top items (Sig. Matcha, Mille Crepe) drive 88% revenue.</li>
                         <li><strong>Strawberry Daifuku</strong> shows high waste relative to contribution (Class C).</li>
                     </ul>
                 </div>
             </Card>
          )}
      </div>
    );
  };

  const OperationsView = ({ dateInfo }) => (
    <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Tech & Ops Impact Analysis</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <span>Measuring ROI on Technology • <span className="font-semibold text-slate-600">Data Updated: {dateInfo.endStr}</span></span>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
             {techImpactData.map((item, idx) => (
                 <Card key={idx} className="bg-slate-900 text-white border-slate-800">
                     <h4 className="text-slate-400 text-xs uppercase font-bold tracking-wider">{item.metric}</h4>
                     <div className="flex items-end gap-2 mt-2">
                         <span className="text-3xl font-bold">{item.machine}</span>
                         <span className="text-sm text-emerald-400 mb-1">({item.improvement})</span>
                     </div>
                     <div className="text-xs text-slate-500 mt-1">vs Manual: {item.manual}</div>
                 </Card>
             ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <Card>
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-purple-500" /> Error Rate Analysis (Validation)
                    </h3>
                    <Badge status="good" text="Impact: Positive" />
                </div>
                <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={errorSourceData} layout="vertical" margin={{left: 20}}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="source" type="category" width={140} tick={{fontSize: 12}} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} name="Errors Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    <strong>Observation:</strong> Manual entry errors remain significantly higher compared to QR ordering channels.
                </div>
            </Card>

            <Card>
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Hourly Traffic Analysis
                    </h3>
                    <Badge status="info" text="Labor Planning Enabler" />
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={hourlyTrafficData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Kemang" stroke="#10b981" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PIK" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Bintaro" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    <strong>Insight:</strong> Peak demand consistently occurs at 12:00 and 18:00 across major outlets.
                </div>
            </Card>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">FM</span>
            </div>
            <div>
                <h1 className="font-bold text-lg leading-none">Feel Matcha</h1>
                <span className="text-xs text-slate-400">Intelligence System</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">HQ</div>
                <div>
                    <p className="text-sm font-medium">Ops Manager</p>
                    <p className="text-xs text-slate-500">Headquarters</p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 h-full overflow-y-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-end items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                        <Truck className="w-4 h-4" />
                        {selectedOutlet}
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-lg hidden group-hover:block p-1 z-50">
                        {['All Network', 'Kemang', 'PIK Avenue', 'Cloud Kitchen 1'].map(o => (
                            <button key={o} onClick={() => setSelectedOutlet(o)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                                {o}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center gap-2">
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-slate-700 p-0 text-sm font-medium cursor-pointer w-28 outline-none"
                        />
                        <span className="text-slate-400 text-xs">to</span>
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-slate-700 p-0 text-sm font-medium cursor-pointer w-28 outline-none"
                        />
                    </div>
                </div>

                <div className="h-6 w-px bg-slate-300 mx-2 hidden md:block"></div>

                <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>

        <div className="p-8 w-full max-w-[1600px] mx-auto">
            {renderContent()}
        </div>
        
        <div className="p-8 text-center text-slate-400 text-xs">
             &copy; 2025 Feel Matcha Internal Systems v2.1.0 • Data refreshed: Just now
        </div>
      </main>
    </div>
  );
};

export default FeelMatchaDashboard;