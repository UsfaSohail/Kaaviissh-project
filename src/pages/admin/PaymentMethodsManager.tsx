import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "sonner";

const PaymentMethodsManager = () => {
  const { methods, updateMethod } = usePaymentMethods();

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await updateMethod(id, { is_active: !isActive });
    if (!error) { toast.success("Payment method updated"); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Method</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Account Title</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Phone</th>
            <th className="text-start p-3 text-muted-foreground font-medium">IBAN</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Active</th>
          </tr></thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground font-medium">{m.method_name}</td>
                <td className="p-3 text-muted-foreground">{m.account_title}</td>
                <td className="p-3 text-muted-foreground">{m.phone_number || "—"}</td>
                <td className="p-3 text-muted-foreground text-xs font-mono">{m.iban || "—"}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(m.id, m.is_active)} className={`px-3 py-1 rounded-full text-xs font-medium ${m.is_active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {m.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMethodsManager;
