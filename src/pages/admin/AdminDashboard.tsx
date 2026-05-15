import { useMemo, useState } from "react";
import {
  Briefcase,
  DollarSign,
  Users,
  FileText,
  HandHeart,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { useCases } from "@/hooks/useCases";
import { useDonations } from "@/hooks/useDonations";
import { useApplications } from "@/hooks/useApplications";
import { useBlogs } from "@/hooks/useBlogs";
import { useVolunteers } from "@/hooks/useVolunteers";
import { Skeleton } from "@/components/ui/skeleton";

type Range = "Weekly" | "Monthly" | "Yearly";

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconClass,
  hint,
  delay = 0,
  loading,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -3 }}
    className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
        <Icon size={16} />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-24 mt-1" />
    ) : (
      <p className="text-2xl font-bold text-foreground">{value}</p>
    )}
    {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
  </motion.div>
);

const AdminDashboard = () => {
  const { cases, loading: lc } = useCases();
  const { donations, loading: ld } = useDonations();
  const { applications, loading: la } = useApplications();
  const { posts, loading: lb } = useBlogs(false);
  const { volunteers, loading: lv } = useVolunteers();
  const [range, setRange] = useState<Range>("Monthly");

  const loading = lc || ld || la || lb || lv;

  const totalDonations = donations.length;
  const verifiedDonations = donations.filter((d) => d.status === "verified");
  const pendingDonations = donations.filter((d) => d.status === "pending");
  const totalRaised = verifiedDonations.reduce((s, d) => s + Number(d.amount), 0);

  const approvedApps = applications.filter((a) => a.status === "Approved").length;
  const rejectedApps = applications.filter((a) => a.status === "Rejected").length;
  const pendingApps = applications.filter((a) => a.status === "Pending").length;

  const openCases = cases.filter((c) => c.status === "Open").length;
  const completedCases = cases.filter((c) => c.status === "Completed" || c.status === "Closed").length;

  // Donation graph by range
  const graph = useMemo(() => {
    const buckets: Record<string, number> = {};
    const now = new Date();

    verifiedDonations.forEach((d) => {
      const date = new Date(d.created_at);
      let key = "";
      if (range === "Weekly") {
        const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (days > 7) return;
        key = date.toLocaleDateString(undefined, { weekday: "short" });
      } else if (range === "Monthly") {
        const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (days > 30) return;
        key = `${date.getMonth() + 1}/${date.getDate()}`;
      } else {
        if (date.getFullYear() !== now.getFullYear()) return;
        key = date.toLocaleDateString(undefined, { month: "short" });
      }
      buckets[key] = (buckets[key] || 0) + Number(d.amount);
    });

    return Object.entries(buckets).map(([name, amount]) => ({ name, amount }));
  }, [verifiedDonations, range]);

  const appPie = [
    { name: "Approved", value: approvedApps, color: "hsl(var(--primary))" },
    { name: "Pending", value: pendingApps, color: "hsl(48 96% 53%)" },
    { name: "Rejected", value: rejectedApps, color: "hsl(var(--destructive))" },
  ];

  const volunteerPie = [
    { name: "Approved", value: volunteers.filter((v) => v.status === "Approved").length, color: "hsl(var(--primary))" },
    { name: "Pending", value: volunteers.filter((v) => v.status === "Pending").length, color: "hsl(48 96% 53%)" },
    { name: "Rejected", value: volunteers.filter((v) => v.status === "Rejected").length, color: "hsl(var(--destructive))" },
  ];

  // Recent activity
  const recent = useMemo(() => {
    const items: { type: string; text: string; time: string }[] = [];
    donations.slice(0, 5).forEach((d) =>
      items.push({
        type: "donation",
        text: `${d.donor_name || "Anonymous"} donated Rs. ${Number(d.amount).toLocaleString()}`,
        time: d.created_at,
      })
    );
    applications.slice(0, 5).forEach((a) =>
      items.push({ type: "application", text: `${a.full_name} applied for help`, time: a.created_at })
    );
    volunteers.slice(0, 5).forEach((v) =>
      items.push({ type: "volunteer", text: `${v.full_name} applied as volunteer`, time: v.created_at })
    );
    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [donations, applications, volunteers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time insights into your foundation</p>
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(["Weekly", "Monthly", "Yearly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard loading={loading} icon={DollarSign} label="Total Raised" value={`Rs. ${totalRaised.toLocaleString()}`} iconClass="bg-primary/15 text-primary" delay={0.0} />
        <StatCard loading={loading} icon={CheckCircle2} label="Verified Donations" value={verifiedDonations.length} iconClass="bg-primary/15 text-primary" delay={0.05} />
        <StatCard loading={loading} icon={Clock} label="Pending Donations" value={pendingDonations.length} iconClass="bg-yellow-500/15 text-yellow-500" delay={0.1} />
        <StatCard loading={loading} icon={Briefcase} label="Total Cases" value={cases.length} iconClass="bg-blue-500/15 text-blue-500" delay={0.15} hint={`${openCases} open · ${completedCases} done`} />
        <StatCard loading={loading} icon={Users} label="Applications" value={applications.length} iconClass="bg-purple-500/15 text-purple-500" delay={0.2} hint={`${approvedApps} approved · ${pendingApps} pending`} />
        <StatCard loading={loading} icon={CheckCircle2} label="Approved Apps" value={approvedApps} iconClass="bg-primary/15 text-primary" delay={0.25} />
        <StatCard loading={loading} icon={XCircle} label="Rejected Apps" value={rejectedApps} iconClass="bg-destructive/15 text-destructive" delay={0.3} />
        <StatCard loading={loading} icon={HandHeart} label="Volunteers" value={volunteers.length} iconClass="bg-pink-500/15 text-pink-500" delay={0.35} />
      </div>

      {/* Graph + Pies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Donation Trend ({range})
            </h3>
          </div>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : graph.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data in this range</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={graph}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Amount"]}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-3">Applications</h3>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={appPie} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                  {appPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-3">Cases Status</h3>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ name: "Open", value: openCases }, { name: "Completed", value: completedCases }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-3">Volunteers</h3>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={volunteerPie} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                  {volunteerPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText size={16} className="text-muted-foreground" /> Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {recent.map((r, i) => (
                <li key={i} className="text-xs border-b border-border/40 pb-2 last:border-0">
                  <p className="text-foreground line-clamp-1">{r.text}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{new Date(r.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
