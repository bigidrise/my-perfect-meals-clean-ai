/**
 * Bootstrap Entry Point
 * 
 * This file runs FIRST to patch console methods before any other
 * imports with side effects can execute. It then dynamically imports
 * the real application entry point.
 */

// Silence noisy console methods in production BEFORE any imports
if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  // Preserve console.error and console.warn for production debugging
}

// Now dynamically import the real application entry
import('./app-entry');
