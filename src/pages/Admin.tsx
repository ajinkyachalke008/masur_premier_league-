import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Download, ExternalLink } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<any[] | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-players", {
        body: { pin },
      });
      if (error || (data as any)?.error) {
        toast({
          title: "Access denied",
          description: (data as any)?.error || error?.message || "Invalid PIN",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      setPlayers((data as any).players || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (!players) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {players.length} registration{players.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="ghost" onClick={() => { setPlayers(null); setPin(""); }}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {players.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">{p.registration_id}</div>
                  <div className="text-xl font-bold">{p.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.playing_role} · {p.city}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Field label="Jersey Name" value={p.jersey_name} />
                <Field label="DOB" value={p.date_of_birth} />
                <Field label="Gender" value={p.gender} />
                <Field label="Mobile" value={p.mobile_number} />
                <Field label="Batting" value={p.batting_style} />
                <Field label="Bowling" value={p.bowling_style} />
                <Field label="Skills" value={`Bat ${p.batting_skill}/10 · Bowl ${p.bowling_skill}/10 · Field ${p.fielding_skill}/10 · Fit ${p.fitness_skill}/10`} />
                <Field label="Address" value={p.full_address} />
                <Field label="Awards" value={p.awards_achievements} />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {p.profile_photo_url && (
                  <a href={p.profile_photo_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><ExternalLink className="h-3 w-3 mr-1" /> Photo</Button>
                  </a>
                )}
                {p.gov_id_url && (
                  <a href={p.gov_id_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><ExternalLink className="h-3 w-3 mr-1" /> Gov ID</Button>
                  </a>
                )}
                {p.resume_url && (
                  <a href={p.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><ExternalLink className="h-3 w-3 mr-1" /> Résumé</Button>
                  </a>
                )}
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
