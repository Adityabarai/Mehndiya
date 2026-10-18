import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Components
import Hero from './components/public/Hero';
import PopularServices from './components/public/PopularServices';
import FeaturedArtists from './components/public/FeaturedArtists';
import FeaturedDesigns from './components/public/FeaturedDesigns';
import HowItWorks from './components/public/HowItWorks';
import WhyChooseUs from './components/public/WhyChooseUs';
import CustomerReviews from './components/public/CustomerReviews';
import FaqSection from './components/public/FaqSection';
import CtaBanner from './components/public/CtaBanner';
import ArtistListingPage from './components/public/ArtistListingPage';
import ArtistProfilePage from './components/public/ArtistProfilePage';
import DesignGalleryPage from './components/public/DesignGalleryPage';
import ServicesPage from './components/public/ServicesPage';
import About from './components/About';
import ContactPage from './components/public/ContactPage';
import LoginPage from './components/public/LoginPage';
import RegisterPage from './components/public/RegisterPage';
import BookingWizardModal from './components/public/BookingWizardModal';

// Customer Panel Components
import UserLayout from './components/user/UserLayout';
import UserDashboard from './components/user/UserDashboard';
import UserAppointments from './components/user/UserAppointments';
import UserFavorites from './components/user/UserFavorites';
import UserProfile from './components/user/UserProfile';
import UserNotifications from './components/user/UserNotifications';

// Artist Panel Components
import ArtistLayout from './components/artist/ArtistLayout';
import ArtistDashboard from './components/artist/ArtistDashboard';
import ArtistAppointments from './components/artist/ArtistAppointments';
import ArtistCalendar from './components/artist/ArtistCalendar';
import ArtistAvailability from './components/artist/ArtistAvailability';
import ArtistServices from './components/artist/ArtistServices';
import ArtistDesigns from './components/artist/ArtistDesigns';
import ArtistReviews from './components/artist/ArtistReviews';
import ArtistEarnings from './components/artist/ArtistEarnings';
import ArtistProfile from './components/artist/ArtistProfile';

// Admin Panel Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminArtists from './components/admin/AdminArtists';
import AdminAppointments from './components/admin/AdminAppointments';
import AdminServices from './components/admin/AdminServices';
import AdminDesigns from './components/admin/AdminDesigns';
import AdminPayments from './components/admin/AdminPayments';
import AdminReports from './components/admin/AdminReports';

