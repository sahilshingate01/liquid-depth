import React, { useMemo } from 'react';
import { ParallaxItem } from './ParallaxItem';
import { ParallaxCard } from './ParallaxCard';
import { useParallaxSettings } from '../services/parallaxSettings';
import { SkipForward, Pause, Mic, Calendar, MessageSquare, Radio, Grip, Cloud, Sun, Droplets, Wind, Battery, Wifi, Signal } from 'lucide-react';

export const DesktopScene: React.FC = () => {
  const { settings } = useParallaxSettings();
  const globalDepth = settings.depthMultiplier;
  
  const lightDir = useMemo(() => {
    const posMap: Record<string, {x: number, y: number}> = {
      'top-left': {x: -1, y: -1}, 'top-center': {x: 0, y: -1}, 'top-right': {x: 1, y: -1},
      'center-left': {x: -1, y: 0}, 'center': {x: 0, y: 0}, 'center-right': {x: 1, y: 0},
      'bottom-left': {x: -1, y: 1}, 'bottom-center': {x: 0, y: 1}, 'bottom-right': {x: 1, y: 1}
    };
    return posMap[settings.lightPosition] || {x: -1, y: -1};
  }, [settings.lightPosition]);
  
  const intensity = settings.lightIntensity;

  const notificationShadow = useMemo(() => ({
    boxShadow: `
      calc((var(--head-x) + ${lightDir.x * 0.3}) * ${4 * globalDepth * intensity}px) 
      calc((var(--head-y) + ${lightDir.y * 0.3}) * ${4 * globalDepth * intensity}px) 
      0 0 rgba(255,255,255,${0.3 * intensity}),
      calc((var(--head-x) + ${lightDir.x * 0.3}) * ${10 * globalDepth * intensity}px) 
      calc((var(--head-y) + ${lightDir.y * 0.3}) * ${10 * globalDepth * intensity}px) 
      0 0 rgba(0,0,0,${0.4 * intensity}),
      calc((var(--head-x) - ${lightDir.x * 0.5}) * ${-60 * globalDepth}px) 
      calc((var(--head-y) - ${lightDir.y * 0.5}) * ${-60 * globalDepth}px) 
      ${80 * globalDepth}px rgba(0,0,0,${0.9 * intensity})
    `,
    willChange: 'box-shadow',
    contain: 'layout style paint'
  }), [lightDir.x, lightDir.y, globalDepth, intensity]);

  const bevelShadow = useMemo(() => ({
    boxShadow: `
      inset calc((var(--head-x) - ${lightDir.x * 0.4}) * ${-80 * globalDepth}px) calc((var(--head-y) - ${lightDir.y * 0.4}) * ${-80 * globalDepth}px) ${120 * globalDepth}px rgba(0,0,0,${0.9 * intensity}),
      inset calc((var(--head-x) + ${lightDir.x * 0.4}) * ${-20 * globalDepth}px) calc((var(--head-y) + ${lightDir.y * 0.4}) * ${-20 * globalDepth}px) 2px 0px rgba(255,255,255,${0.15 * intensity}),
      inset calc((var(--head-x) - ${lightDir.x * 0.3}) * ${-30 * globalDepth}px) calc((var(--head-y) - ${lightDir.y * 0.3}) * ${-30 * globalDepth}px) ${40 * globalDepth}px rgba(50, 100, 255, ${0.05 * intensity})
    `
  }), [lightDir.x, lightDir.y, globalDepth, intensity]);

  const childEdgeShadow = useMemo(() => 
    settings.childEdges ? {
      boxShadow: `
        calc((var(--head-x) + ${lightDir.x * 0.2}) * ${2 * globalDepth * intensity}px) 
        calc((var(--head-y) + ${lightDir.y * 0.2}) * ${2 * globalDepth * intensity}px) 
        0 0 rgba(255,255,255,${0.2 * intensity}),
        calc((var(--head-x) - ${lightDir.x * 0.3}) * ${-15 * globalDepth}px) 
        calc((var(--head-y) - ${lightDir.y * 0.3}) * ${-15 * globalDepth}px) 
        ${20 * globalDepth}px rgba(0,0,0,${0.4 * intensity})
      `,
      willChange: 'box-shadow'
    } : {},
  [settings.childEdges, lightDir.x, lightDir.y, globalDepth, intensity]);
  
  return (
    <div className="w-full h-full relative preserve-3d bg-[#050505] overflow-hidden">
      
      {/* 
         DYNAMIC BEVEL / SCREEN EDGE EFFECT 
         This simulates the physical thickness of the screen bezel or a 'cutout' in the wall.
         It uses multiple inset shadows that shift based on head position to reveal 'walls'.
      */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none border-[20px] border-transparent"
        style={bevelShadow}
      >
        {/* Physical noise texture on the "glass" surface */}
        <div className="absolute inset-0 opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,_black_100%)] opacity-80" />
      </div>

      {/* BACKGROUND - TECH WALLPAPER PATTERN */}
      <ParallaxItem depth={-0.6} className="z-0">
        <div className="w-[140%] h-[140%] bg-[#08080a] relative shadow-inner flex items-center justify-center">
            
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#050505] to-[#000000]" />

            {/* REPEATING PATTERN: Hexagonal / Circuit Mesh */}
            <div 
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(30deg, #333 12%, transparent 12.5%, transparent 87%, #333 87.5%, #333),
                        linear-gradient(150deg, #333 12%, transparent 12.5%, transparent 87%, #333 87.5%, #333),
                        linear-gradient(30deg, #333 12%, transparent 12.5%, transparent 87%, #333 87.5%, #333),
                        linear-gradient(150deg, #333 12%, transparent 12.5%, transparent 87%, #333 87.5%, #333),
                        linear-gradient(60deg, #44475a 25%, transparent 25.5%, transparent 75%, #44475a 75%, #44475a),
                        linear-gradient(60deg, #44475a 25%, transparent 25.5%, transparent 75%, #44475a 75%, #44475a)
                    `,
                    backgroundSize: '80px 140px',
                    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />
            
            {/* Subtle Grid Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Ambient Lighting Spots */}
            <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px]" />
        </div>
      </ParallaxItem>

      {/* MID LAYER - Floating Icons/Decor */}
      <ParallaxItem depth={-0.2} rotate={true} className="z-10 pointer-events-none">
          <div className="absolute top-[15%] right-[20%] opacity-20">
              <Grip size={120} className="text-white animate-pulse" />
          </div>
          <div className="absolute bottom-[20%] left-[10%] opacity-10 rotate-45">
              <div className="w-64 h-64 border-2 border-dashed border-white rounded-full" />
          </div>
      </ParallaxItem>

      {/* MID LAYER - Interactive Widgets */}
      <ParallaxItem depth={0.1} className="z-20">
        <div className="w-full h-full relative">
            
            {/* Music Card - Depth Scale 1.2 (Slight pop) */}
            <div className="absolute top-[20%] left-[10%] w-72 pointer-events-auto">
                <ParallaxCard depthScale={1.2}>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <span className="text-[10px] font-bold text-white/40 tracking-[0.2em]">AUDIO STREAM</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                          <div className="w-1 h-4 bg-green-500 rounded-full animate-[pulse_1.2s_infinite]" />
                          <div className="w-1 h-2 bg-green-500 rounded-full animate-[pulse_0.8s_infinite]" />
                        </div>
                    </div>
                    <div className="flex gap-4 items-center mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shadow-inner" style={childEdgeShadow}>
                           <Radio size={20} className="text-white/80" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg leading-tight">Neural Sync</h3>
                            <p className="text-xs text-white/40 font-mono mt-1">Hertz: 432hz</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                         <SkipForward className="rotate-180 hover:text-white transition-colors cursor-pointer" size={20} />
                         <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform" style={childEdgeShadow}>
                            <Pause size={20} fill="currentColor" />
                         </button>
                         <SkipForward className="hover:text-white transition-colors cursor-pointer" size={20} />
                    </div>
                </ParallaxCard>
            </div>


            
             {/* Clock Widget - Depth Scale 1.2 */}
             <div className="absolute bottom-[20%] left-[15%] w-60 pointer-events-auto">
                  <ParallaxCard depthScale={1.2}>
                      <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                              <span className="text-5xl font-light tracking-tighter">09:41</span>
                              <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Wednesday</span>
                          </div>
                          <Calendar size={20} className="text-white/20" />
                      </div>
                  </ParallaxCard>
             </div>

             {/* Weather Widget - Depth Scale 1.5 */}
             <div className="absolute top-[8%] right-[5%] w-80 pointer-events-auto">
                  <ParallaxCard depthScale={1.5}>
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                          <span className="text-[10px] font-bold text-white/40 tracking-[0.2em]">WEATHER SYNC</span>
                          <Cloud size={16} className="text-white/30" />
                      </div>
                      <div className="flex items-center gap-6">
                          <div className="relative">
                              <Sun size={48} className="text-yellow-400" />
                              <Cloud size={28} className="text-white/60 absolute -bottom-1 -right-2" />
                          </div>
                          <div>
                              <span className="text-5xl font-light">72°</span>
                              <p className="text-xs text-white/40 mt-1">Partly Cloudy</p>
                          </div>
                      </div>
                      <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-white/50">
                              <Droplets size={14} />
                              <span className="text-xs">45%</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50">
                              <Wind size={14} />
                              <span className="text-xs">12 mph</span>
                          </div>
                      </div>
                  </ParallaxCard>
             </div>

             {/* System Status Widget - Depth Scale 1.3 */}
             <div className="absolute top-[38%] right-[5%] w-72 pointer-events-auto">
                  <ParallaxCard depthScale={1.3}>
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                          <span className="text-[10px] font-bold text-white/40 tracking-[0.2em]">SYSTEM STATUS</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <Battery size={18} className="text-green-400" />
                                  <span className="text-sm">Power</span>
                              </div>
                              <span className="text-sm text-white/60">87%</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <Wifi size={18} className="text-blue-400" />
                                  <span className="text-sm">Network</span>
                              </div>
                              <span className="text-sm text-green-400">Connected</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <Signal size={18} className="text-purple-400" />
                                  <span className="text-sm">Signal</span>
                              </div>
                              <span className="text-sm text-white/60">Strong</span>
                          </div>
                      </div>
                  </ParallaxCard>
             </div>
        </div>
      </ParallaxItem>

      {/* FOREGROUND - Main Focus */}
      <ParallaxItem depth={0.3} rotate={true} className="z-30">
          <div className="w-[500px] pointer-events-auto transform translate-y-8">
              {/* Higher Depth Scale (2.5) for the main element = Thicker extrusion & deeper shadow */}
              <ParallaxCard className="!p-0 flex flex-col h-[320px] !border-white/15" depthScale={2.5}>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                          </div>
                          <span className="text-xs font-bold text-white/50 tracking-widest ml-2">COMMUNICATION_LINK</span>
                      </div>
                       <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-mono" style={childEdgeShadow}>
                         LIVE
                       </div>
                  </div>
                  
                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col gap-5 overflow-hidden relative">
                      {/* Chat Messages */}
                       <div className="flex gap-4 items-start animate-[fadeIn_0.5s_ease-out]">
                           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 font-bold text-[10px] shadow-lg shadow-indigo-500/20" style={childEdgeShadow}>AI</div>
                           <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed text-white/90 shadow-sm backdrop-blur-sm" style={childEdgeShadow}>
                               <p>System calibrated. I've enabled full hardware acceleration for all transforms.</p>
                           </div>
                       </div>
                      
                        <div className="flex gap-4 items-start flex-row-reverse animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                           <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 font-bold text-[10px]" style={childEdgeShadow}>USR</div>
                           <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed text-white shadow-lg shadow-blue-600/20" style={childEdgeShadow}>
                               <p>The input lag is gone. The shadows update instantly with the head movement now.</p>
                           </div>
                       </div>
                  </div>
                  
                   {/* Footer Input */}
                   <div className="p-4 border-t border-white/5 bg-black/20 flex gap-3 backdrop-blur-md">
                       <div className="flex-1 bg-white/5 border border-white/5 rounded-full px-5 py-2.5 text-sm text-white/40 flex items-center transition-colors hover:bg-white/10 cursor-text" style={childEdgeShadow}>
                           Transmit message...
                       </div>
                       <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/30" style={childEdgeShadow}>
                           <Mic size={18} />
                       </button>
                   </div>
              </ParallaxCard>
          </div>
      </ParallaxItem>

       {/* Floating Notification Chips - Extreme foreground */}
       <ParallaxItem depth={0.45} className="z-40 pointer-events-none">
          <div className="absolute bottom-16 right-16 pointer-events-auto">
                 <div 
                 className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 text-sm text-white group cursor-pointer hover:border-white/20 transition-all"
                 style={notificationShadow}
                >
                   <div className="relative p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors" style={childEdgeShadow}>
                       <MessageSquare size={20} className="text-blue-400" />
                       <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
                   </div>
                   <div className="flex flex-col">
                      <span className="font-bold">Incoming Data</span>
                      <span className="text-xs text-white/40">3 packets received</span>
                   </div>
               </div>
          </div>
       </ParallaxItem>

    </div>
  );
};