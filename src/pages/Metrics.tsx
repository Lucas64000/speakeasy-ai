import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAdmin } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Génération de données mock réalistes
const generateTimeSeriesData = (points: number, baseValue: number, variance: number) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
  }));
};

const latencyData = generateTimeSeriesData(20, 85, 40);
const throughputData = generateTimeSeriesData(20, 1250, 300);

// Feedback mock data
const feedbackData = {
  total: 847,
  useful: 712,
  notUseful: 135,
  trend: generateTimeSeriesData(14, 50, 20).map((d, i) => ({
    ...d,
    day: `J-${14 - i}`,
    useful: Math.floor(40 + Math.random() * 30),
    notUseful: Math.floor(5 + Math.random() * 10),
  })),
  recentFeedback: [
    { id: 1, type: "useful", message: "Correction claire et précise", time: "Il y a 2 min" },
    { id: 2, type: "useful", message: "Suggestion très utile", time: "Il y a 5 min" },
    { id: 3, type: "notUseful", message: "Pas applicable dans ce contexte", time: "Il y a 12 min" },
    { id: 4, type: "useful", message: "Merci pour l'explication", time: "Il y a 18 min" },
    { id: 5, type: "useful", message: "Parfait !", time: "Il y a 25 min" },
  ],
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  status?: "healthy" | "warning" | "error";
  className?: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = "healthy",
  className,
}: MetricCardProps) {
  const statusColors = {
    healthy: "text-success",
    warning: "text-accent",
    error: "text-destructive",
  };

  const statusBg = {
    healthy: "bg-success/10",
    warning: "bg-accent/10",
    error: "bg-destructive/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", statusBg[status])}>
          <Icon className={cn("w-4 h-4", statusColors[status])} />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}
          >
            <TrendingUp
              className={cn("w-3 h-3", !trend.isPositive && "rotate-180")}
            />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

interface ChartCardProps {
  title: string;
  data: { time: string; value: number }[];
  color: string;
  unit: string;
  currentValue: string;
}

function ChartCard({ title, data, color, unit, currentValue }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-display font-bold text-foreground">
            {currentValue}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </p>
        </div>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                `${value.toFixed(1)} ${unit}`,
                title,
              ]}
              labelFormatter={(label) => `Heure: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function StatusIndicator({ status }: { status: "operational" | "degraded" | "down" }) {
  const config = {
    operational: { color: "bg-success", text: "Opérationnel", textColor: "text-success" },
    degraded: { color: "bg-accent", text: "Dégradé", textColor: "text-accent" },
    down: { color: "bg-destructive", text: "Hors service", textColor: "text-destructive" },
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-2 h-2 rounded-full", config[status].color)} />
      <span className={cn("text-sm font-medium", config[status].textColor)}>
        {config[status].text}
      </span>
    </div>
  );
}

function FeedbackAnalytics() {
  const usefulPercent = Math.round((feedbackData.useful / feedbackData.total) * 100);
  const pieData = [
    { name: "Utile", value: feedbackData.useful, color: "hsl(var(--success))" },
    { name: "Non utile", value: feedbackData.notUseful, color: "hsl(var(--destructive))" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">
          Feedback Analytics
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{usefulPercent}%</p>
                <p className="text-xs text-muted-foreground">utile</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">{feedbackData.useful} utiles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">{feedbackData.notUseful} non utiles</span>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="md:col-span-1">
          <p className="text-sm text-muted-foreground mb-2">Tendance (14 jours)</p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feedbackData.trend}>
                <defs>
                  <linearGradient id="usefulGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="useful"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fill="url(#usefulGradient)"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === "useful" ? "Utiles" : "Non utiles",
                  ]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Feedback */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Récents</p>
          <div className="space-y-2 max-h-[120px] overflow-y-auto">
            {feedbackData.recentFeedback.map((fb) => (
              <div
                key={fb.id}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg"
              >
                {fb.type === "useful" ? (
                  <ThumbsUp className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                ) : (
                  <ThumbsDown className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{fb.message}</p>
                  <p className="text-xs text-muted-foreground">{fb.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Metrics() {
  const { isAdmin } = useAdmin();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Monitoring
            </h1>
            <p className="text-muted-foreground text-sm">
              Métriques en temps réel • Accès admin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              Mis à jour: {lastUpdated.toLocaleTimeString("fr-FR")}
            </p>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
              Actualiser
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Tous les systèmes opérationnels
                </p>
                <p className="text-sm text-muted-foreground">
                  Uptime: 99.98% sur les 30 derniers jours
                </p>
              </div>
            </div>
            <StatusIndicator status="operational" />
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Latence moyenne"
            value="85ms"
            subtitle="P95: 142ms"
            icon={Zap}
            trend={{ value: 12, isPositive: true }}
            status="healthy"
          />
          <MetricCard
            title="Requêtes/min"
            value="1.2K"
            subtitle="Peak: 2.1K"
            icon={Activity}
            trend={{ value: 8, isPositive: true }}
            status="healthy"
          />
          <MetricCard
            title="Taux d'erreur"
            value="0.12%"
            subtitle="Dernière heure"
            icon={AlertTriangle}
            status="healthy"
          />
          <MetricCard
            title="Feedbacks"
            value={`${feedbackData.total}`}
            subtitle={`${Math.round((feedbackData.useful / feedbackData.total) * 100)}% positifs`}
            icon={MessageSquare}
            trend={{ value: 15, isPositive: true }}
            status="healthy"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Latence API"
            data={latencyData}
            color="hsl(var(--primary))"
            unit="ms"
            currentValue="85"
          />
          <ChartCard
            title="Throughput"
            data={throughputData}
            color="hsl(var(--success))"
            unit="req/min"
            currentValue="1,247"
          />
        </div>

        {/* Feedback Analytics (replaces Infrastructure) */}
        <FeedbackAnalytics />

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Données simulées pour démonstration • Refresh automatique toutes les 30s
        </p>
      </main>
    </div>
  );
}
