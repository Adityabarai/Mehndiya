import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Image,
  Upload
} from 'lucide-react';
import Modal from '../common/Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function BookingWizardModal({ isOpen, onClose, preselectedService, preselectedArtist, initialParams }) {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Data lists
  const [servicesList, setServicesList] = useState([]);
  const [artistsList, setArtistsList] = useState([]);

  // Form State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Event Details (Step 5)
  const [eventType, setEventType] = useState('Bridal Ceremony');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [eventLocation, setEventLocation] = useState('Mumbai');
  const [venueAddress, setVenueAddress] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [referenceDesign, setReferenceDesign] = useState('');

  // Customer Details (Step 6)
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('Pay on Arrival');

  // Conflict state
  const [conflictError, setConflictError] = useState('');

  // Fetch services & artists
  useEffect(() => {
    if (isOpen) {
      api.getServices()
        .then(res => {
          if (res.success) setServicesList(res.data);
        })
        .catch(console.error);

      api.getArtists()
        .then(res => {
          if (res.success) setArtistsList(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  // Set initial selections if passed
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setStep(2);
    }
    if (preselectedArtist) {
      setSelectedArtist(preselectedArtist);
      setEventLocation(preselectedArtist.location || 'Mumbai');
    }
    if (initialParams?.date) setSelectedDate(initialParams.date);
    if (initialParams?.timeSlot) setSelectedTimeSlot(initialParams.timeSlot);
  }, [preselectedService, preselectedArtist, initialParams]);

  // Sync user info if user logs in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Standard time slots matching Prompt Item 9
  const defaultSlots = ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];
  const artistSlots = selectedArtist?.timeSlots || defaultSlots;

  // Check if selected date is valid/blocked for selected artist
  const isDateBlocked = selectedArtist?.blockedDates?.some(b => b.date === selectedDate);
  const blockedReason = selectedArtist?.blockedDates?.find(b => b.date === selectedDate)?.reason;

  const dateObj = new Date(selectedDate + 'T12:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dateObj.getDay()];
  const isDayOff = selectedArtist?.workingHours && selectedArtist.workingHours[dayName]?.available === false;

  // Pricing calculations
  const servicePrice = selectedService ? Number(selectedService.basePrice) : 2500;
  const travelCharge = selectedArtist ? Number(selectedArtist.travelCharge || 0) : 500;
  const totalAmount = servicePrice + travelCharge;

  // Wizard Step Navigation Validations
  const handleNext = () => {
    setConflictError('');

    if (step === 1) {
      if (!selectedService) {
        toastError('Please select a Mehndi service.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedArtist) {
        toastError('Please choose an artist.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedDate) {
        toastError('Please choose an appointment date.');
        return;
      }
      if (isDateBlocked) {
        toastError(`Artist is unavailable on ${selectedDate} (${blockedReason || 'Personal Leave'}).`);
        return;
      }
      if (isDayOff) {
        toastError(`Artist does not take appointments on ${dayName.toUpperCase()}s.`);
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!selectedTimeSlot) {
        toastError('Please choose a time slot.');
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (!venueAddress.trim()) {
        toastError('Please provide the event venue or home address.');
        return;
      }
      setStep(6);
    } else if (step === 6) {
      if (!customerName || !customerPhone) {
        toastError('Please enter your full name and phone number.');
        return;
      }
      setStep(7);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setConflictError('');

    const payload = {
      userId: user?.id,
      userName: customerName,
      userEmail: customerEmail,
      userPhone: customerPhone,
      artistId: selectedArtist.id,
      serviceId: selectedService.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      eventType,
      numberOfPeople,
      location: eventLocation,
      address: venueAddress,
      specialRequirements,
      referenceImage: referenceDesign,
      paymentMethod
    };

    try {
      const res = await api.createAppointment(payload);
      if (res.success) {
        toastSuccess('Appointment request submitted successfully! (Status: PENDING)');
        onClose();
        // Reset state
        setStep(1);
        setSelectedService(null);
        setSelectedArtist(null);
        setSelectedTimeSlot('');
      }
    } catch (err) {
      setConflictError(err.message || 'Booking submission failed');
      toastError(err.message || 'Booking submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a Mehndi Appointment"
      subtitle={`Step ${step} of 7 • ${
        step === 1 ? 'Select Service' :
        step === 2 ? 'Select Artist' :
        step === 3 ? 'Select Date' :
        step === 4 ? 'Select Time Slot' :
        step === 5 ? 'Event Details' :
        step === 6 ? 'Customer Details' :
        'Booking Summary'
      }`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between gap-1 border-b border-[#E8DFC8] pb-4">
          {[1, 2, 3, 4, 5, 6, 7].map(s => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-[#143823] text-[#F3E5AB] ring-2 ring-[#D4AF37]'
                    : step > s
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              <span className="hidden sm:inline text-[9px] font-bold text-[#8C8479] uppercase">
                {s === 1 ? 'Service' : s === 2 ? 'Artist' : s === 3 ? 'Date' : s === 4 ? 'Time' : s === 5 ? 'Event' : s === 6 ? 'Contact' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Choose Your Desired Mehndi Service
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {servicesList.map(srv => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isSelected
                        ? 'border-[#143823] bg-[#143823]/5 ring-2 ring-[#D4AF37]/50 shadow-sm'
                        : 'border-[#E8DFC8] bg-white hover:border-[#D4AF37]'
                    }`}
                  >
                    <img src={srv.image} alt={srv.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-sm text-[#143823] truncate">{srv.name}</h5>
                        {isSelected && <Check className="w-4 h-4 text-[#143823] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#7A7369] mt-0.5 line-clamp-2">{srv.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EFE9DC] text-xs">
                        <span className="text-[10px] text-[#8C8479]">{srv.duration}</span>
                        <span className="font-bold text-[#143823]">₹{srv.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Artist */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Select an Available Master Artist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {artistsList.map(artist => {
                const isSelected = selectedArtist?.id === artist.id;
                return (
                  <div
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setEventLocation(artist.location);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                      isSelected
                        ? 'border-[#143823] bg-[#143823]/5 ring-2 ring-[#D4AF37]/50 shadow-sm'
                        : 'border-[#E8DFC8] bg-white hover:border-[#D4AF37]'
                    }`}
                  >
                    <img src={artist.profileImage} alt={artist.name} className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-[#D4AF37]/40" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <h5 className="font-serif font-bold text-sm text-[#143823] truncate">{artist.name}</h5>
                          {artist.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#143823] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#7A7369]">{artist.experience} • {artist.location}</p>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-bold text-amber-600">★ {artist.rating}</span>
                        <span className="text-[#143823] font-bold">Starts ₹{artist.startingPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Select Date */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Choose Your Appointment Date
            </h4>
            <p className="text-xs text-[#6B645C]">
              We automatically cross-reference {selectedArtist?.name}'s working days and blocked dates.
            </p>

            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8DFC8] space-y-4 max-w-md mx-auto">
              <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider">
                Event Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E8DFC8] bg-white text-base font-bold text-[#143823] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />

              {/* Status Alert */}
              {isDateBlocked ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <p className="font-bold">❌ Artist is Unavailable on this Date</p>
                  <p className="mt-0.5">Reason: {blockedReason || 'Personal Leave'}. Please choose another date.</p>
                </div>
              ) : isDayOff ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <p className="font-bold">⚠️ Weekly Off on {dayName.toUpperCase()}</p>
                  <p className="mt-0.5">{selectedArtist?.name} does not take bookings on {dayName}s. Please pick another day.</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <p className="font-bold">✅ Date is Available!</p>
                  <p className="mt-0.5">Click Next to select an open time slot.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Select Time Slot */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Select an Open Time Slot on {selectedDate}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artistSlots.map((slot, i) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#143823] text-[#F3E5AB] border-[#143823] ring-2 ring-[#D4AF37]/50 shadow-md'
                        : 'bg-white border-[#E8DFC8] text-[#143823] hover:border-[#D4AF37] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Event Details */}
        {step === 5 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Ceremony & Venue Location Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                >
                  <option value="Bridal Ceremony">Bridal Ceremony</option>
                  <option value="Engagement / Roka">Engagement / Roka</option>
                  <option value="Sangeet Party">Sangeet Party</option>
                  <option value="Festival (Karwa Chauth/Diwali)">Festival</option>
                  <option value="Baby Shower / Godh Bharai">Baby Shower</option>
                  <option value="Other Celebration">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Estimated Number of People
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfPeople}
                  onChange={e => setNumberOfPeople(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Full Venue Address or Home Address *
                </label>
                <textarea
                  rows={2}
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  placeholder="Apartment/Villa, Street, Landmark, City & Pincode..."
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Special Design Requests / Hashtags / Portrait Notes
                </label>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={e => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Include groom portrait, #PoojaWedsRohan hashtag, or temple bells..."
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Reference Design Image (URL or Note)
                </label>
                <input
                  type="text"
                  value={referenceDesign}
                  onChange={e => setReferenceDesign(e.target.value)}
                  placeholder="Paste an image link or Pinterest reference..."
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Customer Details */}
        {step === 6 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Your Contact Information
            </h4>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Singhania"
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143823] uppercase tracking-wider mb-1">
                  Payment Preference
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8DFC8] text-sm bg-white"
                >
                  <option value="Pay on Arrival">Pay on Arrival (Cash / UPI at Venue)</option>
                  <option value="Online">Online Advance (UPI / Card Simulator)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Booking Summary */}
        {step === 7 && (
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#143823]">
              Review & Send Booking Request
            </h4>

            {conflictError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {conflictError}
              </div>
            )}

            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFC8] space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E8DFC8]">
                <div>
                  <span className="text-[#8C8479] uppercase font-bold block">Selected Artist</span>
                  <strong className="text-sm text-[#143823]">{selectedArtist?.name}</strong>
                  <span className="block text-[#7A7369]">{selectedArtist?.location}</span>
                </div>
                <div>
                  <span className="text-[#8C8479] uppercase font-bold block">Service Package</span>
                  <strong className="text-sm text-[#143823]">{selectedService?.name}</strong>
                  <span className="block text-[#7A7369]">{selectedService?.duration}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E8DFC8]">
                <div>
                  <span className="text-[#8C8479] uppercase font-bold block">Date & Time</span>
                  <strong className="text-sm text-[#143823]">{selectedDate}</strong>
                  <span className="block text-[#8C6D38] font-bold">{selectedTimeSlot}</span>
                </div>
                <div>
                  <span className="text-[#8C8479] uppercase font-bold block">Client & People</span>
                  <strong className="text-sm text-[#143823]">{customerName}</strong>
                  <span className="block text-[#7A7369]">{numberOfPeople} Person(s) • {eventType}</span>
                </div>
              </div>

              <div className="pb-3 border-b border-[#E8DFC8]">
                <span className="text-[#8C8479] uppercase font-bold block">Event Venue</span>
                <p className="text-sm text-[#143823] font-medium">{venueAddress}</p>
                {specialRequirements && (
                  <p className="text-[11px] text-[#7A7369] mt-1">Note: {specialRequirements}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[#5C554E]">
                  <span>Service Package Cost:</span>
                  <span>₹{servicePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#5C554E]">
                  <span>Travel & Kit Charge:</span>
                  <span>₹{travelCharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-black text-[#143823] pt-2 border-t border-[#E8DFC8]">
                  <span>Total Payable:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              ℹ️ <strong>Workflow Reminder:</strong> This booking request will initially be <strong>PENDING</strong>. Your artist will review and accept it to become <strong>CONFIRMED</strong>. You will receive an instant in-app notification.
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8DFC8]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-[#5C554E] hover:text-[#143823] flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#143823] hover:bg-[#1C4B30] text-[#F3E5AB] text-xs font-bold shadow-md shadow-[#143823]/20 flex items-center gap-1.5 transition-all"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitBooking}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#143823] via-[#1C4B30] to-[#143823] text-[#F3E5AB] text-xs font-bold shadow-xl shadow-[#143823]/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{submitting ? 'Submitting...' : 'Send Booking Request'}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
