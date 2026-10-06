import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegistrationData {
  registration_id: string;
  full_name: string;
  jersey_name?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  state?: string;
  city?: string;
  full_address?: string;
  mobile_number?: string;
  email?: string;
  profile_photo_url?: string;
  gov_id_url?: string;
  playing_role?: string;
  batting_style?: string;
  bowling_style?: string;
  preferred_batting_order?: string;
  experience_level?: string;
  current_club?: string;
  highest_level_played?: string;
  awards_achievements?: string;
  video_highlights_link?: string;
  resume_url?: string;
  payment_screenshot_url?: string;
  batting_skill?: number;
  bowling_skill?: number;
  fielding_skill?: number;
  fitness_skill?: number;
  created_at?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculateAge = (dob?: string) => {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getStars = (rating: number) => {
  return '⭐'.repeat(rating);
};

const formatTelegramMessage = (data: RegistrationData): string => {
  const sections: string[] = [];

  // Header
  sections.push('🏏 NEW PLAYER REGISTRATION - MPL 2026');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Registration Info
  sections.push(`📋 Registration ID: ${data.registration_id || 'N/A'}`);
  sections.push(`⏰ Submitted: ${formatDate(data.created_at)}\n`);

  // Personal Information
  sections.push('👤 PERSONAL INFORMATION');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  sections.push(`Name: ${data.full_name || 'N/A'}`);
  if (data.jersey_name) sections.push(`Jersey: ${data.jersey_name}`);
  if (data.date_of_birth) {
    sections.push(`DOB: ${formatDate(data.date_of_birth)} (${calculateAge(data.date_of_birth)} years)`);
  }
  if (data.gender) sections.push(`Gender: ${data.gender}`);
  if (data.nationality) sections.push(`Nationality: ${data.nationality}`);
  sections.push('');

  // Location
  sections.push('📍 LOCATION');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (data.state) sections.push(`State: ${data.state}`);
  if (data.city) sections.push(`City: ${data.city}`);
  if (data.full_address) sections.push(`Address: ${data.full_address}`);
  sections.push('');

  // Contact
  sections.push('📞 CONTACT');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (data.mobile_number) sections.push(`Mobile: ${data.mobile_number}`);
  if (data.email) sections.push(`Email: ${data.email}`);
  sections.push('');

  // Cricket Profile
  sections.push('🏏 CRICKET PROFILE');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (data.playing_role) sections.push(`Role: ${data.playing_role}`);
  if (data.batting_style) {
    const battingOrder = data.preferred_batting_order ? ` | Order: ${data.preferred_batting_order}` : '';
    sections.push(`Batting: ${data.batting_style}${battingOrder}`);
  }
  if (data.bowling_style) sections.push(`Bowling: ${data.bowling_style}`);
  if (data.experience_level) sections.push(`Experience: ${data.experience_level}`);
  sections.push('');

  // Background
  if (data.current_club || data.highest_level_played || data.awards_achievements) {
    sections.push('🏆 BACKGROUND');
    sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.current_club) sections.push(`Current Club: ${data.current_club}`);
    if (data.highest_level_played) sections.push(`Highest Level: ${data.highest_level_played}`);
    if (data.awards_achievements) {
      const awards = data.awards_achievements.substring(0, 100);
      sections.push(`Awards: ${awards}${data.awards_achievements.length > 100 ? '...' : ''}`);
    }
    sections.push('');
  }

  // Skill Ratings
  if (data.batting_skill || data.bowling_skill || data.fielding_skill || data.fitness_skill) {
    sections.push('📊 SKILL RATINGS');
    sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.batting_skill) sections.push(`Batting: ${getStars(data.batting_skill)} ${data.batting_skill}/10`);
    if (data.bowling_skill) sections.push(`Bowling: ${getStars(data.bowling_skill)} ${data.bowling_skill}/10`);
    if (data.fielding_skill) sections.push(`Fielding: ${getStars(data.fielding_skill)} ${data.fielding_skill}/10`);
    if (data.fitness_skill) sections.push(`Fitness: ${getStars(data.fitness_skill)} ${data.fitness_skill}/10`);
    sections.push('');
  }

  // Documents
  sections.push('📎 DOCUMENTS');
  sections.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  sections.push(`${data.profile_photo_url ? '✅' : '❌'} Profile Photo`);
  sections.push(`${data.gov_id_url ? '✅' : '❌'} Government ID`);
  sections.push(`${data.payment_screenshot_url ? '✅' : '❌'} Payment Screenshot`);
  if (data.video_highlights_link) sections.push(`\n🎥 Highlights: ${data.video_highlights_link}`);
  sections.push('');

  // Status
  sections.push('💰 Status: Payment submitted - please verify');

  return sections.join('\n');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    let chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (botToken && !chatId) {
      // Auto-detect: use the most recent chat that messaged the bot
      const u = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`).then(r => r.json()).catch(() => null);
      const list = u?.result ?? [];
      for (let i = list.length - 1; i >= 0; i--) {
        const c = (list[i].message ?? list[i].my_chat_member ?? list[i].channel_post)?.chat?.id;
        if (c) { chatId = String(c); break; }
      }
    }

    if (!botToken || !chatId) {
      console.warn('Telegram credentials not configured - skipping notification');
      return new Response(
        JSON.stringify({ success: true, skipped: true, message: 'Telegram not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: RegistrationData = await req.json();
    console.log('Received registration data:', data.registration_id);

    const message = formatTelegramMessage(data);

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text();
      console.error('Telegram API error:', error);
      throw new Error(`Telegram API error: ${error}`);
    }

    const photos: [string | undefined, string][] = [
      [data.profile_photo_url, `📸 Profile photo - ${data.full_name} (${data.registration_id})`],
      [data.payment_screenshot_url, `💰 Payment screenshot - ${data.full_name} (${data.registration_id})`],
    ];
    for (const [url, caption] of photos) {
      if (!url) continue;
      const r = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo: url, caption }),
      });
      if (!r.ok) {
        // fallback: send as document link
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, document: url, caption }),
        });
      }
    }

    console.log('Notification sent successfully for:', data.registration_id);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in notify-registration:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
