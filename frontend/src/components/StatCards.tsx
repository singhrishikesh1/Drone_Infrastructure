import React from 'react';
import { AnalyticsSummary } from '../types';
import { ShieldAlert, Activity, CheckCircle, IndianRupee, Layers } from 'lucide-react';

interface StatCardsProps {
  summary: AnalyticsSummary;
  activeDronesCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary, activeDronesCount }) => {
  const cards = [
    {
      title: 'TOTAL INSPECTIONS',
      value: summary.totalInspections || 0,
      subtext: `${activeDronesCount} Active Drone Patrol`,
      icon: Activity,
      color: 'var(--brand-primary)',
      badge: 'LIVE',
      badgeClass: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/30'
    },
    {
      title: 'CRITICAL RISKS',
      value: summary.criticalRisks || 0,
      subtext: 'Requires Immediate Action',
      icon: ShieldAlert,
      color: 'var(--status-critical)',
      badge: 'URGENT',
      badgeClass: 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical-border)]'
    },
    {
      title: 'RESOLVED ISSUES',
      value: summary.resolvedProblems || 0,
      subtext: 'Completed Maintenance',
      icon: CheckCircle,
      color: 'var(--status-success)',
      badge: 'VERIFIED',
      badgeClass: 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
    },
    {
      title: 'ESTIMATED REPAIR BUDGET',
      value: `${summary.currency || '₹'}${(summary.totalEstimatedBudget || 0).toLocaleString('en-IN')}`,
      subtext: 'AI Volumetric Material Estimate',
      icon: IndianRupee,
      color: 'var(--status-warning)',
      badge: 'BUDGET',
      badgeClass: 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="app-card p-4 flex flex-col justify-between hover:border-[var(--border-strong)] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono mt-1 tracking-tight">
                  {card.value}
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-subtle)] shrink-0"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)] font-medium text-[11px]">{card.subtext}</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
