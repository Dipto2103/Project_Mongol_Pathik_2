import React from 'react';
import {
  Map,
  Route,
  GitCompare,
  FileText,
  Mountain,
  AlertTriangle,
  Compass,
  CloudSun,
  Layers,
  ChevronLeft,
  ChevronRight,
  Footprints
} from 'lucide-react';

export type ActiveTab =
  | 'layers'
  | 'route-plan'
  | 'route-compare'
  | 'mission-brief'
  | 'rover-explorer'
  | 'terrain'
  | 'hazards'
  | 'science'
  | 'environment';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hasActiveRoute: boolean;
  hazardCount: number;
  scienceCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeCount?: number;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  hasActiveRoute,
  hazardCount,
  scienceCount
}) => {
  const navSections: NavSection[] = [
    {
      group: 'CARTOGRAPHY',
      items: [
        { id: 'layers', label: 'Map Layers', icon: Layers, badge: 'NASA' }
      ]
    },
    {
      group: 'MISSION PLANNING',
      items: [
        { id: 'route-plan', label: 'Route Planner', icon: Route },
        { id: 'route-compare', label: 'Compare Routes', icon: GitCompare },
        {
          id: 'mission-brief',
          label: 'Mission Briefing',
          icon: FileText,
          highlight: hasActiveRoute
        },
        {
          id: 'rover-explorer',
          label: 'Rover Explorer',
          icon: Footprints,
          badge: 'PDS'
        }
      ]
    },
    {
      group: 'SURVIVAL & INTEL',
      items: [
        { id: 'terrain', label: 'Terrain Analysis', icon: Mountain },
        {
          id: 'hazards',
          label: 'Hazard Intelligence',
          icon: AlertTriangle,
          badgeCount: hazardCount,
          badgeColor: 'text-amber-400 bg-amber-950/60'
        },
        {
          id: 'science',
          label: 'Science Targets',
          icon: Compass,
          badgeCount: scienceCount,
          badgeColor: 'text-mars-cyan bg-sky-950/60'
        },
        { id: 'environment', label: 'Environmental Telemetry', icon: CloudSun }
      ]
    }
  ];

  return (
    <aside
      className={`relative bg-mars-dark border-r border-mars-border flex flex-col transition-all duration-300 z-10 select-none ${
        isCollapsed ? 'w-14' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 py-3 overflow-y-auto overflow-x-hidden space-y-6">
        {navSections.map((sec) => (
          <div key={sec.group} className="px-2">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-mono tracking-wider text-mars-muted uppercase font-semibold mb-1.5">
                {sec.group}
              </h3>
            )}
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left group ${
                      isActive
                        ? 'bg-mars-orange text-white font-semibold shadow-md shadow-mars-orange/20'
                        : 'text-mars-text/80 hover:bg-mars-surface hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.highlight ? 'text-mars-orange' : 'text-mars-muted'
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-mars-darkest/60 text-mars-sand font-mono border border-mars-border/40">
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && item.badgeCount !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          item.badgeColor || 'bg-mars-surface text-mars-text'
                        }`}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-mars-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="px-2 text-[10px] font-mono text-mars-muted">
            EVA v2.6 • MARS DATUM
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded bg-mars-surface hover:bg-mars-border text-mars-muted hover:text-mars-text transition-colors mx-auto"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
