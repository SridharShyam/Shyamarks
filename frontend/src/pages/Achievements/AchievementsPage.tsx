import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/achievements/AchievementCard';

const ACHIEVEMENT_TYPES = [
  'Certification',
  'Internship',
  'Virtual Experience',
  'Workshop',
  'Course',
  'Competition',
  'Award',
  'Project',
  'Publication',
  'Hackathon',
  'Training',
  'Other',
];

export const AchievementsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [page, setPage] = useState<number>(1);

  // Auxiliary data queries
  const { data: issuers } = useQuery({
    queryKey: ['issuers-list'],
    queryFn: () => api.getIssuers(),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-list'],
    queryFn: () => api.getSkills(),
  });

  // Main paginated achievements query
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements', search, selectedType, selectedIssuer, selectedSkill, selectedYear, featuredOnly, sortBy, page],
    queryFn: () =>
      api.getAchievements({
        search: search || undefined,
        type: selectedType || undefined,
        issuer_id: selectedIssuer || undefined,
        skill_id: selectedSkill || undefined,
        year: selectedYear ? parseInt(selectedYear, 10) : undefined,
        featured: featuredOnly ? true : undefined,
        sort: sortBy,
        page,
        limit: 12,
      }),
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedIssuer('');
    setSelectedSkill('');
    setSelectedYear('');
    setFeaturedOnly(false);
    setSortBy('newest');
    setPage(1);
  };

  const yearsOptions = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Achievement Explorer</h1>
        <p className="text-sm text-slate-400 mt-1">
          Search and filter verified credentials, certifications, hackathons, and learning milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 bg-surface-800/60 border border-surface-700/80 rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between border-b border-surface-700 pb-3">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-brand-400" />
              Filter Evidence
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Achievement Type</label>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Types</option>
              {ACHIEVEMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Issuer Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Issuer / Organization</label>
            <select
              value={selectedIssuer}
              onChange={(e) => { setSelectedIssuer(e.target.value); setPage(1); }}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Issuers</option>
              {issuers?.map((issuer) => (
                <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Associated Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => { setSelectedSkill(e.target.value); setPage(1); }}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Skills</option>
              {skills?.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
              className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Years</option>
              {yearsOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-surface-700">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-200 select-none">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(1); }}
                className="w-4 h-4 rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900"
              />
              <span>Show Featured Only</span>
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-800/40 border border-surface-700/60 rounded-2xl p-4">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by title, description, tag..."
                className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-surface-800/40 border border-surface-700/60 rounded-2xl animate-pulse p-6"></div>
              ))}
            </div>
          ) : achievementsData?.items && achievementsData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievementsData.items.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-800/40 border border-surface-700/60 rounded-2xl p-16 text-center">
              <p className="text-slate-400 text-sm font-medium">No achievements matched your current filters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {achievementsData && achievementsData.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-surface-700/60 pt-6">
              <span className="text-xs text-slate-400">
                Showing Page <strong className="text-slate-200">{achievementsData.page}</strong> of{' '}
                <strong className="text-slate-200">{achievementsData.total_pages}</strong> ({achievementsData.total} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg bg-surface-800 border border-surface-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= achievementsData.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg bg-surface-800 border border-surface-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
