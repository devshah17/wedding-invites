'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Send,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Quote,
  Users,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

interface GreetingItem {
  _id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  createdAt: string;
}

const RELATIONSHIP_OPTIONS = [
  'All',
  'Family',
  'Friend of Groom',
  'Friend of Bride',
  'Colleague',
  'Well Wisher',
];

const FORM_RELATIONSHIPS = [
  'Family',
  'Friend of Groom',
  'Friend of Bride',
  'Colleague',
  'Well Wisher',
];

export default function GreetingsPage() {
  const [greetings, setGreetings] = useState<GreetingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGreetings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/greetings');
      const data = await res.json();
      if (data.success && Array.isArray(data.greetings)) {
        setGreetings(data.greetings);
      } else {
        setError(data.error || 'Failed to load greetings');
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
    fetch('/api/greetings')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.greetings)) {
          setGreetings(data.greetings);
        } else {
          setError(data.error || 'Failed to load greetings');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!message.trim()) {
      setFormError('Please share your blessings or advice');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.greeting) {
        setGreetings((prev) => [data.greeting, ...prev]);
        setName('');
        setMessage('');
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 5000);
      } else {
        setFormError(data.error || 'Failed to submit greeting');
      }
    } catch (err: unknown) {
      console.error(err);
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedMap[id]) return; // Avoid multiple clicks in one session

    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setGreetings((prev) =>
      prev.map((g) => (g._id === id ? { ...g, likes: (g.likes || 0) + 1 } : g))
    );

    try {
      await fetch(`/api/greetings/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleDeleteGreeting = async (id: string) => {
    try {
      const res = await fetch(`/api/greetings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setGreetings((prev) => prev.filter((g) => g._id !== id));
        setDeletingId(null);
      } else {
        alert(data.error || 'Failed to delete greeting');
      }
    } catch (err) {
      console.error('Delete greeting failed:', err);
    }
  };

  const filteredGreetings = useMemo(() => {
    return greetings.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilter === 'All' || item.relationship === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [greetings, searchQuery, selectedFilter]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-royal-maroon relative overflow-x-hidden selection:bg-antique-gold/20">
      {/* Background Ornate Texture Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C99A45_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Banner & Navigation */}
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
            <span className="hidden sm:inline">Guest List</span>
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-antique-gold mb-3">
            <Sparkles className="w-4 h-4 text-antique-gold" />
            <span className="text-xs font-sans tracking-widest uppercase font-semibold text-antique-gold">
              Advice & Sacred Wishes
            </span>
            <Sparkles className="w-4 h-4 text-antique-gold" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-royal-maroon tracking-tight">
            Blessings for {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName}
          </h1>

          <p className="mt-3 text-sm sm:text-base font-serif italic text-deep-burgundy/80 max-w-xl mx-auto">
            &ldquo;May your love grow deeper with each passing season.&rdquo; Leave your warm words, loving advice, or auspicious blessings for the happy couple!
          </p>

          <DecorativeDivider variant="ornate" className="my-6 max-w-md mx-auto" />
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Post Wish Form */}
        <section className="lg:col-span-5">
          <div className="sticky top-20 bg-white/95 rounded-2xl border-2 border-antique-gold/40 p-6 sm:p-7 shadow-xl shadow-antique-gold/5 relative overflow-hidden">
            {/* Subtle corner ornament */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-antique-gold/15 to-transparent rounded-bl-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-antique-gold/20">
              <div className="w-9 h-9 rounded-full bg-antique-gold/15 flex items-center justify-center text-royal-maroon">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-royal-maroon">
                  Share Your Blessings
                </h2>
                <p className="text-xs text-deep-burgundy/70 font-sans">
                  Your words will be cherished forever
                </p>
              </div>
            </div>

            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your heartfelt blessings have been shared with the couple.</span>
              </motion.div>
            )}

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Uncle, Priya & Family"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon placeholder-deep-burgundy/40 text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all cursor-pointer"
                >
                  {FORM_RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5">
                  Blessing / Marriage Advice *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share a sweet memory, congratulations, or golden advice for a blissful marriage..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon placeholder-deep-burgundy/40 text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-royal-maroon via-deep-burgundy to-royal-maroon text-champagne font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-royal-maroon/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-antique-gold" />
                    <span>Sending Blessings...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-antique-gold" />
                    <span>Post Your Blessings</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Greetings Feed */}
        <section className="lg:col-span-7">
          {/* Controls: Search & Filter */}
          <div className="bg-white/95 rounded-2xl border border-antique-gold/30 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-deep-burgundy/40" />
              <input
                type="text"
                placeholder="Search wishes or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FCFAF7] border border-antique-gold/30 text-royal-maroon placeholder-deep-burgundy/40 text-xs sm:text-sm focus:outline-none focus:border-royal-maroon transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-antique-gold shrink-0 hidden sm:inline" />
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedFilter(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all ${
                    selectedFilter === opt
                      ? 'bg-royal-maroon text-champagne shadow-xs'
                      : 'bg-[#FCFAF7] text-deep-burgundy/70 border border-antique-gold/30 hover:border-antique-gold'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Content */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-8 h-8 text-antique-gold animate-spin mb-3" />
              <p className="font-serif italic text-sm text-deep-burgundy/70">
                Gathering sacred blessings...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
              <p className="text-sm font-sans text-red-700 mb-3">{error}</p>
              <button
                type="button"
                onClick={fetchGreetings}
                className="px-4 py-2 rounded-xl bg-royal-maroon text-champagne text-xs font-sans font-medium hover:bg-deep-burgundy transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredGreetings.length === 0 ? (
            <div className="py-16 text-center bg-white/60 rounded-2xl border border-dashed border-antique-gold/40 p-8">
              <Sparkles className="w-10 h-10 text-antique-gold/50 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-royal-maroon mb-1">
                No wishes found
              </h3>
              <p className="text-xs sm:text-sm font-sans text-deep-burgundy/70 max-w-sm mx-auto">
                {searchQuery || selectedFilter !== 'All'
                  ? 'No greetings match your active search or filter.'
                  : 'Be the very first one to shower your sacred blessings and advice upon Dev & Vishakha!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredGreetings.map((item, index) => {
                  const isLiked = likedMap[item._id];
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      className="group bg-white rounded-2xl border border-antique-gold/30 hover:border-antique-gold/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {/* Top Bar: Name, Relationship & Date */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-royal-maroon">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-antique-gold/15 text-royal-maroon border border-antique-gold/30">
                              {item.relationship}
                            </span>
                            <span className="text-[11px] font-sans text-deep-burgundy/50">
                              • {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Quote icon watermark */}
                        <Quote className="w-6 h-6 text-antique-gold/20 shrink-0" />
                      </div>

                      {/* Message Content */}
                      <p className="font-serif text-sm sm:text-base text-deep-burgundy/85 leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>

                      {/* Footer: Like & Delete Actions */}
                      <div className="mt-4 pt-3 border-t border-antique-gold/15 flex items-center justify-between">
                        <span className="text-[11px] font-serif italic text-antique-gold">
                          Auspicious Wishes
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLike(item._id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                              isLiked
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'text-deep-burgundy/70 hover:text-rose-600 hover:bg-rose-50/60'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                                isLiked ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                            <span>{item.likes || 0}</span>
                          </button>

                          {deletingId === item._id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-sans">
                              <span className="text-red-700">Delete?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteGreeting(item._id)}
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
                              onClick={() => setDeletingId(item._id)}
                              className="p-1 rounded-full text-deep-burgundy/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete greeting"
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
        </section>
      </main>
    </div>
  );
}
