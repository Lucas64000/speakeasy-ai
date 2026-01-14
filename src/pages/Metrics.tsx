import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
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
const errorRateData = generateTimeSeriesData(20, 0.5, 0.8);

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

interface SparklineProps {
  data: { time: string; value: number }[];
  color: string;
  height?: number;
}

function Sparkline({ data, color, height = 60 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
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

export default function Metrics() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
              Métriques en temps réel de l'infrastructure
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
            title="Temps de réponse IA"
            value="1.2s"
            subtitle="Moyenne"
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
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

        {/* Infrastructure Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">
            Infrastructure
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* API Server */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    API Server
                  </p>
                  <span className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "34%" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">34%</span>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Database
                  </p>
                  <span className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full"
                        style={{ width: "52%" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">52%</span>
                </div>
              </div>
            </div>

            {/* AI Service */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    AI Service
                  </p>
                  <span className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">78%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Données simulées pour démonstration • Refresh automatique toutes les 30s
        </p>
      </main>
    </div>
  );
}
