'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Heart,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Quote,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

interface GreetingItem {
  _id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  createdAt: string;
}

const RELATIONSHIPS = [
  'Family',
  'Friend of Groom',
  'Friend of Bride',
  'Colleague',
  'Well Wisher',
];

export function GreetingsSection() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [recentGreetings, setRecentGreetings] = useState<GreetingItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/greetings')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.greetings)) {
          setRecentGreetings(data.greetings.slice(0, 3));
          setTotalCount(data.greetings.length);
        }
      })
      .catch((err) => {
        console.error('Error fetching greetings preview:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please write your wishes or advice for the couple');
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
        setName('');
        setMessage('');
        setSubmitSuccess(true);
        setRecentGreetings((prev) => [data.greeting, ...prev.slice(0, 2)]);
        setTotalCount((prev) => prev + 1);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to submit wishes');
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setRecentGreetings((prev) =>
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
        setRecentGreetings((prev) => prev.filter((g) => g._id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        setDeletingId(null);
      } else {
        alert(data.error || 'Failed to delete greeting');
      }
    } catch (err) {
      console.error('Delete greeting failed:', err);
    }
  };

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
    <section
      id="wishes"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FCFAF7] via-[#FFFDF9] to-[#FAF6F0] overflow-hidden border-t border-antique-gold/25"
    >
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-antique-gold/10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10">
        <SectionReveal direction="up">
          {/* Section Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center space-x-2 text-antique-gold mb-2">
              <Sparkles className="w-4 h-4 text-antique-gold" />
              <span className="font-sans text-xs tracking-widest uppercase font-semibold text-antique-gold">
                Heartfelt Blessings & Advice
              </span>
              <Sparkles className="w-4 h-4 text-antique-gold" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-royal-maroon font-bold tracking-tight">
              Wishes for {weddingConfig.groom.firstName} &amp; {weddingConfig.bride.firstName}
            </h2>

            <DecorativeDivider variant="ornate" className="my-5 max-w-sm mx-auto" />

            <p className="text-sm sm:text-base font-serif italic text-deep-burgundy/80 max-w-lg mx-auto">
              Share your sacred blessings, cherished words of wisdom, or loving advice directly with the couple as they begin their sacred journey.
            </p>
          </div>

          {/* Direct Greetings Textbox & Form Card on the Page */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-antique-gold/40 p-6 sm:p-8 shadow-xl shadow-antique-gold/10 relative overflow-hidden mb-12">
            {/* Corner Decorative Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-antique-gold/15 to-transparent rounded-bl-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-antique-gold/20">
              <div className="w-10 h-10 rounded-full bg-antique-gold/15 border border-antique-gold/30 flex items-center justify-center text-royal-maroon">
                <MessageSquare className="w-5 h-5 text-antique-gold" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-royal-maroon">
                  Write Your Blessing or Marriage Advice
                </h3>
                <p className="text-xs text-deep-burgundy/70 font-sans">
                  Your greetings will be preserved forever for Dev &amp; Vishakha
                </p>
              </div>
            </div>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-sans flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your heartfelt blessings have been shared with the couple.</span>
              </motion.div>
            )}

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Uncle, Priya & Family"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon placeholder-deep-burgundy/40 text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all"
                  />
                </div>

                {/* Relationship Selector */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5">
                    Your Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all cursor-pointer"
                  >
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DIRECT GREETINGS TEXTBOX */}
              <div>
                <label className="block text-xs font-sans font-semibold text-royal-maroon uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Your Greetings, Wishes or Advice *</span>
                  <span className="text-[11px] font-normal text-deep-burgundy/60 lowercase">
                    {message.length}/1000
                  </span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your sacred blessings, cherished memories, or golden advice for a blissful and loving marriage..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF7] border border-antique-gold/40 text-royal-maroon placeholder-deep-burgundy/40 text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs font-serif italic text-antique-gold">
                  Om Shanti • Aashirwad &amp; Prem
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-royal-maroon via-deep-burgundy to-royal-maroon text-champagne font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-royal-maroon/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-antique-gold" />
                      <span>Sending Wishes...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-antique-gold" />
                      <span>Send Your Blessings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Blessings Feed on the Main Page */}
          {recentGreetings.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-antique-gold fill-antique-gold" />
                  <h3 className="font-serif font-bold text-lg text-royal-maroon">
                    Recent Wishes from Loved Ones
                  </h3>
                </div>

                <Link
                  href="/greetings"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-royal-maroon hover:text-antique-gold transition-colors"
                >
                  <span>View All {totalCount > 0 ? `(${totalCount})` : ''}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimatePresence>
                  {recentGreetings.map((item) => {
                    const isLiked = likedMap[item._id];
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-antique-gold/30 p-5 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="font-serif font-bold text-sm text-royal-maroon line-clamp-1">
                                {item.name}
                              </div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-antique-gold/15 text-royal-maroon border border-antique-gold/25">
                                {item.relationship}
                              </span>
                            </div>
                            <Quote className="w-4 h-4 text-antique-gold/25 shrink-0" />
                          </div>

                          <p className="font-serif text-xs text-deep-burgundy/80 italic leading-relaxed line-clamp-3 mt-2">
                            &ldquo;{item.message}&rdquo;
                          </p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-antique-gold/15 flex items-center justify-between text-[11px]">
                          <span className="text-deep-burgundy/50 font-sans">
                            {formatDate(item.createdAt)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleLike(item._id)}
                              className={`flex items-center gap-1 text-xs font-sans transition-colors cursor-pointer ${
                                isLiked ? 'text-rose-600' : 'text-deep-burgundy/60 hover:text-rose-600'
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isLiked ? 'fill-rose-500 text-rose-500' : ''
                                }`}
                              />
                              <span>{item.likes || 0}</span>
                            </button>

                            {deletingId === item._id ? (
                              <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full text-[10px] font-sans">
                                <span className="text-red-700">Del?</span>
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
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingId(item._id)}
                                className="p-0.5 rounded-full text-deep-burgundy/40 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete greeting"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/greetings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-antique-gold/40 bg-white/80 hover:bg-antique-gold/10 text-royal-maroon text-xs sm:text-sm font-sans font-semibold transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Explore All Blessings &amp; Advice Wall</span>
                  <ArrowRight className="w-3.5 h-3.5 text-antique-gold" />
                </Link>
              </div>
            </div>
          )}
        </SectionReveal>
      </div>
    </section>
  );
}

export default GreetingsSection;
