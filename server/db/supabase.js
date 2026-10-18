import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hfldqulslzlmvfszmdud.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'sb_publishable_Sol5Hk9Ba6TJXJP7eVB_Ag_r2N6QNJP';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in environment!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export const isUsingSupabase = () => true;

// Helper: Booking ID Generator (MEH-YYYYMMDD-XXXX)
let bookingCounter = 10;
export const generateBookingId = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const seq = String(bookingCounter++).padStart(4, '0');
  return `MEH-${yyyy}${mm}${dd}-${seq}`;
};

// Helper: Conflict Detection Engine against Supabase
export const checkBookingConflict = async ({ artistId, date, timeSlot }) => {
  try {
    // 1. Fetch artist from Supabase
    const { data: artist, error: artistErr } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .maybeSingle();

    if (artistErr || !artist) {
      return { conflict: true, reason: 'Artist not found in database.' };
    }

    if (artist.approval_status !== 'approved' || artist.active === false) {
      return { 
        conflict: true, 
        reason: 'Artist is currently not accepting bookings (pending approval or inactive).' 
      };
    }

    // 2. Check blocked dates
    const blockedDates = Array.isArray(artist.blocked_dates) ? artist.blocked_dates : [];
    const isBlocked = blockedDates.some(b => b.date === date);
    if (isBlocked) {
      const match = blockedDates.find(b => b.date === date);
      return {
        conflict: true,
        reason: `Artist has marked this date as unavailable (${match?.reason || 'Personal Commitment'}).`
      };
    }

    // 3. Check day of week working hours
    const dateObj = new Date(date + 'T12:00:00');
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dateObj.getDay()];
    const workingHours = artist.working_hours || {};
    const daySchedule = workingHours[dayName];

    if (daySchedule && daySchedule.available === false) {
      return {
        conflict: true,
        reason: `Artist does not take appointments on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}s (Weekly Off).`
      };
    }

    // 4. Check existing appointments in Supabase for overlapping time slot
    const { data: existingAppts } = await supabase
      .from('appointments')
      .select('id, status')
      .eq('artist_id', artistId)
      .eq('event_date', date)
      .eq('time_slot', timeSlot)
      .in('status', ['CONFIRMED', 'PENDING']);

    if (existingAppts && existingAppts.length > 0) {
      return {
        conflict: true,
        reason: `The time slot ${timeSlot} on ${date} is already reserved by another client.`
      };
    }

    return { conflict: false };
  } catch (err) {
    console.error('Error during conflict check:', err);
    return { conflict: false };
  }
};

export default supabase;
