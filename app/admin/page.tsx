'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Users,
  Eye,
  CheckCircle2,
  Dice5,
  Calendar,
  Share2,
} from 'lucide-react';
import { weddingEvents } from '@/config/events';
import { weddingConfig } from '@/config/wedding';
import { CUTE_INVITATION_NOTES, getRandomCuteNote } from '@/config/cute-notes';

interface InvitationItem {
  _id: string;
  code: string;
  guestName: string;
  events: string[];
  note: string;
  views: number;
  status: 'invited' | 'confirmed';
  createdAt: string;
}

export default function AdminPage() {
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [guestName, setGuestName] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    weddingEvents.forEach((ev) => {
      initial[ev.id] = true; // default all selected
    });
    return initial;
  });
  const [note, setNote] = useState(CUTE_INVITATION_NOTES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Success result states
  const [createdInvite, setCreatedInvite] = useState<InvitationItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Search & Delete states
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/invitations');
      const data = await res.json();
      if (data.success && Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      } else {
        setError(data.error || 'Failed to load invitations');
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
    fetch('/api/invitations')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.invitations)) {
          setInvitations(data.invitations);
        } else {
          setError(data.error || 'Failed to load invitations');
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

  const handleShuffleNote = () => {
    let next = getRandomCuteNote();
    while (next === note && CUTE_INVITATION_NOTES.length > 1) {
      next = getRandomCuteNote();
    }
    setNote(next);
  };

  const handleSelectAllEvents = () => {
    const updated: Record<string, boolean> = {};
    weddingEvents.forEach((ev) => {
      updated[ev.id] = true;
    });
    setSelectedEvents(updated);
  };

  const handleClearAllEvents = () => {
    const updated: Record<string, boolean> = {};
    weddingEvents.forEach((ev) => {
      updated[ev.id] = false;
    });
    setSelectedEvents(updated);
  };

  const toggleEvent = (id: string) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('Please enter guest name');
      return;
    }

    const eventIds = Object.keys(selectedEvents).filter((id) => selectedEvents[id]);
    if (eventIds.length === 0) {
      setFormError('Please select at least one ceremony to invite to');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          events: eventIds,
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.invitation) {
        setCreatedInvite(data.invitation);
        setInvitations((prev) => [data.invitation, ...prev]);
        setGuestName('');
        // generate next fresh note for the next invite
        setNote(getRandomCuteNote());
      } else {
        setFormError(data.error || 'Failed to create invitation');
      }
    } catch (err: unknown) {
      console.error(err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      // fallback
      window.prompt('Copy invitation link:', url);
    }
  };

  const getWhatsAppShareUrl = (invite: InvitationItem) => {
    const url = getInviteUrl(invite.code);
    const msg = `✨ *Namaste ${invite.guestName}!* ✨\n\nDev & Vishakha cordially invite you to grace their wedding celebrations.\n\n💌 *A special note for you:* "${invite.note}"\n\nPlease view your personalized invitation card and ceremony schedule here:\n👉 ${url}\n\nWith love & respect,\n*Dev & Vishakha*`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  const handleDeleteInvitation = async (code: string) => {
    try {
      const res = await fetch(`/api/invitations/${code}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInvitations((prev) => prev.filter((item) => item.code !== code));
        if (createdInvite?.code === code) {
          setCreatedInvite(null);
        }
        setDeletingId(null);
      } else {
        alert(data.error || 'Failed to delete invitation');
      }
    } catch (err) {
      console.error('Delete invitation error:', err);
    }
  };

  const filteredInvitations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return invitations;
    return invitations.filter(
      (item) =>
        item.guestName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
    );
  }, [invitations, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-royal-maroon relative overflow-x-hidden selection:bg-antique-gold/20">
      {/* Background Ornament Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C99A45_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Navigation */}
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
            href="/guests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-antique-gold/40 text-royal-maroon hover:bg-antique-gold/10 transition-colors text-xs font-sans font-medium"
          >
            <Users className="w-3.5 h-3.5 text-antique-gold" />
            <span>Guest Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-10 pb-6 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-antique-gold mb-2">
          <Sparkles className="w-4 h-4 text-antique-gold" />
          <span className="text-xs font-sans tracking-widest uppercase font-semibold text-antique-gold">
            Admin Studio
          </span>
          <Sparkles className="w-4 h-4 text-antique-gold" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-royal-maroon">
          Personalized Invitations &amp; Event Access
        </h1>
        <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 mt-1 max-w-xl mx-auto">
          Create custom wedding invite links with specific ceremony access, cute personalized notes, and 1-click WhatsApp sharing.
        </p>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Form */}
        <section className="lg:col-span-5">
          <div className="sticky top-20 bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-antique-gold/40 p-6 sm:p-7 shadow-xl shadow-antique-gold/10 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-antique-gold/20">
              <div className="w-9 h-9 rounded-full bg-antique-gold/15 flex items-center justify-center text-royal-maroon">
                <LinkIcon className="w-4 h-4 text-antique-gold" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-royal-maroon">
                  Generate Invitation Link
                </h2>
                <p className="text-xs text-deep-burgundy/70 font-sans">
                  Tailored to guest &amp; ceremonies
                </p>
              </div>
            </div>

            {/* Newly Created Invite Banner */}
            <AnimatePresence>
              {createdInvite && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-antique-gold/50 text-royal-maroon shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-emerald-800 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personalized Link Ready for {createdInvite.guestName}!</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-antique-gold/30 text-[11px] font-mono text-deep-burgundy break-all select-all mb-3">
                    {getInviteUrl(createdInvite.code)}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(createdInvite.code)}
                      className="py-2 px-3 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-semibold flex items-center justify-center gap-1.5 hover:bg-deep-burgundy transition-colors cursor-pointer"
                    >
                      {copiedCode === createdInvite.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getWhatsAppShareUrl(createdInvite)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Guest Name */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-1.5">
                  Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul &amp; Priya Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon placeholder-deep-burgundy/40 text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all"
                />
              </div>

              {/* Ceremony Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                    Ceremonies Invited To *
                  </label>
                  <div className="flex items-center gap-2 text-[11px] font-sans">
                    <button
                      type="button"
                      onClick={handleSelectAllEvents}
                      className="text-antique-gold hover:underline font-semibold cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-deep-burgundy/30">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllEvents}
                      className="text-deep-burgundy/60 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {weddingEvents.map((ev) => {
                    const isChecked = !!selectedEvents[ev.id];
                    return (
                      <div
                        key={ev.id}
                        onClick={() => toggleEvent(ev.id)}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-antique-gold/15 border-antique-gold text-royal-maroon font-semibold'
                            : 'bg-[#FCFAF7] border-antique-gold/25 text-deep-burgundy/60 hover:bg-antique-gold/5'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div>{ev.name}</div>
                          <div className="text-[10px] font-sans text-deep-burgundy/60 font-normal">
                            {ev.day}, {ev.startTime}
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-royal-maroon border-royal-maroon text-white'
                              : 'border-antique-gold/40 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cute Note Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon">
                    Cute Personal Note
                  </label>
                  <button
                    type="button"
                    onClick={handleShuffleNote}
                    className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-antique-gold hover:text-royal-maroon transition-colors cursor-pointer"
                    title="Pick another random cute note"
                  >
                    <Dice5 className="w-3 h-3 text-antique-gold" />
                    <span>Shuffle Note</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="A cute message displayed on their personal invite..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon text-xs sm:text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-royal-maroon via-deep-burgundy to-royal-maroon text-champagne font-sans font-semibold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-antique-gold" />
                    <span>Creating Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-antique-gold" />
                    <span>Generate Personalized Invite</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Existing Invitations List */}
        <section className="lg:col-span-7">
          {/* Search Bar & Stats */}
          <div className="bg-white/95 rounded-2xl border border-antique-gold/30 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search invited guests or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-antique-gold/30 text-royal-maroon placeholder-deep-burgundy/40 text-xs sm:text-sm focus:outline-none focus:border-royal-maroon transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchInvitations}
                disabled={isLoading}
                className="p-2 rounded-xl border border-antique-gold/40 bg-white hover:bg-antique-gold/10 text-royal-maroon transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <div className="text-xs font-sans font-semibold text-royal-maroon px-3 py-2 rounded-xl bg-antique-gold/15 border border-antique-gold/30 whitespace-nowrap">
                {invitations.length} {invitations.length === 1 ? 'Invite' : 'Invites'}
              </div>
            </div>
          </div>

          {/* Invitations List */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-8 h-8 text-antique-gold animate-spin mb-3" />
              <p className="font-serif italic text-sm text-deep-burgundy/70">
                Loading personalized invitations...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
              <p className="text-sm font-sans text-red-700 mb-3">{error}</p>
              <button
                type="button"
                onClick={fetchInvitations}
                className="px-4 py-2 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-medium hover:bg-deep-burgundy"
              >
                Retry
              </button>
            </div>
          ) : filteredInvitations.length === 0 ? (
            <div className="py-16 text-center bg-white/60 rounded-2xl border border-dashed border-antique-gold/40 p-8">
              <LinkIcon className="w-10 h-10 text-antique-gold/50 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-royal-maroon mb-1">
                No invitations created yet
              </h3>
              <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 max-w-sm mx-auto">
                Use the form on the left to create your first personalized invitation link with specific ceremony access!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
                      className="bg-white rounded-2xl border border-antique-gold/30 hover:border-antique-gold/60 p-5 shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-bold text-base sm:text-lg text-royal-maroon">
                              {invite.guestName}
                            </h3>
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                              {invite.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-xs font-mono text-deep-burgundy/70">
                            <span>Code: {invite.code}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[11px] font-sans">
                              <Eye className="w-3 h-3 text-antique-gold" />
                              <span>{invite.views} {invite.views === 1 ? 'view' : 'views'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Actions: Copy & WhatsApp */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(invite.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-antique-gold/40 text-royal-maroon hover:bg-antique-gold/15 text-xs font-sans font-semibold transition-colors cursor-pointer"
                            title="Copy link"
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

                          {deletingId === invite._id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-lg text-[10px] font-sans">
                              <span className="text-red-700">Del?</span>
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
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(invite._id)}
                              className="p-1.5 rounded-lg text-deep-burgundy/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete invitation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cute Note Quote */}
                      {invite.note && (
                        <div className="my-2.5 p-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/20 text-xs font-serif italic text-deep-burgundy/80">
                          💌 &ldquo;{invite.note}&rdquo;
                        </div>
                      )}

                      {/* Ceremonies List */}
                      <div className="mt-2.5 pt-2 border-t border-antique-gold/15">
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
