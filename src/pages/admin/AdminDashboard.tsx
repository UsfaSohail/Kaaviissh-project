import { Briefcase, DollarSign, Users, FileText } from "lucide-react";
import { useCases } from "@/hooks/useCases";
import { useDonations } from "@/hooks/useDonations";
import { useApplications } from "@/hooks/useApplications";
import { useBlogs } from "@/hooks/useBlogs";

const AdminDashboard = () => {
  const { cases } = useCases();
  const { donations } = useDonations();
  const { applications } = useApplications();
  const { posts } = useBlogs(false);

  const stats = [
    { label: "Total Cases", value: cases.length, icon: Briefcase, color: "text-blue-400" },
    { label: "Total Donations", value: donations.length, icon: DollarSign, color: "text-primary" },
    { label: "Applications", value: applications.length, icon: Users, color: "text-yellow-400" },
    { label: "Blog Posts", value: posts.length, icon: FileText, color: "text-purple-400" },
  ];

  const pendingDonations = donations.filter(d => d.status === "pending").length;
  const pendingApps = applications.filter(a => a.status === "Pending").length;
  const totalDonated = donations.filter(d => d.status === "verified").reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <s.icon size={20} className={s.color} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Pending Donations</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingDonations}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Pending Applications</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingApps}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total Verified Donations</p>
          <p className="text-2xl font-bold text-primary">Rs. {totalDonated.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
