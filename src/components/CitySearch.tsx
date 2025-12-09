import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { useWeather } from '../contexts/WeatherContext';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_API_BASE_URL, MAPBOX_SEARCH_LIMIT, MAPBOX_SEARCH_TYPES } from '../constants/mapbox';

type MapboxFeature = {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    name: string;
    name_preferred: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
    place_formatted?: string;
  };
}

type MapboxResponse = {
  type: string;
  features: MapboxFeature[];
}

const CitySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const { setCity } = useWeather();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetQuery(searchQuery);
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [searchQuery, debouncedSetQuery]);

  // React Query for city search with caching
  const { data, isLoading: isSearching } = useQuery({
    queryKey: ['citySearch', debouncedQuery],
    queryFn: async (): Promise<MapboxFeature[]> => {
      if (!debouncedQuery.trim()) {
        return [];
      }

      const url = `${MAPBOX_API_BASE_URL}?q=${encodeURIComponent(debouncedQuery)}&access_token=${MAPBOX_ACCESS_TOKEN}&types=${MAPBOX_SEARCH_TYPES}&limit=${MAPBOX_SEARCH_LIMIT}`;
      const response = await fetch(url);
      const data: MapboxResponse = await response.json();
      return data.features || [];
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: Infinity,
  });

  const results = data || [];

  // Auto-select first result when results are available
  useEffect(() => {
    if (results.length > 0 && showResults && !isSearching) {
      setSelectedIndex(0);
    }
  }, [results, showResults, isSearching]);

  const handleSelectCity = (feature: MapboxFeature) => {
    const cityName = feature.properties.name_preferred || feature.properties.name;
    const { latitude, longitude } = feature.properties.coordinates;
    setCity({ name: cityName, latitude, longitude });
    setSearchQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    setMobileExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || results.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        // If no results, could trigger a search or do nothing
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        // If no specific index selected, use first result (index 0)
        const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;
        if (indexToSelect < results.length) {
          handleSelectCity(results[indexToSelect]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
    if (e.target.value.trim()) {
      setShowResults(true);
    }
  };

  const handleInputFocus = () => {
    if (results.length > 0 || isSearching) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click events on results to fire first
    setTimeout(() => {
      if (!resultsRef.current?.contains(document.activeElement)) {
        setShowResults(false);
        if (!searchQuery.trim()) {
          setMobileExpanded(false);
        }
      }
    }, 200);
  };

  const handleExpandMobile = () => {
    setMobileExpanded(true);
    // Ensure focus occurs after state update
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCollapseMobile = () => {
    setMobileExpanded(false);
    setSearchQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {!mobileExpanded && (
          <button
            type="button"
            onClick={handleExpandMobile}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-white text-2xl leading-none shadow-sm transition hover:bg-white/35 focus:outline-none focus:ring-2 focus:ring-white/60 md:hidden"
            aria-label="Add city"
          >
            +
          </button>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search city..."
            className={clsx(
              'py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200',
              mobileExpanded ? 'px-4 w-48 opacity-100 translate-y-0 scale-100' : 'px-0 w-0 opacity-0 -translate-y-1 scale-95 pointer-events-none',
              'md:px-4 md:w-64 md:opacity-100 md:translate-y-0 md:scale-100 md:pointer-events-auto'
            )}
          />

          {showResults && (results.length > 0 || isSearching) && (
            <div
              ref={resultsRef}
              className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden z-50 max-h-64 overflow-y-auto"
            >
              {isSearching && results.length === 0 ? (
                <div className="px-4 py-2 text-white/70 text-center">Searching...</div>
              ) : (
                results.map((feature, index) => {
                  const cityName = feature.properties.name_preferred || feature.properties.name;
                  const placeFormatted = feature.properties.place_formatted || '';
                  
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleSelectCity(feature)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-white/30 transition-colors ${
                        index === selectedIndex ? 'bg-white/30' : ''
                      }`}
                    >
                      <div className="font-medium">{cityName}</div>
                      {placeFormatted && (
                        <div className="text-sm text-white/70">{placeFormatted}</div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {mobileExpanded && (
          <button
            type="button"
            onClick={handleCollapseMobile}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white text-lg leading-none shadow-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 md:hidden"
            aria-label="Close search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default CitySearch;
