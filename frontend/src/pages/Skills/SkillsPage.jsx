import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { SkillCard } from '../../components/skills/SkillCard';
import { SkillCardSkeleton } from '../../components/ui/Skeleton';
import { useDebounce } from '../../hooks/useDebounce';

export const SkillsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills-page'],
    queryFn: () => api.getSkills(),
  });

  const categories = useMemo(() => {
    if (!skills) return [];
    const set = new Set();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
      const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [skills, debouncedSearch, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-h1 font-bold text-text-primary flex items-center gap-3">
          <Layers className="w-8 h-8 text-accent" />
          Verified Skills & CCS Index
        </h1>
        <p className="text-xs text-text-secondary mt-1 max-w-3xl font-sans">
          Claim Confidence Score (CCS) is a real-time 0–100 rating algorithmically calculated based on evidence breadth (certifications, projects, experiences) and recency.
        </p>
      </div>

      {/* Top Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search skills by keyword..."
            className="w-full bg-surface-elevated border border-border text-text-primary placeholder-text-muted text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <Filter className="w-4 h-4 text-text-muted" />
          <span className="text-text-muted font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-elevated border border-border text-text-primary text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-text-secondary text-sm font-sans">No skills found matching your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};
