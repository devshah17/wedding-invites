'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

export default function GuestsDashboardPage() {
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRSVPs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rsvp');
      const data = await res.json();
      if (data.success && Array.isArray(data.rsvps)) {
        setRsvps(data.rsvps);
      } else {
        setError(data.error || 'Failed to load guest list');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Could not connect to database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/rsvp')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.rsvps)) {
          setRsvps(data.rsvps);
        } else {
          setError(data.error || 'Failed to load guest list');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError('Could not connect to database. Please try again.');
        setIsLoading(false);
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

  // Compute summary metrics
  const stats = useMemo(() => {
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

    return { totalParties, totalGuests, eventCounts };
  }, [rsvps]);

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

  // CSV Export handler
  const handleExportCSV = () => {
    if (rsvps.length === 0) return;

    const headers = [
      'Guest Name',
      'Mobile Number',
      'Total Attendees',
      'Events Attending',
      'Special Message / Note',
      'Submitted At',
    ];

    const escapeCell = (str: unknown) => {
      if (str === null || str === undefined) return '""';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

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

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Wedding_Guests_RSVP_${new Date().toISOString().slice(0, 10)}.csv`
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

          <Link
            href="/greetings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-antique-gold/40 text-royal-maroon hover:bg-antique-gold/10 transition-colors text-xs font-sans font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span className="hidden sm:inline">Wishes & Advice</span>
          </Link>
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
              Confirmed RSVPs & Attendance
            </h1>
            <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 mt-1">
              Real-time guest tracking and ceremony headcounts for Dev & Vishakha&apos;s wedding
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchRSVPs}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-antique-gold/40 bg-white hover:bg-antique-gold/10 text-royal-maroon transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh List"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={rsvps.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne text-xs sm:text-sm font-sans font-semibold hover:shadow-lg transition-all disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-4 h-4 text-antique-gold" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-antique-gold/40 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Total Guests
              </span>
              <Users className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.totalGuests}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Sum of confirmed attendees
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-antique-gold/30 p-5 shadow-sm">
            <div className="flex items-center justify-between text-antique-gold mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                Parties / Families
              </span>
              <Calendar className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.totalParties}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Unique RSVP submissions
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
              <CheckCircle2 className="w-4 h-4 text-antique-gold" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
              {stats.eventCounts['shubh-aashirwad'] || 0}
            </div>
            <p className="text-[11px] font-sans text-deep-burgundy/60 mt-1">
              Shubh Aashirwad dinner
            </p>
          </div>
        </div>

        {/* Ceremony Breakdown Chips */}
        <div className="bg-white/80 rounded-2xl border border-antique-gold/30 p-4 sm:p-5 mb-8 shadow-xs">
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-3">
            Ceremony Attendance Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {weddingEvents.map((ev) => {
              const count = stats.eventCounts[ev.id] || 0;
              return (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#FCFAF7] border border-antique-gold/25 text-center"
                >
                  <div className="text-xs font-serif font-semibold text-royal-maroon line-clamp-1">
                    {ev.name}
                  </div>
                  <div className="text-lg font-serif font-bold text-royal-maroon mt-0.5">
                    {count}
                  </div>
                  <div className="text-[10px] font-sans text-deep-burgundy/60">
                    guests
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-antique-gold/30 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-burgundy/40" />
            <input
              type="text"
              placeholder="Search by guest name, mobile, or note..."
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

        {/* Guest List Feed */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-antique-gold animate-spin mb-3" />
            <p className="font-serif italic text-sm text-deep-burgundy/70">
              Loading confirmed RSVPs...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center">
            <p className="text-sm font-sans text-red-700 mb-3">{error}</p>
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
              No guests found
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
    </div>
  );
}
