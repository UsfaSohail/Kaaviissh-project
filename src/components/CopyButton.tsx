import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const CopyButton = ({ value, label }: { value: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(label ? `${label} copied successfully` : "Copied successfully");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95"
      title="Copy to clipboard"
      type="button"
    >
      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
    </button>
  );
};

export default CopyButton;
