import React, { useMemo } from 'react';
import { Achievement } from '../../types';

interface TimelineHeatmapProps {
  achievements: Achievement[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const TimelineHeatmap: React.FC<TimelineHeatmapProps> = ({ achievements }) => {
  const { monthGrid, startYear, endYear } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let minYear = currentYear - 2;
    let maxYear = currentYear;

    achievements.forEach((ach) => {
      if (ach.issued_date) {
        const year = parseInt(ach.issued_date.substring(0, 4), 10);
        if (!isNaN(year)) {
          if (year < minYear) minYear = year;
          if (year > maxYear) maxYear = year;
        }
      }
    });

    const grid: { key: string; year: number; month: number; count: number; monthName: string }[] = [];
    const counts: Record<string, number> = {};

    achievements.forEach((ach) => {
      if (ach.issued_date) {
        const key = ach.issued_date.substring(0, 7); // "YYYY-MM"
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    for (let y = minYear; y <= maxYear; y++) {
      for (let m = 0; m < 12; m++) {
        const monthStr = String(m + 1).padStart(2, '0');
        const key = `${y}-${monthStr}`;
        grid.push({
          key,
          year: y,
          month: m,
          count: counts[key] || 0,
          monthName: MONTH_NAMES[m],
        });
      }
    }

    return { monthGrid: grid, startYear: minYear, endYear: maxYear };
  }, [achievements]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-surface-700/40 border border-surface-600/30';
    if (count === 1) return 'bg-brand-500/30 border border-brand-500/40 text-brand-200';
    if (count === 2) return 'bg-brand-500/60 border border-brand-500/70 text-brand-100';
    if (count === 3) return 'bg-brand-500 border border-brand-400 text-white';
    return 'bg-brand-400 border border-brand-300 text-white shadow-sm shadow-brand-500/50';
  };

  const yearsList = [];
  for (let y = startYear; y <= endYear; y++) {
    yearsList.push(y);
  }

  return (
    <div className="bg-surface-800/80 border border-surface-700 rounded-xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block animate-pulse"></span>
            Milestone Activity Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monthly density of earned credentials, certifications & evidence milestones
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-surface-900/60 px-3 py-1.5 rounded-lg border border-surface-700/50 self-start sm:self-auto">
          <span>Less</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 rounded-[2px] bg-surface-700/40 border border-surface-600/30"></div>
            <div className="w-3 h-3 rounded-[2px] bg-brand-500/30 border border-brand-500/40"></div>
            <div className="w-3 h-3 rounded-[2px] bg-brand-500/60 border border-brand-500/70"></div>
            <div className="w-3 h-3 rounded-[2px] bg-brand-500 border border-brand-400"></div>
            <div className="w-3 h-3 rounded-[2px] bg-brand-400 border border-brand-300"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid by Year */}
      <div className="space-y-4">
        {yearsList.map((yr) => {
          const monthsForYear = monthGrid.filter((item) => item.year === yr);
          return (
            <div key={yr} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs font-mono font-semibold text-slate-400 w-12">{yr}</span>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 flex-1">
                {monthsForYear.map((item) => (
                  <div
                    key={item.key}
                    className="group relative flex flex-col items-center"
                  >
                    <div
                      className={`w-full h-8 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center font-mono text-[11px] ${getIntensityClass(
                        item.count
                      )} hover:scale-105 hover:z-10`}
                    >
                      <span className="opacity-80">{item.monthName}</span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 min-w-[140px]">
                      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-3 rounded-lg border border-surface-600 shadow-2xl text-center whitespace-nowrap">
                        <div className="font-semibold text-brand-300">{item.count} milestone{item.count !== 1 ? 's' : ''}</div>
                        <div className="text-[10px] text-slate-400">{item.monthName} {item.year}</div>
                      </div>
                      <div className="w-2 h-2 -mt-1 bg-slate-900 rotate-45 border-r border-b border-surface-600"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
