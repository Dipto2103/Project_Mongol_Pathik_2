import React, { useState, useCallback } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { Sidebar, ActiveTab } from '../components/layout/Sidebar';
import { StatusBar } from '../components/layout/StatusBar';
import { MarsMap } from '../components/map/MarsMap';
import { MapControls } from '../components/map/MapControls';
import { MapLegend } from '../components/map/MapLegend';
import { MapLayers } from '../components/map/MapLayers';
import { RoutePlanner } from '../components/route/RoutePlanner';
import { RouteComparison } from '../components/route/RouteComparison';
import { MissionSummary } from '../components/route/MissionSummary';
import { SciencePanel } from '../components/science/SciencePanel';
import { HazardPanel } from '../components/hazards/HazardPanel';
import { EnvironmentPanel } from '../components/environment/EnvironmentPanel';
import { TerrainPanel } from '../components/terrain/TerrainPanel';
import { DocumentationModal } from '../components/common/DocumentationModal';

import { useMarsLayers } from '../hooks/useMarsLayers';
import { useRoutePlanner } from '../hooks/useRoutePlanner';
import { SCIENCE_CATALOG } from '../data/scienceCatalog';
import { HAZARDS_CATALOG } from '../data/hazardsCatalog';
import type { MarsCoordinate } from '../types/route';
import type { ScienceObservation } from '../types/science';
import type { HazardRecord } from '../types/hazards';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('route-plan');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [currentRegionName, setCurrentRegionName] = useState('Jezero Crater (Western Fan Delta)');

  const [cursorCoord, setCursorCoord] = useState<MarsCoordinate | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<MarsCoordinate | null>(null);
  const [centerTarget, setCenterTarget] = useState<MarsCoordinate | null>(null);

  const [selectedPOI, setSelectedPOI] = useState<ScienceObservation | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<HazardRecord | null>(null);

  // Custom Hooks
  const { layers, activeBaseLayer, activeOverlays, toggleLayer, setLayerOpacity } = useMarsLayers();
  const {
    startCoord,
    destCoord,
    setStartCoord,
    setDestCoord,
    method,
    setMethod,
    walkingSpeedKmh,
    setWalkingSpeedKmh,
    maxSlopeDeg,
    setMaxSlopeDeg,
    primaryRoute,
    alternativeRoute,
    hazardAssessment,
    nearbyScienceTargets,
    planningError,
    isPlanning,
    generateRoute,
    swapLocations,
    clearRoute
  } = useRoutePlanner();

  // Handlers
  const handleSelectCoordinate = useCallback((coord: MarsCoordinate) => {
    setSelectedCoord(coord);
  }, []);

  const handleSetStart = useCallback((coord: MarsCoordinate) => {
    setStartCoord(coord);
    setActiveTab('route-plan');
  }, [setStartCoord]);

  const handleSetDestination = useCallback((coord: MarsCoordinate) => {
    setDestCoord(coord);
    setActiveTab('route-plan');
  }, [setDestCoord]);

  const handleCenterMap = useCallback((coord: MarsCoordinate) => {
    setCenterTarget({ ...coord });
  }, []);

  const handleSelectPresetLocation = useCallback((coord: MarsCoordinate, name: string) => {
    setCurrentRegionName(name);
    setCenterTarget({ ...coord });
    setSelectedCoord(coord);
  }, []);

  const handleZoomIn = () => {
    // Leaflet zoom handled via native keyboard or container methods if needed
    window.dispatchEvent(new CustomEvent('ares-zoom-in'));
  };

  const handleZoomOut = () => {
    window.dispatchEvent(new CustomEvent('ares-zoom-out'));
  };

  const handleResetView = () => {
    setCenterTarget({ latitude: 18.4447, longitude: 77.4508 });
    setCurrentRegionName('Jezero Crater (Western Fan Delta)');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-mars-darkest font-sans select-none">
      {/* Top Header */}
      <AppHeader
        currentRegionName={currentRegionName}
        onSelectPresetLocation={handleSelectPresetLocation}
        onOpenDocs={() => setIsDocsOpen(true)}
        onToggleLayerDrawer={() => setActiveTab('layers')}
      />

      {/* Main Workspace: Left Sidebar + Central Map + Right Context Panel */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasActiveRoute={!!primaryRoute}
          hazardCount={HAZARDS_CATALOG.length}
          scienceCount={SCIENCE_CATALOG.length}
        />

        {/* Central Map Canvas */}
        <main className="flex-1 relative h-full overflow-hidden">
          <MarsMap
            activeBaseLayer={activeBaseLayer}
            activeOverlays={activeOverlays}
            startCoord={startCoord}
            destCoord={destCoord}
            primaryRoute={primaryRoute}
            alternativeRoute={alternativeRoute}
            sciencePOIs={SCIENCE_CATALOG}
            hazards={HAZARDS_CATALOG}
            onSelectCoordinate={handleSelectCoordinate}
            onSetStart={handleSetStart}
            onSetDestination={handleSetDestination}
            onCursorMove={setCursorCoord}
            selectedPOI={selectedPOI}
            selectedHazard={selectedHazard}
            centerTarget={centerTarget}
          />

          {/* Floating Map Controls & Search */}
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            onNavigateCoordinates={handleCenterMap}
          />

          {/* Cartographic Legend */}
          <MapLegend />
        </main>

        {/* Right Mission Intel Context Panel */}
        <aside className="w-96 border-l border-mars-border bg-mars-dark/95 backdrop-blur flex flex-col z-10 shrink-0 overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'layers' && (
              <MapLayers
                layers={layers}
                onToggleLayer={toggleLayer}
                onSetOpacity={setLayerOpacity}
              />
            )}

            {activeTab === 'route-plan' && (
              <RoutePlanner
                startCoord={startCoord}
                destCoord={destCoord}
                onSetStart={handleSetStart}
                onSetDestination={handleSetDestination}
                method={method}
                onSetMethod={setMethod}
                walkingSpeedKmh={walkingSpeedKmh}
                onSetWalkingSpeed={setWalkingSpeedKmh}
                maxSlopeDeg={maxSlopeDeg}
                onSetMaxSlope={setMaxSlopeDeg}
                onGenerateRoute={generateRoute}
                onSwapLocations={swapLocations}
                onClearRoute={clearRoute}
                primaryRoute={primaryRoute}
                planningError={planningError}
                isPlanning={isPlanning}
              />
            )}

            {activeTab === 'route-compare' && (
              <RouteComparison
                primaryRoute={primaryRoute}
                alternativeRoute={alternativeRoute}
              />
            )}

            {activeTab === 'mission-brief' && (
              <MissionSummary
                route={primaryRoute}
                hazardAssessment={hazardAssessment}
                nearbyScienceTargets={nearbyScienceTargets}
              />
            )}

            {activeTab === 'terrain' && <TerrainPanel />}

            {activeTab === 'hazards' && (
              <HazardPanel
                onCenterMap={handleCenterMap}
                selectedHazard={selectedHazard}
              />
            )}

            {activeTab === 'science' && (
              <SciencePanel
                onCenterMap={handleCenterMap}
                onConsiderForRoute={handleSetDestination}
              />
            )}

            {activeTab === 'environment' && <EnvironmentPanel />}
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        cursorCoord={cursorCoord}
        selectedCoord={selectedCoord}
        selectedElevation={selectedCoord?.elevationMeters}
        activeBaseLayerName={activeBaseLayer.name}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
};