function MainApp() {
  const { user, isAuthenticated, isAdmin, isArtist, isUser } = useAuth();
  const { toastError, toastInfo } = useToast();

  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});

  // Global Booking Wizard Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedArtist, setPreselectedArtist] = useState(null);
  const [initialBookingParams, setInitialBookingParams] = useState(null);

  // Navigate helper with smooth scroll to top
  const handleNavigate = (view, params = {}) => {
    setViewParams(params);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (service = null, artist = null, initialParams = null) => {
    setPreselectedService(service);
    setPreselectedArtist(artist);
    setInitialBookingParams(initialParams);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedService(null);
    setPreselectedArtist(null);
    setInitialBookingParams(null);
  };

  // Protected Route Guards
  useEffect(() => {
    // If route starts with user- and user is not authenticated
    if (currentView.startsWith('user-') && !isAuthenticated) {
      toastInfo('Please login to access your customer dashboard');
      setCurrentView('login');
      return;
    }

    // Artist Route Protection
    if (currentView.startsWith('artist-')) {
      if (!isAuthenticated) {
        toastInfo('Please login with an artist account');
        setCurrentView('login');
        return;
      }
      if (!isArtist && !isAdmin) {
        toastError('Access denied: You must be an artist to view this portal');
        setCurrentView('user-dashboard');
        return;
      }
    }

    // Admin Route Protection
    if (currentView.startsWith('admin-')) {
      if (!isAuthenticated) {
        toastInfo('Admin authentication required');
        setCurrentView('login');
        return;
      }
      if (!isAdmin) {
        toastError('Access denied: Administrator privileges required');
        if (isArtist) setCurrentView('artist-dashboard');
        else setCurrentView('user-dashboard');
        return;
      }
    }
  }, [currentView, isAuthenticated, isAdmin, isArtist]);

  // Determine which layout to wrap
  const isCustomerPanel = currentView.startsWith('user-');
  const isArtistPanel = currentView.startsWith('artist-');
  const isAdminPanel = currentView.startsWith('admin-');

  // Customer Panel View Router
  if (isCustomerPanel) {
    return (
      <UserLayout currentView={currentView} onNavigate={handleNavigate}>
        {currentView === 'user-dashboard' && (
          <UserDashboard onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'user-artists' && (
          <ArtistListingPage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onSelectArtist={art => setPreselectedArtist(art)}
          />
        )}
        {currentView === 'user-designs' && (
          <DesignGalleryPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'user-services' && (
          <ServicesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'user-appointments' && (
          <UserAppointments onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'user-favorites' && (
          <UserFavorites onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'user-profile' && <UserProfile />}
        {currentView === 'user-notifications' && (
          <UserNotifications onNavigate={handleNavigate} />
        )}

        <BookingWizardModal
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          preselectedService={preselectedService}
          preselectedArtist={preselectedArtist}
          initialParams={initialBookingParams}
        />
      </UserLayout>
    );
  }

  // Artist Panel View Router
  if (isArtistPanel) {
    return (
      <ArtistLayout currentView={currentView} onNavigate={handleNavigate}>
        {currentView === 'artist-dashboard' && (
          <ArtistDashboard onNavigate={handleNavigate} />
        )}
        {currentView === 'artist-appointments' && <ArtistAppointments />}
        {currentView === 'artist-calendar' && <ArtistCalendar />}
        {currentView === 'artist-availability' && <ArtistAvailability />}
        {currentView === 'artist-services' && <ArtistServices />}
        {currentView === 'artist-designs' && <ArtistDesigns />}
        {currentView === 'artist-reviews' && <ArtistReviews />}
        {currentView === 'artist-earnings' && <ArtistEarnings />}
        {currentView === 'artist-profile' && <ArtistProfile />}
        {currentView === 'artist-notifications' && (
          <UserNotifications onNavigate={handleNavigate} />
        )}
      </ArtistLayout>
    );
  }

  // Admin Panel View Router
  if (isAdminPanel) {
    return (
      <AdminLayout currentView={currentView} onNavigate={handleNavigate}>
        {currentView === 'admin-dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
        {currentView === 'admin-users' && <AdminUsers />}
        {currentView === 'admin-artists' && <AdminArtists />}
        {currentView === 'admin-appointments' && <AdminAppointments />}
        {currentView === 'admin-services' && <AdminServices />}
        {currentView === 'admin-designs' && <AdminDesigns />}
        {currentView === 'admin-payments' && <AdminPayments />}
        {currentView === 'admin-reports' && <AdminReports />}
        {currentView === 'admin-notifications' && (
          <UserNotifications onNavigate={handleNavigate} />
        )}
      </AdminLayout>
    );
  }

  // Public Website View Router
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans text-[#2D2A26]">
      {/* Top Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        currentView={currentView}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Public Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
            <PopularServices onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
            <FeaturedArtists
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenBooking}
              onSelectArtist={art => setPreselectedArtist(art)}
            />
            <FeaturedDesigns onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
            <HowItWorks onOpenBooking={handleOpenBooking} />
            <WhyChooseUs />
            <CustomerReviews />
            <FaqSection />
            <CtaBanner onOpenBooking={handleOpenBooking} onNavigate={handleNavigate} />
          </>
        )}

        {currentView === 'artists' && (
          <ArtistListingPage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onSelectArtist={art => setPreselectedArtist(art)}
          />
        )}

        {currentView === 'artist-detail' && (
          <ArtistProfilePage
            artistId={viewParams?.artistId || 'art-1'}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'designs' && (
          <DesignGalleryPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}

        {currentView === 'services' && (
          <ServicesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />
        )}

        {currentView === 'about' && (
          <div>
            <About />
          </div>
        )}

        {currentView === 'contact' && (
          <ContactPage onOpenBooking={handleOpenBooking} />
        )}

        {currentView === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentView === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />

      {/* Multi-Step Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedService={preselectedService}
        preselectedArtist={preselectedArtist}
        initialParams={initialBookingParams}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
