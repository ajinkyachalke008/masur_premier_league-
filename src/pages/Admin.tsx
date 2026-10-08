import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  Download, 
  ExternalLink, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  SendHorizontal
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const Admin = () => {
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<any[] | null>(null);
  
  // Telegram settings state
  const [telegramChatId, setTelegramChatId] = useState("");
  const [savingChatId, setSavingChatId] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  const fetchPlayers = async (adminPin: string) => {
    const { data, error } = await supabase.functions.invoke("admin-get-players", {
      body: { pin: adminPin },
    });
    if (error || (data as any)?.error) {
      throw new Error((data as any)?.error || error?.message || "Invalid PIN");
    }
    setPlayers((data as any).players || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchPlayers(pin);
    } catch (err: any) {
      toast({
        title: "Access denied",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTelegramTarget = async () => {
    if (!telegramChatId.trim()) {
      toast({ title: "Chat ID required", description: "Enter a Telegram chat or group ID.", variant: "destructive" });
      return;
    }
    setSavingChatId(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-players", {
        body: {
          pin,
          action: "telegram_target",
          chat_id: telegramChatId.trim(),
        },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Failed to update Telegram target");
      }
      toast({
        title: "Telegram Destination Updated",
        description: `Submissions will now be delivered to chat: ${telegramChatId.trim()}`,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingChatId(false);
    }
  };

  const retryTelegram = async (playerId: string) => {
    setRetryingId(playerId);
    try {
      const { data, error } = await supabase.functions.invoke("notify-registration", {
        body: { pin, player_id: playerId },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Notification retry failed");
      }
      toast({
        title: "Telegram Delivery Result",
        description: `Status: ${(data as any)?.telegram_status || "updated"}`,
      });
      await fetchPlayers(pin);
    } catch (err: any) {
      toast({ title: "Delivery failed", description: err.message, variant: "destructive" });
    } finally {
      setRetryingId(null);
    }
  };

  const updatePaymentStatus = async (playerId: string, status: "verified" | "rejected") => {
    setUpdatingPaymentId(playerId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-players", {
        body: {
          pin,
          action: "payment",
          player_id: playerId,
          payment_status: status,
        },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Payment status update failed");
      }
      toast({
        title: "Payment status updated",
        description: `Marked as ${status}.`,
      });
      await fetchPlayers(pin);
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  if (!players) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="relative w-full max-w-md p-8">
          <BorderBeam size={260} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Admin PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const exportCsv = () => {
    if (!players.length) return;
    const keys = Object.keys(players[0]);
    const rows = [
      keys.join(","),
      ...players.map((p) =>
        keys.map((k) => JSON.stringify(p[k] ?? "")).join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `players-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {players.length} registration{players.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" onClick={() => fetchPlayers(pin)}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" onClick={exportCsv}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
            </Button>
            <Button variant="ghost" size="sm" className="h-9 text-xs sm:text-sm" onClick={() => { setPlayers(null); setPin(""); }}>
              Logout
            </Button>
          </div>
        </div>

        {/* Telegram Destination Settings Card */}
        <Card className="relative p-3.5 sm:p-5 border-accent/40 bg-card/60 rounded-xl">
          <BorderBeam size={300} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Send className="h-4 w-4 text-accent shrink-0" />
                Telegram Delivery Destination
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Enter your Telegram Chat ID (group or personal chat ID e.g. <span className="font-mono text-accent">7292615555</span>) to receive registration alerts and photos.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              <Input
                placeholder="Telegram Chat ID"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full md:w-60 bg-input h-10 text-sm"
              />
              <Button
                size="sm"
                className="shrink-0 h-10 text-xs sm:text-sm font-semibold"
                onClick={saveTelegramTarget}
                disabled={savingChatId}
              >
                {savingChatId ? "Saving..." : "Save Chat ID"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Player List */}
        <div className="grid gap-3 sm:gap-4">
          {players.map((p) => (
            <Card key={p.id} className="relative p-3.5 sm:p-5 rounded-xl border-border">
              <BorderBeam size={260} duration={8} borderWidth={1.5} colorFrom="#ff6a00" colorTo="#ffc83d" />
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{p.registration_id}</div>
                  <div className="text-lg sm:text-xl font-bold">{p.full_name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {p.playing_role} {p.city ? `· ${p.city}` : ""}
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                  {/* Telegram Status */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-[11px] sm:text-xs ${
                      p.telegram_status === "delivered"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : p.telegram_status === "failed"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {p.telegram_status === "delivered" && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {p.telegram_status === "failed" && <AlertCircle className="h-3.5 w-3.5" />}
                    {p.telegram_status !== "delivered" && p.telegram_status !== "failed" && <Clock className="h-3.5 w-3.5" />}
                    Telegram: {p.telegram_status || "pending"}
                  </span>

                  {/* Payment Status */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-[11px] sm:text-xs ${
                      p.payment_status === "verified"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : p.payment_status === "rejected"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    Payment: {(p.payment_status || "pending").replace(/_/g, " ")}
                  </span>

                  <span className="text-muted-foreground text-[11px] ml-1">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {p.telegram_error && (
                <div className="mb-3 p-2 rounded bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Telegram error: {p.telegram_error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <Field label="Jersey Name" value={p.jersey_name} />
                <Field label="DOB" value={p.date_of_birth} />
                <Field label="Mobile" value={p.mobile_number} />
                <Field label="Batting" value={p.batting_style} />
                <Field label="Bowling" value={p.bowling_style} />
                <Field label="Awards" value={p.awards_achievements} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-border">
                {/* File Previews */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {p.profile_photo_url && (
                    <a href={p.profile_photo_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="h-8 text-xs px-2.5">
                        <ExternalLink className="h-3 w-3 mr-1" /> Photo
                      </Button>
                    </a>
                  )}
                  {p.gov_id_url && (
                    <a href={p.gov_id_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="h-8 text-xs px-2.5">
                        <ExternalLink className="h-3 w-3 mr-1" /> Gov ID
                      </Button>
                    </a>
                  )}
                  {p.resume_url && (
                    <a href={p.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="h-8 text-xs px-2.5">
                        <ExternalLink className="h-3 w-3 mr-1" /> Payment Screenshot
                      </Button>
                    </a>
                  )}
                </div>

                {/* Organizer Actions */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {/* Retry Telegram Send */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs px-2.5"
                    onClick={() => retryTelegram(p.id)}
                    disabled={retryingId === p.id}
                  >
                    <SendHorizontal className="h-3 w-3 mr-1" />
                    {retryingId === p.id ? "Sending..." : "Send to Telegram"}
                  </Button>

                  {/* Payment Decision */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2.5 text-green-500 border-green-500/30 hover:bg-green-500/10"
                    onClick={() => updatePaymentStatus(p.id, "verified")}
                    disabled={updatingPaymentId === p.id}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verify Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2.5 text-red-500 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => updatePaymentStatus(p.id, "rejected")}
                    disabled={updatingPaymentId === p.id}
                  >
                    <XCircle className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: any }) => (
  <div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className="font-medium break-words">{value || "—"}</div>
  </div>
);

export default Admin;
