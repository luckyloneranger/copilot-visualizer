import React from 'react';

interface FeatureToggleConfig {
  label: string;
  icon: string;
  enabled: boolean;
  onToggle: () => void;
  title: string;
}

interface SidebarFeatureTogglesProps {
  showFeatures: boolean;
  onToggleVisibility: () => void;
  toggles: FeatureToggleConfig[];
}

export const SidebarFeatureToggles = ({ showFeatures, onToggleVisibility, toggles }: SidebarFeatureTogglesProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm space-y-2">
    <button
      onClick={onToggleVisibility}
      className="flex items-center justify-between w-full px-1 text-xs font-semibold text-gray-600"
    >
      <span>Features</span>
      <span className={`transition-transform text-gray-400 ${showFeatures ? 'rotate-180' : ''}`}>
        ˅
      </span>
    </button>
    {showFeatures && (
      <div className="space-y-2">
        {toggles.map((item) => (
          <button
            key={item.label}
            onClick={item.onToggle}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
            title={item.title}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
);
