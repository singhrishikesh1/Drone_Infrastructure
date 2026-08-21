import React from 'react';

export const SideTeddyBears: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 hidden xl:block">
      {/* Left Teddy Bear Companion */}
      <div className="absolute left-2 bottom-12 flex flex-col items-center animate-bounce duration-1000 space-y-1">
        <div className="bg-[#FFFFFF] border-2 border-[#F472B6] px-2 py-1 rounded-2xl shadow-md text-[10px] font-bold text-[#831843] flex items-center gap-1 font-mono">
          <span>Patrol Safe!</span>
          <span>🧸</span>
        </div>
        <div className="text-4xl filter drop-shadow-md transition-transform hover:scale-110 pointer-events-auto cursor-pointer" title="Drone Patrol Companion Teddy!">
          🧸
        </div>
      </div>

      {/* Right Teddy Bear Companion */}
      <div className="absolute right-2 top-24 flex flex-col items-center animate-pulse space-y-1">
        <div className="text-4xl filter drop-shadow-md transition-transform hover:scale-110 pointer-events-auto cursor-pointer" title="DRONACHARYA Mascot Teddy">
          🧸
        </div>
        <div className="bg-[#FFFFFF] border-2 border-[#F472B6] px-2 py-1 rounded-2xl shadow-md text-[10px] font-bold text-[#831843] font-mono">
          Road AI Active 💕
        </div>
      </div>
    </div>
  );
};
