import React from 'react';
import { BarChart3, TrendingUp, Download, CheckCircle2, ShieldCheck, Users, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminReports() {
  const { toastSuccess } = useToast();

  const handleExportCSV = () => {
    toastSuccess('Appointments & Revenue Report exported as CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
            Platform Performance Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Export aggregated booking metrics, city-level demand, and growth analytics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#143823] text-[#F3E5AB] font-bold text-xs shadow-md shadow-[#143823]/20 flex items-center gap-2 hover:bg-[#1C4B30] transition-all"
        >
          <Download className="w-4 h-4 text-[#D4AF37]" />
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#143823]">
            City-Wise Wedding Demand
          </h3>
          <div className="space-y-3 font-sans text-xs">
            {[
              { city: 'Mumbai', share: 42, rev: '₹4,85,000' },
              { city: 'Jaipur', share: 28, rev: '₹3,20,000' },
              { city: 'Delhi NCR', share: 18, rev: '₹2,10,000' },
              { city: 'Bengaluru', share: 8, rev: '₹95,000' },
              { city: 'Udaipur', share: 4, rev: '₹45,000' }
            ].map(item => (
              <div key={item.city} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="font-bold text-[#143823]">{item.city}</span>
                  <span className="text-[#8C6D38] font-bold">{item.rev} ({item.share}%)</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-[#143823] rounded-full" style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#143823]">
            Key Marketplace Health Ratios
          </h3>
          <div className="space-y-3 text-xs font-sans">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex justify-between items-center">
              <div>
                <strong className="block text-[#143823]">Artist Acceptance Rate</strong>
                <span className="text-[#7A7369]">Proportion of client requests accepted</span>
              </div>
              <span className="font-serif text-xl font-bold text-emerald-800">92.4%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex justify-between items-center">
              <div>
                <strong className="block text-[#143823]">Average Order Value (AOV)</strong>
                <span className="text-[#7A7369]">Bridal package average</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#143823]">₹4,850</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex justify-between items-center">
              <div>
                <strong className="block text-[#143823]">Cancellation Rate</strong>
                <span className="text-[#7A7369]">Under 48hr client rescheduling</span>
              </div>
              <span className="font-serif text-xl font-bold text-blue-800">3.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
