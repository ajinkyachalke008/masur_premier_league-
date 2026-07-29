import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const ADMIN_PIN = "ajinkya008";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { pin } = await req.json();
    if (pin !== ADMIN_PIN) {
      return new Response(JSON.stringify({ error: "Invalid PIN" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Generate signed URLs for private file references
    const withUrls = await Promise.all((data || []).map(async (p: any) => {
      const signIfPath = async (val: string | null) => {
        if (!val) return val;
        if (val.startsWith("http")) return val;
        const { data: s } = await supabase.storage.from("player-files").createSignedUrl(val, 60 * 60);
        return s?.signedUrl || val;
      };
      return {
        ...p,
        profile_photo_url: await signIfPath(p.profile_photo_url),
        gov_id_url: await signIfPath(p.gov_id_url),
        resume_url: await signIfPath(p.resume_url),
      };
    }));

    return new Response(JSON.stringify({ players: withUrls }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
