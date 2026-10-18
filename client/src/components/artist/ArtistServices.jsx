import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Clock, Check, Plus, Edit3, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ArtistServices() {
  const { artistProfile } = useAuth();
  const { toastSuccess, toastInfo } = useToast();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.getServices()
      .then(res => {
        if (res.success) setServices(res.data);
      })
      .catch(console.error);
  }, []);

  const handleToggleHomeService = () => {
    toastSuccess('Home service preference updated!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            My Offered Services
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Manage the mehndi packages, hourly rates, and durations available for booking.
          </p>
        </div>

        <button
          onClick={() => toastInfo('Service catalog synced with platform database.')}
          className="px-4 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md"
        >
          Sync Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(srv => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/30 text-[10px] font-bold text-[#143823]">
                  {srv.category}
                </span>
                <span className="text-xs font-semibold text-[#8C6D38] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {srv.duration}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#143823]">
                {srv.name}
              </h3>
              <p className="text-xs text-[#6B645C] leading-relaxed">
                {srv.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EFE9DC] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8C8479] uppercase font-bold block">Base Rate</span>
                <span className="font-serif text-xl font-bold text-[#143823]">
                  ₹{srv.basePrice?.toLocaleString('en-IN')}
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active in Profile
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
