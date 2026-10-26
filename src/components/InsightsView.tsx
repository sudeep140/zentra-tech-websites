import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar, ArrowRight, User, X } from 'lucide-react';
import { ARTICLES_DATA } from '../data/mockData.js';
import { ArticleItem } from '../types/index.js';
import { fetchArticlesApi } from '../utils/api.js';
import { getAssetUrl, handleImageFallback } from '../utils/assets.js';

export const InsightsView: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>(ARTICLES_DATA);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    fetchArticlesApi()
      .then((data) => {
        if (data && data.length > 0) {
          setArticles(data);
        }
      })
      .catch(() => {
        // Keeps fallback
      });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          THOUGHT LEADERSHIP
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Insights & Articles
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
          Perspectives on 3D spatial computing, autonomous AI interfaces, modern typography, and product design.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group cursor-pointer rounded-2xl bg-[#090e1e]/90 border border-white/[0.08] hover:border-cyan-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-lg shadow-black/40"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                <img
                  src={getAssetUrl(article.image)}
                  alt={article.title}
                  onError={(e) => handleImageFallback(e)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
                  {article.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {article.author}
              </span>
              <span className="font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Selected Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full rounded-3xl bg-[#090e1f] border border-cyan-500/30 p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-white/[0.06] pb-4">
              <span>By {selectedArticle.author}</span>
              <span>·</span>
              <span>{selectedArticle.date}</span>
              <span>·</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={getAssetUrl(selectedArticle.image)}
                alt={selectedArticle.title}
                onError={(e) => handleImageFallback(e)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm text-slate-200 leading-relaxed space-y-4">
              <p className="text-base text-slate-300 font-medium italic">
                {selectedArticle.excerpt}
              </p>
              <p>
                {selectedArticle.content ||
                  'Enterprise software demands craft that matches its computational complexity. When building flagship platforms, real-time feedback loops and 3D spatial depth convey subconscious indicators of reliability, precision, and engineering discipline.'}
              </p>
              <p>
                As browsers evolve to natively support compute shaders and hardware-accelerated WebGPU workloads, digital agencies must evolve beyond static rectangular grids to deliver tactile, interactive storytelling.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
