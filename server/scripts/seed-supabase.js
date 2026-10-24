import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  console.log('🌱 Seeding Supabase database tables...');

  // 1. Users
  const users = [
    {
      id: 'usr-admin-1',
      name: 'Radhika Singhal',
      email: 'admin@mehndi.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      status: 'active'
    },
    {
      id: 'usr-art-2',
      name: 'Ayushi Verma',
      email: 'ayushi@mehndi.com',
      password: 'artist123',
      role: 'ARTIST',
      phone: '+91 98112 34567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'active'
    },
    {
      id: 'usr-art-1',
      name: 'Priya Sharma',
      email: 'priya@mehndi.com',
      password: 'artist123',
      role: 'ARTIST',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      status: 'active'
    },
    {
      id: 'usr-cust-1',
      name: 'Ananya Singhania',
      email: 'ananya@example.com',
      password: 'user123',
      role: 'USER',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      status: 'active'
    }
  ];

  for (const u of users) {
    await supabase.from('users').upsert(u, { onConflict: 'id' });
  }
  console.log('✅ Users seeded');

  // 2. Artists
  const artists = [
    {
      id: 'art-2',
      user_id: 'usr-art-2',
      name: 'Ayushi Verma',
      experience: '7 Years',
      location: 'Studio & Doorstep Service',
      specializations: ['Bridal', 'Indo-Arabic', 'Portraits'],
      rating: 4.95,
      review_count: 198,
      starting_price: 3500.00,
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      cover_image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80',
      about: 'Ayushi is the founder and master couturier of mehndiya. Combines heritage architectural jharokhas with contemporary botanical elegance using 100% triple-sifted organic Sojat henna paste.',
      verified: true,
      approval_status: 'approved',
      active: true,
      home_service: true,
      travel_charge: 500.00,
      phone: '+91 98112 34567',
      email: 'ayushi@mehndi.com',
      working_hours: {
        monday: { open: '10:00 AM', close: '08:00 PM', available: true },
        tuesday: { open: '10:00 AM', close: '08:00 PM', available: true },
        wednesday: { open: '10:00 AM', close: '08:00 PM', available: true },
        thursday: { open: '10:00 AM', close: '08:00 PM', available: true },
        friday: { open: '10:00 AM', close: '08:00 PM', available: true },
        saturday: { open: '09:00 AM', close: '09:00 PM', available: true },
        sunday: { open: '09:00 AM', close: '06:00 PM', available: true }
      },
      blocked_dates: [],
      time_slots: ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM']
    },
    {
      id: 'art-1',
      user_id: 'usr-art-1',
      name: 'Priya Sharma',
      experience: '8 Years',
      location: 'Studio & Doorstep Service',
      specializations: ['Bridal', 'Arabic', 'Traditional'],
      rating: 4.90,
      review_count: 142,
      starting_price: 2500.00,
      profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      cover_image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
      about: 'Priya is a senior bridal mehndi artist with 8+ years of heritage craftsmanship. Known for precision symmetrical bridal motifs and seamless organic color transitions.',
      verified: true,
      approval_status: 'approved',
      active: true,
      home_service: true,
      travel_charge: 500.00,
      phone: '+91 98765 43210',
      email: 'priya@mehndi.com',
      working_hours: {
        monday: { open: '09:00 AM', close: '07:00 PM', available: true },
        tuesday: { open: '09:00 AM', close: '07:00 PM', available: true },
        wednesday: { open: '09:00 AM', close: '07:00 PM', available: false },
        thursday: { open: '09:00 AM', close: '07:00 PM', available: true },
        friday: { open: '09:00 AM', close: '08:00 PM', available: true },
        saturday: { open: '08:00 AM', close: '09:00 PM', available: true },
        sunday: { open: '08:00 AM', close: '09:00 PM', available: true }
      },
      blocked_dates: [],
      time_slots: ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM']
    }
  ];

  for (const a of artists) {
    await supabase.from('artists').upsert(a, { onConflict: 'id' });
  }
  console.log('✅ Artists seeded');

  // 3. Services
  const services = [
    {
      id: 'srv-1',
      name: 'Royal Bridal Couture',
      category: 'Bridal',
      base_price: 5500.00,
      duration: '5 - 7 Hours',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
      description: 'Full forearms and feet adorned with heirloom dulha-dulhan portraits, royal jharokhas, and organic Sojat henna stain.'
    },
    {
      id: 'srv-2',
      name: 'Bridal Elegance Package',
      category: 'Bridal',
      base_price: 4000.00,
      duration: '3 - 4 Hours',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      description: 'Elbow-length intricate symmetry, lotus trails, and personalized wedding dates crafted for the modern bride.'
    },
    {
      id: 'srv-3',
      name: 'Engagement Mehndi',
      category: 'Engagement',
      base_price: 3000.00,
      duration: '2 - 3 Hours',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      description: 'Delicate symmetric palms and modern back-of-hand patterns crafted for engagement rings and Roka ceremonies.'
    },
    {
      id: 'srv-4',
      name: 'Arabic Mehndi',
      category: 'Arabic',
      base_price: 2000.00,
      duration: '1.5 - 2 Hours',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      description: 'Flowing bold vines, negative space leaf outlines, and high-contrast shading inspired by Dubai henna artistry.'
    },
    {
      id: 'srv-5',
      name: 'Party Mehndi',
      category: 'Party',
      base_price: 1800.00,
      duration: '2 Hours',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
      description: 'Chic hand and wrist designs for bridesmaids, party guests, and family celebrations.'
    },
    {
      id: 'srv-6',
      name: 'Minimal Mehndi',
      category: 'Minimal',
      base_price: 1500.00,
      duration: '1 Hour',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      description: 'Delicate finger bands, wrist mandalas, and sleek modern linear accents for the minimalist aesthetic.'
    }
  ];

  for (const s of services) {
    await supabase.from('services').upsert(s, { onConflict: 'id' });
  }
  console.log('✅ Services seeded');

  // 4. Designs
  const designs = [
    {
      id: 'des-1',
      title: 'Heirloom Radha Krishna Bridal',
      category: 'Bridal',
      price: 6500.00,
      duration: '5 Hours',
      tags: ['Bridal', 'Portraits', 'Traditional'],
      image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
      likes_count: 342,
      description: 'Elaborate symmetrical bridal palms featuring Radha Krishna, sacred kalash, and doli motifs.'
    },
    {
      id: 'des-2',
      title: 'Dubai Negative-Space Lotus',
      category: 'Arabic',
      price: 2500.00,
      duration: '1.5 Hours',
      tags: ['Arabic', 'Modern', 'Lotus'],
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      likes_count: 285,
      description: 'Flowing bold Arabic vines with negative space lotus blooms and gradient finger shading.'
    },
    {
      id: 'des-3',
      title: 'Minimalist Ring Finger Crown',
      category: 'Minimal',
      price: 1500.00,
      duration: '45 Mins',
      tags: ['Minimal', 'Contemporary'],
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      likes_count: 198,
      description: 'Modern chic wrist cuffs and geometric delicate lines framing engagement rings.'
    }
  ];

  for (const d of designs) {
    await supabase.from('designs').upsert(d, { onConflict: 'id' });
  }
  console.log('✅ Designs seeded');

  // 5. Appointments
  const appointments = [
    {
      id: 'apt-1',
      booking_id: 'MEH-20261025-0001',
      customer_id: 'usr-cust-1',
      customer_name: 'Ananya Singhania',
      customer_email: 'ananya@example.com',
      customer_phone: '+91 98111 22334',
      artist_id: 'art-2',
      artist_name: 'Ayushi Verma',
      service_id: 'srv-1',
      service_name: 'Royal Bridal Couture',
      event_date: '2026-10-25',
      time_slot: '10:00 AM',
      event_type: 'Bridal Ceremony',
      number_of_people: 2,
      location_type: 'home_service',
      venue_address: 'Studio Appointment / Doorstep Visit',
      total_amount: 5500.00,
      status: 'CONFIRMED'
    },
    {
      id: 'apt-2',
      booking_id: 'MEH-20261028-0002',
      customer_id: 'usr-cust-1',
      customer_name: 'Pooja Sharma',
      customer_email: 'pooja@example.com',
      customer_phone: '+91 98765 43210',
      artist_id: 'art-2',
      artist_name: 'Ayushi Verma',
      service_id: 'srv-3',
      service_name: 'Engagement Mehndi',
      event_date: '2026-10-28',
      time_slot: '03:00 PM',
      event_type: 'Engagement / Roka',
      number_of_people: 1,
      location_type: 'home_service',
      venue_address: 'Taj Palace / Doorstep Visit',
      total_amount: 3500.00,
      status: 'PENDING'
    }
  ];

  for (const a of appointments) {
    await supabase.from('appointments').upsert(a, { onConflict: 'id' });
  }
  console.log('✅ Appointments seeded');

  // 6. Reviews
  const reviews = [
    {
      id: 'rev-1',
      appointment_id: 'apt-1',
      customer_id: 'usr-cust-1',
      customer_name: 'Ananya Singhania',
      customer_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      artist_id: 'art-2',
      rating: 5,
      comment: 'Ayushi is absolutely incredible! Her Rajasthani bridal jharokha portraits were the highlight of my wedding. The henna stained into a deep dark mahogany that lasted for over 2 weeks!',
      event_date: '2026-10-10'
    },
    {
      id: 'rev-2',
      appointment_id: 'apt-2',
      customer_id: 'usr-cust-1',
      customer_name: 'Sneha Kapoor',
      customer_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      artist_id: 'art-2',
      rating: 5,
      comment: 'Best henna experience! Zero chemicals, wonderful soothing aroma, and Ayushi is so gentle and patient. Highly recommended!',
      event_date: '2026-10-05'
    }
  ];

  for (const r of reviews) {
    await supabase.from('reviews').upsert(r, { onConflict: 'id' });
  }
  console.log('✅ Reviews seeded');

  console.log('🎉 Supabase database seeding complete!');
}

seed().catch(console.error);
