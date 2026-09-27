import React, { useMemo, useState } from 'react';
import { Achievement } from '../../types';

interface TimelineHeatmapProps {
  achievements: Achievement[];
}

export const TimelineHeatmap: React.FC<TimelineHeatmapProps> = ({ achievements }) => {
  const [hoveredItem, setHoveredItem] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { cells, daysCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    achievements.forEach((ach) => {
      if (ach.issued_date) {
        const dateKey = ach.issued_date.substring(0, 10);
        counts[dateKey] = (counts[dateKey] || 0) + 1;
      }
    });

    // Generate last 365 days cells
    const cellList: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      cellList.push({
        date: dateKey,
        count: counts[dateKey] || 0,
      });
    }

    return { cells: cellList, daysCount: cellList.length };
  }, [achievements]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-surface border border-border';
    if (count === 1) return 'bg-accent/20 border border-accent/30';
    if (count === 2) return 'bg-accent/40 border border-accent/50';
    if (count === 3) return 'bg-accent/65 border border-accent/80';
    return 'bg-accent border border-accent';
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading text-h3 font-bold text-text-primary">
            Achievement Activity Heatmap
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 font-sans">
            365-day visual density map of earned credentials and evidence milestones
          </p>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
          <span>Less</span>
          <div className="flex gap-1 items-center">
            <div className="w-[14px] h-[14px] rounded-[2px] bg-surface border border-border"></div>
            <div className="w-[14px] h-[14px] rounded-[2px] bg-accent/20 border border-accent/30"></div>
            <div className="w-[14px] h-[14px] rounded-[2px] bg-accent/40 border border-accent/50"></div>
            <div className="w-[14px] h-[14px] rounded-[2px] bg-accent/65 border border-accent/80"></div>
            <div className="w-[14px] h-[14px] rounded-[2px] bg-accent border border-accent"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid of 14x14px cells with 3px gap */}
      <div className="relative">
        <div className="flex flex-wrap gap-[3px] max-w-full">
          {cells.map((cell) => (
            <div
              key={cell.date}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                setHoveredItem(cell);
              }}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-[14px] h-[14px] rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 hover:z-20 ${getIntensityClass(
                cell.count
              )}`}
            />
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredItem && (
          <div
            style={{
              position: 'fixed',
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 42}px`,
              transform: 'translateX(-50%)',
            }}
            className="z-50 pointer-events-none bg-surface-elevated text-text-primary text-xs py-1.5 px-3 rounded-lg border border-border shadow-xl font-mono whitespace-nowrap"
          >
            <strong>{hoveredItem.count}</strong> achievement{hoveredItem.count !== 1 ? 's' : ''} on {hoveredItem.date}
          </div>
        )}
      </div>
    </div>
  );
};
