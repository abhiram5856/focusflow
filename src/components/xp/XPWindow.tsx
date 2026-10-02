import React, { useState, useRef, useEffect } from 'react';

interface XPWindowProps {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximizeToggle: () => void;
  children: React.ReactNode;
}

export const XPWindow: React.FC<XPWindowProps> = ({
  id: _id,
  title,
  icon = '📁',
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPosition = { x: 80, y: 40 },
  initialSize = { width: 920, height: 620 },
  onFocus,
  onClose,
  onMinimize,
  onMaximizeToggle,
  children
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size] = useState(initialSize);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (isMaximized) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || isMaximized) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffsetRef.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized]);

  if (!isOpen || isMinimized) return null;

  const style: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 36px)',
        zIndex
      }
    : {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `min(${size.width}px, 98vw)`,
        height: `min(${size.height}px, 86vh)`,
        zIndex
      };

  return (
    <div
      style={style}
      onClick={onFocus}
      className="xp-window flex flex-col shadow-2xl select-none"
    >
      {/* XP Luna Blue Titlebar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximizeToggle}
        className="xp-window-titlebar flex items-center justify-between px-2 py-1 select-none cursor-move"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-base select-none">{icon}</span>
          <span className="font-bold text-xs md:text-sm tracking-wide text-white drop-shadow truncate">
            {title}
          </span>
        </div>

        {/* 3D Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-2" onMouseDown={e => e.stopPropagation()}>
          <button
            onClick={onMinimize}
            title="Minimize"
            className="xp-titlebar-btn xp-btn-min"
          >
            _
          </button>
          <button
            onClick={onMaximizeToggle}
            title={isMaximized ? "Restore Down" : "Maximize"}
            className="xp-titlebar-btn xp-btn-max"
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="xp-titlebar-btn xp-btn-close text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Classic Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0cdc0] px-2 py-0.5 text-xs flex gap-3 text-[#222]">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Help</span>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[#ece9d8] p-2 select-text">
        {children}
      </div>

      {/* Classic Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 text-[11px] text-[#444] flex justify-between items-center select-none">
        <span className="truncate">Windows XP Professional Service Pack 3 • 150-Day Prep OS</span>
        <span className="hidden sm:inline text-gray-500">Ready</span>
      </div>
    </div>
  );
};
