import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Search, TrendingUp, ShieldCheck, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { SkillCard } from '../../components/skills/SkillCard';

export const SkillsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills-page'],
    queryFn: () => api.getSkills(),
  });

  const categories = useMemo(() => {
    if (!skills) return [];
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        (skill.description && skill.description.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [skills, search, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-brand-400" />
          Verified Skills & CCS Index
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Claim Confidence Score (CCS) is a real-time 0–100 rating algorithmically calculated based on evidence breadth (certifications, projects, experiences) and recency.
        </p>
      </div>

      {/* Top Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-800/40 border border-surface-700/60 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by keyword..."
            className="w-full bg-surface-900 border border-surface-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-900 border border-surface-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
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
            <div key={i} className="h-56 bg-surface-800/40 border border-surface-700/60 rounded-2xl animate-pulse p-6"></div>
          ))}
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-800/40 border border-surface-700/60 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-sm">No skills found matching your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};
