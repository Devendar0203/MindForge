import React, { useState } from 'react';
import {
  X,
  Award,
  BookOpen,
  Download,
  Upload,
  Flame,
  Clock,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { RebuildState } from '../types';
import { computeStats, isDayComplete } from '../utils/storage';
import { CURRICULUM } from '../data/curriculum';

interface AnalyticsModalProps {
  isOpen: boolean;
  state: RebuildState;
  onClose: () => void;
  onImportState: (newState: RebuildState) => void;
  onSelectDay: (day: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      day: number;
      hours: number;
      title: string;
      isComplete: boolean;
      isCurrent: boolean;
    };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#15171B] border border-[#34383F] px-3 py-2 rounded-xs shadow-xl font-mono-code text-[11.5px] z-50 pointer-events-none">
        <div className="text-[#E9E6DF] font-serif font-medium text-[12px] flex items-center gap-1.5 border-b border-[#282C33] pb-1.5 mb-1.5">
          <span className="text-[#C68A46]">Day {item.day}:</span>
          <span className="truncate max-w-[200px]">{item.title}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[11px]">
          <span className="text-[#8F8B84]">Study logged:</span>
          <span className="text-[#E9E6DF] font-semibold">{item.hours} hrs</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[10.5px] mt-0.5">
          <span className="text-[#8F8B84]">Status:</span>
          <span
            className={
              item.isComplete
                ? 'text-[#6B8F71] font-medium'
                : item.hours > 0
                ? 'text-[#C68A46]'
                : 'text-[#595E68]'
            }
          >
            {item.isComplete ? '✓ Conquered' : item.hours > 0 ? 'In Progress' : 'Unlogged'}
          </span>
        </div>
        {item.isCurrent && (
          <div className="text-[10px] text-[#C68A46] mt-1 pt-1 border-t border-[#23262D]">
            ● Active Today
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  state,
  onClose,
  onImportState,
  onSelectDay,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'journal'>('analytics');
  const stats = computeStats(state);

  if (!isOpen) return null;

  // Compute milestones
  const milestones = [
    { title: 'The First Rep', desc: 'Completed Day 1 commitments', unlocked: isDayComplete(state.days[1]) },
    { title: 'Week 1 Survivor', desc: 'Conquered Days 1-7 (DSA Foundations)', unlocked: [1, 2, 3, 4, 5, 6, 7].every((d) => isDayComplete(state.days[d])) },
    { title: 'Deep Work Pioneer', desc: 'Logged 10+ skill hours total', unlocked: stats.totalHours >= 10 },
    { title: 'Halfway Mark', desc: 'Completed 15 days of rebuild', unlocked: stats.totalDaysComplete >= 15 },
    { title: '30-Day Rebuilt Master', desc: 'All 30 days completely conquered', unlocked: stats.totalDaysComplete === 30 },
  ];

  // 30-day chart data for consistency visualization
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dayData = state.days[dayNum];
    const hrs = parseFloat(dayData?.hours || '0');
    const isComplete = isDayComplete(dayData);
    const curriculum = CURRICULUM[dayNum - 1];
    return {
      day: dayNum,
      label: `${dayNum}`,
      hours: isNaN(hrs) ? 0 : hrs,
      isComplete,
      title: curriculum?.title || `Day ${dayNum}`,
      isCurrent: dayNum === state.currentDay,
    };
  });

  const activeDaysCount = chartData.filter((d) => d.hours > 0).length;
  const maxDailyHours = Math.max(...chartData.map((d) => d.hours), 0);
  const avgDailyHours = activeDaysCount > 0 ? (stats.totalHours / activeDaysCount).toFixed(1) : '0.0';

  // Export full markdown summary
  const handleExportMarkdown = () => {
    let md = `# 30-Day Rebuild Report\n\n`;
    md += `- **Completed Days:** ${stats.totalDaysComplete} / 30 (${stats.percentComplete}%)\n`;
    md += `- **Active Streak:** ${stats.streak} days\n`;
    md += `- **Total Skill Hours Logged:** ${stats.totalHours} hrs\n`;
    md += `- **Generated on:** ${new Date().toLocaleDateString()}\n\n`;

    md += `## Weekly Hours Breakdown\n`;
    md += `- Week 1 (DSA Foundations): ${stats.hoursByWeek[1] || 0} hrs\n`;
    md += `- Week 2 (DSA + Math for ML): ${stats.hoursByWeek[2] || 0} hrs\n`;
    md += `- Week 3 (ML Fundamentals): ${stats.hoursByWeek[3] || 0} hrs\n`;
    md += `- Week 4 (Applied DL & Revision): ${stats.hoursByWeek[4] || 0} hrs\n\n`;

    md += `## Daily Log & Psychological Reviews\n\n`;
    for (let d = 1; d <= 30; d++) {
      const curriculum = CURRICULUM[d - 1];
      const data = state.days[d];
      const complete = isDayComplete(data);
      md += `### Day ${d}: ${curriculum.title} ${complete ? '✅ [Complete]' : '⏳'}\n`;
      md += `- **Hours:** ${data?.hours || 0}h\n`;
      if (data?.repType || data?.repNote) {
        md += `- **Discomfort Rep:** ${data.repType || ''} ${data.repNote ? `("${data.repNote}")` : ''}\n`;
      }
      if (data?.avoided) {
        md += `- **What I avoided:** ${data.avoided}\n`;
      }
      if (data?.faced) {
        md += `- **What I faced despite fear:** ${data.faced}\n`;
      }
      if (data?.notes) {
        md += `- **Technical Notes:**\n> ${data.notes}\n`;
      }
      md += `\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `30-day-rebuild-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `30-day-rebuild-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed.currentDay === 'number') {
          onImportState(parsed);
          alert('Successfully imported rebuild data!');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Days with reviews
  const daysWithReviews = Array.from({ length: 30 }, (_, i) => i + 1).filter(
    (d) => state.days[d]?.avoided?.trim() || state.days[d]?.faced?.trim() || state.days[d]?.notes?.trim()
  );

  return (
    <div className="fixed inset-0 bg-[#0B0C0E]/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#15171B] border border-[#34383F] w-full max-w-2xl rounded-sm p-6 shadow-2xl relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8B84] hover:text-[#E9E6DF] cursor-pointer"
          aria-label="Close analytics modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header tabs */}
        <div className="flex items-center gap-4 border-b border-[#282C33] pb-3 mb-5">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`font-serif text-[17px] cursor-pointer transition-colors pb-1 border-b-2 ${
              activeTab === 'analytics'
                ? 'text-[#E9E6DF] border-[#C68A46]'
                : 'text-[#8F8B84] border-transparent hover:text-[#E9E6DF]'
            }`}
          >
            30-Day Metrics &amp; Milestones
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`font-serif text-[17px] cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'text-[#E9E6DF] border-[#C68A46]'
                : 'text-[#8F8B84] border-transparent hover:text-[#E9E6DF]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C68A46]" />
            <span>Nightly Reflection Archive ({daysWithReviews.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'analytics' ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#1C1F24] border border-[#282C33] p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-[#8F8B84] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F71]" />
                    <span>Completed</span>
                  </div>
                  <div className="text-[24px] font-mono-code text-[#E9E6DF] mt-1">
                    {stats.totalDaysComplete} <span className="text-[14px] text-[#8F8B84]">/ 30</span>
                  </div>
                  <div className="w-full bg-[#282C33] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#6B8F71] h-full transition-all duration-500"
                      style={{ width: `${stats.percentComplete}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#1C1F24] border border-[#282C33] p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-[#8F8B84] uppercase">
                    <Flame className="w-3.5 h-3.5 text-[#C68A46]" />
                    <span>Streak</span>
                  </div>
                  <div className="text-[24px] font-mono-code text-[#C68A46] mt-1">
                    {stats.streak} <span className="text-[14px] text-[#8F8B84]">days</span>
                  </div>
                  <div className="text-[11.5px] text-[#8F8B84] mt-2">
                    Consecutive unbroken
                  </div>
                </div>

                <div className="bg-[#1C1F24] border border-[#282C33] p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-[#8F8B84] uppercase">
                    <Clock className="w-3.5 h-3.5 text-[#C68A46]" />
                    <span>Skill Hours</span>
                  </div>
                  <div className="text-[24px] font-mono-code text-[#E9E6DF] mt-1">
                    {stats.totalHours} <span className="text-[14px] text-[#8F8B84]">hrs</span>
                  </div>
                  <div className="text-[11.5px] text-[#8F8B84] mt-2">
                    Deep focused study
                  </div>
                </div>
              </div>

              {/* Daily Study Hours Consistency Chart (Recharts) */}
              <div className="bg-[#1C1F24] border border-[#282C33] p-4 rounded-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C68A46]" />
                    <span className="text-[12px] font-mono-code text-[#8F8B84] uppercase tracking-wider">
                      Daily Study Hours (30-Day Consistency)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono-code">
                    <span className="text-[#8F8B84] bg-[#15171B] px-2 py-0.5 rounded-xs border border-[#282C33]">
                      Avg: <strong className="text-[#E9E6DF] font-normal">{avgDailyHours}h</strong>/active
                    </span>
                    <span className="text-[#8F8B84] bg-[#15171B] px-2 py-0.5 rounded-xs border border-[#282C33]">
                      Peak: <strong className="text-[#C68A46] font-normal">{maxDailyHours}h</strong>
                    </span>
                    <span className="text-[#8F8B84] bg-[#15171B] px-2 py-0.5 rounded-xs border border-[#282C33]">
                      Active: <strong className="text-[#6B8F71] font-normal">{activeDaysCount}</strong>/30d
                    </span>
                  </div>
                </div>

                {/* Subtitle & Legend */}
                <div className="flex items-center justify-between text-[11px] text-[#8F8B84] mb-3 pb-2 border-b border-[#242830]">
                  <span>Distribution across Days 1–30</span>
                  <div className="flex items-center gap-3 font-mono-code text-[10.5px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-[#6B8F71] rounded-xs inline-block" />
                      Conquered
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-[#C68A46] rounded-xs inline-block" />
                      Logged
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-[#262A32] rounded-xs inline-block" />
                      Zero
                    </span>
                  </div>
                </div>

                {/* Recharts Mini Chart */}
                <div className="w-full h-44 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="label"
                        stroke="#595E68"
                        fontSize={10}
                        tickLine={false}
                        axisLine={{ stroke: '#282C33' }}
                        interval={2}
                      />
                      <YAxis
                        stroke="#595E68"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        domain={[0, Math.max(3, Math.ceil(maxDailyHours + 0.5))]}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#282C33', opacity: 0.4 }}
                      />
                      {stats.totalHours > 0 && (
                        <ReferenceLine
                          y={2}
                          stroke="#8A6435"
                          strokeDasharray="3 3"
                          strokeOpacity={0.6}
                          label={{
                            value: '2h goal',
                            position: 'right',
                            fill: '#8A6435',
                            fontSize: 9,
                          }}
                        />
                      )}
                      <Bar
                        dataKey="hours"
                        radius={[2, 2, 0, 0]}
                        onClick={(data: any) => {
                          if (data && data.day) {
                            onSelectDay(data.day);
                            onClose();
                          }
                        }}
                      >
                        {chartData.map((entry) => (
                          <Cell
                            key={entry.day}
                            fill={
                              entry.isComplete
                                ? '#6B8F71'
                                : entry.hours > 0
                                ? '#C68A46'
                                : '#262A32'
                            }
                            stroke={entry.isCurrent ? '#E9E6DF' : 'none'}
                            strokeWidth={entry.isCurrent ? 1.5 : 0}
                            className="cursor-pointer transition-opacity hover:opacity-80"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 text-[10.5px] font-mono-code text-[#595E68] text-center">
                  Tip: Click any day's bar to jump directly to its curriculum and tasks
                </div>
              </div>

              {/* Weekly Hours Breakdown */}
              <div className="bg-[#1C1F24] border border-[#282C33] p-4 rounded-sm">
                <div className="text-[12px] font-mono-code text-[#8F8B84] uppercase tracking-wider mb-3">
                  Weekly Skill Hours Distribution
                </div>
                <div className="space-y-2 text-[13px]">
                  {[
                    { w: 1, label: 'Week 1 — DSA Foundations', hours: stats.hoursByWeek[1] || 0 },
                    { w: 2, label: 'Week 2 — DSA + Math for ML', hours: stats.hoursByWeek[2] || 0 },
                    { w: 3, label: 'Week 3 — ML Fundamentals', hours: stats.hoursByWeek[3] || 0 },
                    { w: 4, label: 'Week 4 — Deep Learning & Review', hours: stats.hoursByWeek[4] || 0 },
                  ].map((item) => (
                    <div key={item.w} className="flex items-center justify-between py-1">
                      <span className="text-[#E9E6DF] font-serif">{item.label}</span>
                      <span className="font-mono-code text-[#C68A46] text-[13px]">{item.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="text-[12px] font-mono-code text-[#8F8B84] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C68A46]" />
                  <span>Program Milestones</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-sm border transition-all ${
                        m.unlocked
                          ? 'bg-[#1C1F24] border-[#6B8F71]/40'
                          : 'bg-[#181A1F] border-[#282C33] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]">{m.unlocked ? '🏆' : '🔒'}</span>
                        <div className="font-serif text-[14px] text-[#E9E6DF] font-normal">
                          {m.title}
                        </div>
                      </div>
                      <div className="text-[11.5px] text-[#8F8B84] mt-1 font-serif">
                        {m.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export & Import data options */}
              <div className="pt-3 border-t border-[#282C33] flex items-center justify-between flex-wrap gap-2 text-[12px]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportMarkdown}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1C1F24] hover:bg-[#22262E] text-[#E9E6DF] border border-[#34383F] hover:border-[#8A6435] rounded-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C68A46]" />
                    <span>Download Report (.md)</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1C1F24] hover:bg-[#22262E] text-[#8F8B84] hover:text-[#E9E6DF] border border-[#34383F] rounded-xs cursor-pointer transition-colors"
                  >
                    <span>Backup JSON</span>
                  </button>
                </div>

                <label className="flex items-center gap-1 px-3 py-1.5 bg-[#1C1F24] hover:bg-[#22262E] text-[#8F8B84] hover:text-[#E9E6DF] border border-[#34383F] rounded-xs cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore JSON</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            /* Journal tab */
            <div className="space-y-4">
              {daysWithReviews.length === 0 ? (
                <div className="text-center py-12 text-[#8F8B84] font-serif">
                  <BookOpen className="w-8 h-8 text-[#5D626C] mx-auto mb-2" />
                  <p>No nightly reviews written yet.</p>
                  <p className="text-[12px] text-[#5D626C]">
                    Answer "What did I avoid?" and "What did I do despite fear?" each evening to populate your journal.
                  </p>
                </div>
              ) : (
                daysWithReviews.map((dayNum) => {
                  const dayData = state.days[dayNum];
                  const curriculum = CURRICULUM[dayNum - 1];

                  return (
                    <div
                      key={dayNum}
                      className="bg-[#1C1F24] border border-[#282C33] p-4 rounded-sm"
                    >
                      <div className="flex items-center justify-between border-b border-[#282C33] pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-[12px] text-[#C68A46] font-medium">
                            Day {dayNum}
                          </span>
                          <span className="text-[14px] text-[#E9E6DF] font-serif">
                            {curriculum.title}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectDay(dayNum);
                            onClose();
                          }}
                          className="text-[11px] font-mono-code text-[#8F8B84] hover:text-[#C68A46] flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Jump to day</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {dayData.avoided && (
                        <div className="mb-2">
                          <span className="text-[11px] font-mono-code text-[#8F8B84] uppercase tracking-wider block">
                            What I avoided:
                          </span>
                          <p className="text-[13.5px] text-[#E9E6DF] italic font-serif m-0 mt-0.5">
                            "{dayData.avoided}"
                          </p>
                        </div>
                      )}

                      {dayData.faced && (
                        <div className="mb-2">
                          <span className="text-[11px] font-mono-code text-[#6B8F71] uppercase tracking-wider block">
                            Faced despite fear:
                          </span>
                          <p className="text-[13.5px] text-[#E9E6DF] italic font-serif m-0 mt-0.5">
                            "{dayData.faced}"
                          </p>
                        </div>
                      )}

                      {dayData.notes && (
                        <div className="mt-2 pt-2 border-t border-[#23272F]">
                          <span className="text-[11px] font-mono-code text-[#8F8B84] block">
                            Technical note:
                          </span>
                          <pre className="text-[12px] font-mono-code text-[#C68A46] whitespace-pre-wrap m-0 mt-0.5">
                            {dayData.notes}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
