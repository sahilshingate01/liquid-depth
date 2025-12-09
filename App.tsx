import React from 'react';
import { DesktopScene } from './components/DesktopScene';
import { SettingsPanel } from './components/SettingsPanel';
import { ParallaxSettingsProvider } from './services/parallaxSettings';
import { HeadTrackingProvider, useHeadTracking } from './services/headTrackingContext';
import { ParallaxContainer } from './components/ParallaxContainer';
import { ScanFace } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isReady, error } = useHeadTracking();

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white relative font-sans">
      
      {/* Loading Overlay */}
      {!isReady && !error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <ScanFace className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+1rem)] text-blue-500 animate-pulse" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-wider mb-2">INITIALIZING HOLODECK</h1>
          <p className="text-gray-400 text-sm">Allow camera access to enable head tracking...</p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-900/20 text-red-500">
          <h1 className="text-2xl font-bold mb-2">SYSTEM FAILURE</h1>
          <p>{error}</p>
        </div>
      )}

      {/* Main 3D Container */}
      <ParallaxContainer className={`w-full h-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <DesktopScene />
      </ParallaxContainer>

      <div className="fixed bottom-2 right-2 z-50 opacity-30 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-24 h-24 border border-white/20 rounded-full relative bg-black/50 backdrop-blur-sm">
           <div 
             className="absolute w-2 h-2 bg-green-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
             style={{ 
               transform: `translate(calc(-50% + var(--head-x) * 40px), calc(-50% + var(--head-y) * 40px))`
             }}
           />
        </div>
        <p className="text-[10px] text-center mt-1 font-mono text-gray-500">HEAD POSITION</p>
      </div>

      <SettingsPanel />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ParallaxSettingsProvider>
      <HeadTrackingProvider>
        <AppContent />
      </HeadTrackingProvider>
    </ParallaxSettingsProvider>
  );
};

export default App;