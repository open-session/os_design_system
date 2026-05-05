'use client';

import { Zap, LayersTwo01 as Layers } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

export type ChatTab = 'answer' | 'resources';

interface ChatTabNavProps {
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
  hasResources?: boolean;
  resourcesCount?: number;
}

export function ChatTabNav({
  activeTab,
  onTabChange,
  hasResources = false,
  resourcesCount = 0,
}: ChatTabNavProps) {
  const tabs = [
    {
      id: 'answer' as ChatTab,
      label: 'Answer',
      icon: Zap,
      available: true,
    },
    {
      id: 'resources' as ChatTab,
      label: 'Resources',
      icon: Layers,
      available: hasResources,
      count: resourcesCount,
    },
  ];

  return (
    <div {...devProps('ChatTabNav')} className="flex items-center gap-1 border-b border-border-primary">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isAvailable = tab.available;

        return (
          <button
            key={tab.id}
            onClick={() => isAvailable && onTabChange(tab.id)}
            disabled={!isAvailable}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative
              ${
                isActive
                  ? 'text-fg-primary'
                  : isAvailable
                  ? 'text-fg-tertiary hover:text-fg-primary'
                  : 'text-fg-quaternary cursor-not-allowed opacity-40'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-xs text-fg-tertiary">
                ({tab.count})
              </span>
            )}
            {/* Active indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-brand-solid" />
            )}
          </button>
        );
      })}
    </div>
  );
}

