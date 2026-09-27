import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { AchievementCard } from '../../components/achievements/AchievementCard';
import { AchievementCardSkeleton } from '../../components/ui/Skeleton';
import { useDebounce } from '../../hooks/useDebounce';

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

export const AchievementsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const [selectedType, setSelectedType] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

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
    queryKey: ['achievements', debouncedSearch, selectedType, selectedIssuer, selectedSkill, selectedYear, featuredOnly, sortBy, page],
    queryFn: () =>
      api.getAchievements({
        search: debouncedSearch || undefined,
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
    setSearchInput('');
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
        <h1 className="font-heading text-h1 font-bold text-text-primary">Achievement Explorer</h1>
        <p className="text-xs text-text-secondary mt-1 font-sans">
          Search and filter verified credentials, certifications, hackathons, and learning milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 glass-card rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading font-bold text-text-primary flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              Filter Evidence
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-label text-text-secondary">Achievement Type</label>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
              className="w-full bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="">All Types</option>
              {ACHIEVEMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Issuer Filter */}
          <div className="space-y-2">
            <label className="text-label text-text-secondary">Issuer / Organization</label>
            <select
              value={selectedIssuer}
              onChange={(e) => { setSelectedIssuer(e.target.value); setPage(1); }}
              className="w-full bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="">All Issuers</option>
              {issuers?.map((issuer) => (
                <option key={issuer.id} value={issuer.id}>{issuer.name}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="space-y-2">
            <label className="text-label text-text-secondary">Associated Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => { setSelectedSkill(e.target.value); setPage(1); }}
              className="w-full bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="">All Skills</option>
              {skills?.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-label text-text-secondary">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
              className="w-full bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="">All Years</option>
              {yearsOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-text-primary select-none">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(1); }}
                className="w-4 h-4 rounded bg-surface-elevated border-border text-accent focus:ring-accent"
              />
              <span>Show Featured Only</span>
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card rounded-2xl p-4">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                placeholder="Search by title, description, tag..."
                className="w-full bg-surface-elevated border border-border text-text-primary placeholder-text-muted text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <ArrowUpDown className="w-4 h-4 text-text-muted" />
              <span className="text-text-muted font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
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
                <AchievementCardSkeleton key={i} />
              ))}
            </div>
          ) : achievementsData?.items && achievementsData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievementsData.items.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 text-center">
              <p className="text-text-secondary text-sm font-medium">No achievements matched your current filters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {achievementsData && achievementsData.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6">
              <span className="text-xs text-text-muted">
                Showing Page <strong className="text-text-primary">{achievementsData.page}</strong> of{' '}
                <strong className="text-text-primary">{achievementsData.total_pages}</strong> ({achievementsData.total} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg bg-surface-elevated border border-border text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= achievementsData.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg bg-surface-elevated border border-border text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
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
