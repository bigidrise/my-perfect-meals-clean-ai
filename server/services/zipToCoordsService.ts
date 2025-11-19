// ZIP Code to Coordinates Service
// Converts US ZIP codes to latitude/longitude using Google Geocoding API
// Implements 24-hour caching to minimize API calls

import axios from 'axios';

interface Coordinates {
  lat: number;
  lng: number;
}

interface CacheEntry {
  coords: Coordinates;
  timestamp: number;
}

// In-memory cache: ZIP -> { coords, timestamp }
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Basic fallback data for common ZIP codes if API fails
// This could be expanded or loaded from a more comprehensive source
const fallbackZipData: { [key: string]: Coordinates } = {
  "90210": { lat: 34.0901, lng: -118.4093 }, // Beverly Hills, CA
  "10001": { lat: 40.7506, lng: -73.9970 }, // New York, NY
  "60601": { lat: 41.8818, lng: -87.6231 }, // Chicago, IL
  "75001": { lat: 32.9566, lng: -96.8647 }, // Addison, TX
  "94107": { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
};

function getFallbackCoordinates(zipCode: string): Coordinates | null {
  return fallbackZipData[zipCode] || null;
}

/**
 * Convert ZIP code to coordinates using Google Geocoding API
 * Returns cached result if available and fresh (< 24h old)
 */
export async function zipToCoordinates(zipCode: string): Promise<Coordinates | null> {
  // Validate ZIP code format (5 digits)
  if (!/^\d{5}$/.test(zipCode)) {
    console.error('❌ Invalid ZIP code format:', zipCode);
    return null;
  }

  // Check cache first
  const cached = cache.get(zipCode);
  if (cached) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_DURATION_MS) {
      console.log(`✅ Using cached coordinates for ZIP ${zipCode}`);
      return cached.coords;
    } else {
      // Expired cache entry
      cache.delete(zipCode);
    }
  }

  // Fetch from Google Geocoding API
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_PLACES_API_KEY not configured');
    // Attempt fallback if API key is missing
    const fallbackCoords = getFallbackCoordinates(zipCode);
    if (fallbackCoords) {
      console.log(`✅ Using fallback coordinates as API key is missing for ZIP ${zipCode}`);
      return fallbackCoords;
    }
    return null;
  }

  try {
    console.log(`🔍 Geocoding ZIP code: ${zipCode}`);

    // Auto-append USA to ensure proper geocoding
    const address = `${zipCode}, USA`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(url, {
      params: {
        address: address,
        components: 'country:US', // Force US-only results
        key: apiKey
      },
      timeout: 5000
    });

    if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const coords: Coordinates = {
        lat: location.lat,
        lng: location.lng
      };

      // Cache the result
      cache.set(zipCode, {
        coords,
        timestamp: Date.now()
      });

      console.log(`✅ Geocoded ZIP ${zipCode} to (${coords.lat}, ${coords.lng})`);
      return coords;
    }

    // Fallback: Use hardcoded ZIP centroid lookup for common ZIPs
    console.warn(`⚠️ Geocoding returned ${response.data.status} for ZIP ${zipCode}, trying fallback`);
    const fallbackCoords = getFallbackCoordinates(zipCode);

    if (fallbackCoords) {
      console.log(`✅ Using fallback coordinates for ZIP ${zipCode}`);
      // Cache fallback result too
      cache.set(zipCode, {
        coords: fallbackCoords,
        timestamp: Date.now()
      });
      return fallbackCoords;
    }

    console.error(`❌ No fallback available for ZIP ${zipCode}`);
    return null;

  } catch (error) {
    console.error(`❌ Geocoding API error for ZIP ${zipCode}:`, error);

    // Try fallback even on network error
    const fallbackCoords = getFallbackCoordinates(zipCode);
    if (fallbackCoords) {
      console.log(`✅ Using fallback coordinates after error for ZIP ${zipCode}`);
      return fallbackCoords;
    }

    return null;
  }
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearCache() {
  cache.clear();
  console.log('🗑️ ZIP coordinate cache cleared');
}