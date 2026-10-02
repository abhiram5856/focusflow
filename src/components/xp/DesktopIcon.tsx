import React from 'react';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: string;
  badge?: string | number;
  isSelected?: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id: _id,
  title,
  icon,
  badge,
  isSelected,
  onSelect,
  onOpen
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={`group w-24 flex flex-col items-center justify-start p-1.5 rounded cursor-pointer transition-all select-none my-1.5 ${
        isSelected
          ? 'bg-[#0b58e7]/30 border border-dotted border-white/80'
          : 'hover:bg-white/15 border border-transparent'
      }`}
    >
      <div className="relative text-3xl mb-1 filter drop-shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
        {icon}
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow">
            {badge}
          </span>
        )}
      </div>
      <span
        className={`text-xs text-center text-white px-1 rounded leading-tight font-medium ${
          isSelected
            ? 'bg-[#0b58e7] text-white shadow'
            : 'text-shadow drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
        }`}
        style={{
          textShadow: isSelected ? 'none' : '1px 1px 2px #000, 0 0 4px #000'
        }}
      >
        {title}
      </span>
    </div>
  );
};
