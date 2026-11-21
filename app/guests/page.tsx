'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Download,
  Search,
  Filter,
  Phone,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Check,
  Share2,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { weddingEvents } from '@/config/events';
import { weddingConfig } from '@/config/wedding';
import { deleteRSVPFromStorage } from '@/lib/rsvp-storage';

interface RSVPRecord {
  _id: string;
  guestName: string;
  mobile: string;
  totalAttendees: number;
  eventAttendance: Record<string, boolean>;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvitationRecord {
  _id: string;
  code: string;
  guestName: string;
  events: string[];
  note: string;
  views: number;
  status: 'invited' | 'confirmed';
  createdAt: string;
}

export default function GuestsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'invited' | 'rsvps'>('invited');

  // RSVPs State
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isRsvpsLoading, setIsRsvpsLoading] = useState(true);
  const [rsvpsError, setRsvpsError] = useState('');

  // Invitations State
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [isInvitesLoading, setIsInvitesLoading] = useState(true);
  const [invitesError, setInvitesError] = useState('');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  // Action states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchRSVPs = async () => {
    setIsRsvpsLoading(true);
    setRsvpsError('');
    try {
      const res = await fetch('/api/rsvp');
      const data = await res.json();
      if (data.success && Array.isArray(data.rsvps)) {
        setRsvps(data.rsvps);
      } else {
        setRsvpsError(data.error || 'Failed to load guest list');
      }
    } catch (err: unknown) {
      console.error(err);
      setRsvpsError('Could not connect to database. Please try again.');
    } finally {
      setIsRsvpsLoading(false);
    }
  };

  const fetchInvitations = async () => {
    setIsInvitesLoading(true);
    setInvitesError('');
    try {
      const res = await fetch('/api/invitations');
      const data = await res.json();
      if (data.success && Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      } else {
        setInvitesError(data.error || 'Failed to load invitations');
      }
    } catch (err: unknown) {
      console.error(err);
      setInvitesError('Could not connect to database. Please try again.');
    } finally {
      setIsInvitesLoading(false);
    }
  };

  const refreshAll = () => {
    fetchRSVPs();
    fetchInvitations();
  };

  useEffect(() => {
    let active = true;

    // Fetch RSVPs
    fetch('/api/rsvp')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.rsvps)) {
          setRsvps(data.rsvps);
        } else {
          setRsvpsError(data.error || 'Failed to load guest list');
        }
        setIsRsvpsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setRsvpsError('Could not connect to database.');
        setIsRsvpsLoading(false);
      });

    // Fetch Invitations
    fetch('/api/invitations')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.invitations)) {
          setInvitations(data.invitations);
        } else {
          setInvitesError(data.error || 'Failed to load invitations');
        }
        setIsInvitesLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setInvitesError('Could not connect to database.');
        setIsInvitesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDeleteRSVP = async (id: string, mobile: string) => {
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRsvps((prev) => prev.filter((r) => r._id !== id));
        deleteRSVPFromStorage(mobile);
        setDeletingId(null);
      } else {
        alert(data.error || 'Failed to delete RSVP');
      }
    } catch (err) {
      console.error('Delete RSVP failed:', err);
    }
  };

  const handleDeleteInvitation = async (code: string) => {
    try {
      const res = await fetch(`/api/invitations/${code}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInvitations((prev) => prev.filter((i) => i.code !== code));
        setDeletingId(null);
      } else {
        alert(data.error || 'Failed to delete invitation');
      }
    } catch (err) {
      console.error('Delete invitation failed:', err);
    }
  };

  const getInviteUrl = (code: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/?invite=${encodeURIComponent(code)}`;
    }
    return `/?invite=${encodeURIComponent(code)}`;
  };

  const handleCopyLink = async (code: string) => {
    const url = getInviteUrl(code);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      window.prompt('Copy invitation link:', url);
    }
  };

  const getWhatsAppShareUrl = (invite: InvitationRecord) => {
    const url = getInviteUrl(invite.code);
    const msg = `✨ *Namaste ${invite.guestName}!* ✨\n\nDev & Vishakha cordially invite you to celebrate their wedding.\n\n💌 *Personal note:* "${invite.note}"\n\nPlease view your personalized invitation card and ceremony details here:\n👉 ${url}\n\nWith love & blessings,\n*Dev & Vishakha*`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  // Compute summary metrics
  const stats = useMemo(() => {
    const totalInvited = invitations.length;
    const totalParties = rsvps.length;
    const totalGuests = rsvps.reduce(
      (sum, item) => sum + (Number(item.totalAttendees) || 1),
      0
    );

    // Event breakdowns (guest headcount attending each event)
    const eventCounts: Record<string, number> = {};
    weddingEvents.forEach((ev) => {
      eventCounts[ev.id] = rsvps
        .filter((r) => r.eventAttendance && r.eventAttendance[ev.id] === true)
        .reduce((sum, r) => sum + (Number(r.totalAttendees) || 1), 0);
    });

    return { totalInvited, totalParties, totalGuests, eventCounts };
  }, [invitations, rsvps]);

  // Filtered RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.guestName.toLowerCase().includes(q) ||
        item.mobile.includes(q) ||
        (item.message && item.message.toLowerCase().includes(q));

      const matchesEvent =
        selectedEventFilter === 'all' ||
        (item.eventAttendance && item.eventAttendance[selectedEventFilter] === true);

      return matchesSearch && matchesEvent;
    });
  }, [rsvps, searchQuery, selectedEventFilter]);

  // Filtered Invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.guestName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);

      const matchesEvent =
        selectedEventFilter === 'all' || item.events.includes(selectedEventFilter);

      return matchesSearch && matchesEvent;
    });
  }, [invitations, searchQuery, selectedEventFilter]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (rsvps.length === 0 && invitations.length === 0) return;

    const escapeCell = (str: unknown) => {
      if (str === null || str === undefined) return '""';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

    let csvContent = '';

    if (activeTab === 'rsvps') {
      const headers = [
        'Guest Name',
        'Mobile Number',
        'Total Attendees',
        'Events Attending',
        'Special Message / Note',
        'Submitted At',
      ];

      const rows = rsvps.map((r) => {
        const attendingNames = weddingEvents
          .filter((ev) => r.eventAttendance && r.eventAttendance[ev.id] === true)
          .map((ev) => ev.name)
          .join('; ');

        return [
          escapeCell(r.guestName),
          escapeCell(r.mobile),
          escapeCell(r.totalAttendees),
          escapeCell(attendingNames),
          escapeCell(r.message || ''),
          escapeCell(new Date(r.createdAt).toLocaleString('en-IN')),
        ].join(',');
      });

      csvContent = [headers.join(','), ...rows].join('\r\n');
    } else {
      const headers = [
        'Guest Name',
        'Invite Code',
        'Personalized Link',
        'Invited Ceremonies',
        'Cute Personal Note',
        'Views Count',
        'Status',
        'Created At',
      ];

      const rows = invitations.map((inv) => {
        const ceremonyNames = weddingEvents
          .filter((ev) => inv.events.includes(ev.id))
          .map((ev) => ev.name)
          .join('; ');

        return [
          escapeCell(inv.guestName),
          escapeCell(inv.code),
          escapeCell(getInviteUrl(inv.code)),
          escapeCell(ceremonyNames),
          escapeCell(inv.note),
          escapeCell(inv.views),
          escapeCell(inv.status),
          escapeCell(new Date(inv.createdAt).toLocaleString('en-IN')),
        ].join(',');
      });

      csvContent = [headers.join(','), ...rows].join('\r\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Wedding_${activeTab === 'rsvps' ? 'Confirmed_RSVPs' : 'Invited_Guests'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-royal-maroon relative overflow-x-hidden selection:bg-antique-gold/20">
      {/* Background Subtle Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C99A45_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#FCFAF7]/90 backdrop-blur-md border-b border-antique-gold/30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-royal-maroon hover:text-antique-gold transition-colors text-xs sm:text-sm font-sans font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invitation</span>
          </Link>

          <div className="font-script text-xl sm:text-2xl text-royal-maroon font-bold">
            {weddingConfig.coupleInitials}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-antique-gold/15 border border-antique-gold/50 text-royal-maroon hover:bg-antique-gold/25 transition-colors text-xs font-sans font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5 text-royal-maroon" />
              <span>Admin Studio</span>
            </Link>

            <Link
              href="/greetings"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-antique-gold/40 text-royal-maroon hover:bg-antique-gold/10 transition-colors text-xs font-sans font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
              <span>Wishes</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-antique-gold mb-1">
              <Sparkles className="w-4 h-4 text-antique-gold" />
              <span className="text-xs font-sans tracking-widest uppercase font-semibold text-antique-gold">
                Guest Management Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-royal-maroon">
              Invited Guests &amp; Confirmed RSVPs
            </h1>
            <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 mt-1">
              Track personalized invitations sent, guest status, and ceremony attendance headcounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-royal-maroon via-deep-burgundy to-royal-maroon text-champagne text-xs sm:text-sm font-sans font-semibold hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4 text-antique-gold" />
              <span>+ Create Personalized Invite</span>
            </Link>

            <button
              type="button"
              onClick={refreshAll}
              disabled={isRsvpsLoading || isInvitesLoading}
              className="p-2.5 rounded-xl border border-antique-gold/40 bg-white hover:bg-antique-gold/10 text-royal-maroon transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh All"
            >
              <RefreshCw className={`w-4 h-4 ${(isRsvpsLoading || isInvitesLoading) ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-antique-gold/40 bg-white hover:bg-antique-gold/10 text-royal-maroon text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-antique-gold" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-antique-gold/40 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Total Invited
              </span>
              <Users className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.totalInvited}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Personalized links generated
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-antique-gold/30 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Confirmed Guests
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.totalGuests}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Headcount across {stats.totalParties} {stats.totalParties === 1 ? 'party' : 'parties'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-antique-gold/30 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Hastamelap (Lagna)
              </span>
              <Sparkles className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.eventCounts['hastamelap-lagna'] || 0}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Main wedding ceremony
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-antique-gold/30 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Reception (Aashirwad)
              </span>
              <Calendar className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.eventCounts['shubh-aashirwad'] || 0}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Shubh Aashirwad dinner
            </p>
          </div>
        </div>

        {/* Tab Switcher: Invited Guests vs Confirmed RSVPs */}
        <div className="flex items-center gap-2 mb-6 border-b border-antique-gold/25 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('invited')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'invited'
                ? 'bg-royal-maroon text-champagne shadow-md'
                : 'bg-white text-royal-maroon border border-antique-gold/30 hover:bg-antique-gold/10'
            }`}
          >
            <span>Invited Guests</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'invited' ? 'bg-antique-gold/30 text-champagne' : 'bg-antique-gold/15 text-royal-maroon'
            }`}>
              {invitations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rsvps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'rsvps'
                ? 'bg-royal-maroon text-champagne shadow-md'
                : 'bg-white text-royal-maroon border border-antique-gold/30 hover:bg-antique-gold/10'
            }`}
          >
            <span>Confirmed RSVPs</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'rsvps' ? 'bg-antique-gold/30 text-champagne' : 'bg-antique-gold/15 text-royal-maroon'
            }`}>
              {rsvps.length}
            </span>
          </button>
        </div>

        {/* Search & Ceremony Filter */}
        <div className="bg-white rounded-2xl border border-antique-gold/30 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-burgundy/40" />
            <input
              type="text"
              placeholder={activeTab === 'invited' ? 'Search invited guests, codes, or notes...' : 'Search by name, phone, or note...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FCFAF7] border border-antique-gold/30 text-royal-maroon placeholder-deep-burgundy/40 text-xs sm:text-sm focus:outline-none focus:border-royal-maroon transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-antique-gold shrink-0 hidden sm:inline" />
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FCFAF7] border border-antique-gold/30 text-royal-maroon text-xs sm:text-sm focus:outline-none focus:border-royal-maroon cursor-pointer"
            >
              <option value="all">All Ceremonies</option>
              {weddingEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB 1: INVITED GUESTS */}
        {activeTab === 'invited' && (
          <div>
            {isInvitesLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-8 h-8 text-antique-gold animate-spin mb-3" />
                <p className="font-serif italic text-sm text-deep-burgundy/70">
                  Loading invited guests...
                </p>
              </div>
            ) : invitesError ? (
              <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center">
                <p className="text-sm font-sans text-red-700 mb-3">{invitesError}</p>
                <button
                  type="button"
                  onClick={fetchInvitations}
                  className="px-4 py-2 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-medium"
                >
                  Retry
                </button>
              </div>
            ) : filteredInvitations.length === 0 ? (
              <div className="py-16 text-center bg-white/70 rounded-2xl border border-dashed border-antique-gold/40 p-8">
                <Users className="w-10 h-10 text-antique-gold/50 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-royal-maroon mb-1">
                  No invited guests found
                </h3>
                <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 max-w-sm mx-auto mb-4">
                  {searchQuery || selectedEventFilter !== 'all'
                    ? 'No invited guests match your active search or ceremony filter.'
                    : 'You haven’t created any personalized invitation links yet.'}
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-semibold"
                >
                  <PlusCircle className="w-4 h-4 text-antique-gold" />
                  <span>Generate Your First Invite Link</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredInvitations.map((invite) => {
                    const isCopied = copiedCode === invite.code;
                    const attendingEvents = weddingEvents.filter((ev) =>
                      invite.events.includes(ev.id)
                    );

                    return (
                      <motion.div
                        key={invite._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-antique-gold/30 hover:border-antique-gold/60 p-5 shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Top: Name & Badges */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-serif font-bold text-base sm:text-lg text-royal-maroon">
                                  {invite.guestName}
                                </h3>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                                  {invite.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1 text-xs font-mono text-deep-burgundy/60">
                                <span>Code: {invite.code}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-sans text-[11px]">
                                  <Eye className="w-3 h-3 text-antique-gold" />
                                  <span>{invite.views} {invite.views === 1 ? 'view' : 'views'}</span>
                                </span>
                              </div>
                            </div>

                            {/* Quick Actions: Copy Link & WhatsApp */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(invite.code)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-antique-gold/40 text-royal-maroon hover:bg-antique-gold/15 text-xs font-sans font-semibold transition-colors cursor-pointer"
                                title="Copy personalized invite link"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-antique-gold" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={getWhatsAppShareUrl(invite)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                title="Share on WhatsApp"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Cute Note */}
                          {invite.note && (
                            <div className="my-2.5 p-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/20 text-xs font-serif italic text-deep-burgundy/80">
                              💌 &ldquo;{invite.note}&rdquo;
                            </div>
                          )}

                          {/* Invited Ceremonies */}
                          <div className="my-2.5">
                            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-royal-maroon/70 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-antique-gold" />
                              <span>Invited Ceremonies ({attendingEvents.length}):</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {attendingEvents.map((ev) => (
                                <span
                                  key={ev.id}
                                  className="inline-block px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-antique-gold/10 text-royal-maroon border border-antique-gold/25"
                                >
                                  {ev.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer: Date & Delete */}
                        <div className="mt-3 pt-2.5 border-t border-antique-gold/15 flex items-center justify-between text-[11px] font-sans text-deep-burgundy/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-antique-gold" />
                            <span>{formatDate(invite.createdAt)}</span>
                          </span>

                          <div>
                            {deletingId === invite._id ? (
                              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[11px]">
                                <span className="text-red-700">Delete?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInvitation(invite.code)}
                                  className="text-red-700 font-bold hover:underline cursor-pointer"
                                >
                                  Yes
                                </button>
                                <span className="text-red-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => setDeletingId(null)}
                                  className="text-deep-burgundy/60 hover:underline cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingId(invite._id)}
                                className="p-1 rounded-full text-deep-burgundy/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete invitation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONFIRMED RSVPS */}
        {activeTab === 'rsvps' && (
          <div>
            {isRsvpsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-8 h-8 text-antique-gold animate-spin mb-3" />
                <p className="font-serif italic text-sm text-deep-burgundy/70">
                  Loading confirmed RSVPs...
                </p>
              </div>
            ) : rsvpsError ? (
              <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center">
                <p className="text-sm font-sans text-red-700 mb-3">{rsvpsError}</p>
                <button
                  type="button"
                  onClick={fetchRSVPs}
                  className="px-4 py-2 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-medium"
                >
                  Retry
                </button>
              </div>
            ) : filteredRsvps.length === 0 ? (
              <div className="py-16 text-center bg-white/70 rounded-2xl border border-dashed border-antique-gold/40 p-8">
                <Users className="w-10 h-10 text-antique-gold/50 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-royal-maroon mb-1">
                  No confirmed RSVPs found
                </h3>
                <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 max-w-sm mx-auto">
                  {searchQuery || selectedEventFilter !== 'all'
                    ? 'No responses match your search or filter.'
                    : 'No RSVPs have been submitted yet. Submissions from the main invitation will appear here in real time.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRsvps.map((rsvp, idx) => {
                  const attendingEvents = weddingEvents.filter(
                    (ev) => rsvp.eventAttendance && rsvp.eventAttendance[ev.id] === true
                  );

                  return (
                    <motion.div
                      key={rsvp._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      className="bg-white rounded-2xl border border-antique-gold/30 hover:border-antique-gold/60 p-5 shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-royal-maroon">
                            {rsvp.guestName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`tel:${rsvp.mobile}`}
                              className="inline-flex items-center gap-1 text-xs font-sans text-deep-burgundy/70 hover:text-royal-maroon transition-colors"
                            >
                              <Phone className="w-3 h-3 text-antique-gold" />
                              <span>{rsvp.mobile}</span>
                            </a>
                            <span className="text-deep-burgundy/30">•</span>
                            <a
                              href={`https://wa.me/91${rsvp.mobile.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-sans font-medium text-emerald-700 hover:underline"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold/15 border border-antique-gold/40 text-royal-maroon font-sans font-bold text-xs shrink-0">
                          <Users className="w-3.5 h-3.5 text-antique-gold" />
                          <span>{rsvp.totalAttendees} {rsvp.totalAttendees === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                      </div>

                      {/* Ceremonies Attending */}
                      <div className="my-3">
                        <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-royal-maroon/70 mb-1.5">
                          Attending Ceremonies ({attendingEvents.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {attendingEvents.length > 0 ? (
                            attendingEvents.map((ev) => (
                              <span
                                key={ev.id}
                                className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium bg-[#FCFAF7] border border-antique-gold/30 text-royal-maroon"
                              >
                                {ev.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs font-serif italic text-deep-burgundy/50">
                              No ceremonies selected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Personal Message */}
                      {rsvp.message && (
                        <div className="mt-3 p-3 rounded-xl bg-[#FCFAF7] border border-antique-gold/20 flex items-start gap-2 text-xs font-serif italic text-deep-burgundy/80">
                          <MessageSquare className="w-3.5 h-3.5 text-antique-gold shrink-0 mt-0.5" />
                          <span>&ldquo;{rsvp.message}&rdquo;</span>
                        </div>
                      )}

                      {/* Timestamp & Actions Footer */}
                      <div className="mt-3 pt-2.5 border-t border-antique-gold/15 flex items-center justify-between text-[11px] font-sans text-deep-burgundy/50">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-antique-gold" />
                          <span>{formatDate(rsvp.createdAt)}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-medium">Confirmed</span>

                          {deletingId === rsvp._id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-sans">
                              <span className="text-red-700">Delete?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteRSVP(rsvp._id, rsvp.mobile)}
                                className="text-red-700 font-bold hover:underline cursor-pointer"
                              >
                                Yes
                              </button>
                              <span className="text-red-300">|</span>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="text-deep-burgundy/60 hover:underline cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(rsvp._id)}
                              className="p-1 rounded-full text-deep-burgundy/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete RSVP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
