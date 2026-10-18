import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, CheckCircle2, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (search) params.search = search;

    api.getAdminPayments(params)
      .then(res => {
        if (res.success) setPayments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, search]);

  const totalCollected = payments
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalPending = payments
    .filter(p => p.paymentStatus === 'Pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalRefunded = payments
    .filter(p => p.paymentStatus === 'Refunded')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">PAID</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">PENDING</span>;
      case 'Refunded':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">REFUNDED</span>;
      case 'Failed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">FAILED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143823]">
          Platform Payment Records & Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Audit appointment fees, UPI/Razorpay transactions, and customer refunds.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Total Settled (Paid)</span>
          <p className="font-serif text-2xl font-black text-emerald-900 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Pending Invoices</span>
          <p className="font-serif text-2xl font-black text-amber-900 mt-1">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Refunds Handled</span>
          <p className="font-serif text-2xl font-black text-purple-900 mt-1">₹{totalRefunded.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search booking ID, client, or txn ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF7F2] text-[#143823] w-full sm:w-auto"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Payment Table (Prompt Item 28) */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#8C8479] uppercase text-[10px] font-bold">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Artist</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DC]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/80">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#8C6D38]">{p.bookingId}</td>
                  <td className="py-3.5 px-4">
                    <strong className="text-[#143823] block">{p.customerName}</strong>
                    <span className="text-[11px] text-[#7A7369]">{p.customerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#143823]">{p.artistName}</td>
                  <td className="py-3.5 px-4 font-serif font-black text-sm text-[#143823]">₹{p.amount?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-[#7A7369]">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-[#5C554E]">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#8C8479]">{p.transactionId || 'N/A'}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(p.paymentStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
