import React, { useState, useEffect } from 'react';
import { Heart, Search, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../common/EmptyState';

export default function UserFavorites({ onNavigate, onOpenBooking }) {
  const { user } = useAuth();
  const { toastInfo } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    if (!user) return;
    setLoading(true);
    api.getUserFavorites(user.id)
      .then(res => {
        if (res.success) setFavorites(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (designId) => {
    if (!user) return;
    try {
      await api.toggleFavorite(user.id, designId);
      toastInfo('Removed from favorites');
      setFavorites(prev => prev.filter(d => d.id !== designId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          My Favorite Designs
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Saved henna inspirations for your upcoming ceremony consultations.
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorite designs saved yet"
          description="Browse our heirloom and modern mehndi gallery and tap the heart icon to save patterns here."
          icon={Heart}
          actionText="Browse Design Gallery"
          onAction={() => onNavigate('user-designs')}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(design => (
            <div
              key={design.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img src={design.imageUrl} alt={design.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveFavorite(design.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                  title="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-xs text-[#143823] truncate">{design.title}</h4>
                <p className="text-[10px] text-[#7A7369]">{design.category} • by {design.artistName}</p>
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full py-1.5 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/50 text-[#143823] text-xs font-bold hover:bg-[#143823] hover:text-[#F3E5AB] transition-colors"
                >
                  Book This Style
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
