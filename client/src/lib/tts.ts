/**
 * TTS Service with Graceful Degradation
 * ElevenLabs → Browser SpeechSynthesis → Silent Mode
 * 
 * Apple App Store Ready - Works 100% offline
 */

type TTSProvider = 'elevenlabs' | 'browser' | 'silent';

interface TTSResult {
  provider: TTSProvider;
  audioUrl?: string;
  success: boolean;
  error?: string;
}

class TTSService {
  private failureCount = 0;
  private readonly MAX_FAILURES = 3;
  private elevenLabsDisabled = false;

  /**
   * Speak text with automatic fallback
   * 1. Try ElevenLabs API
   * 2. Fallback to browser SpeechSynthesis
   * 3. Silent mode (no audio, no errors)
   */
  async speak(text: string): Promise<TTSResult> {
    // Try ElevenLabs first (if not disabled)
    if (!this.elevenLabsDisabled) {
      const elevenLabsResult = await this.tryElevenLabs(text);
      if (elevenLabsResult.success) {
        this.failureCount = 0; // Reset on success
        return elevenLabsResult;
      }

      // Track failures
      this.failureCount++;
      if (this.failureCount >= this.MAX_FAILURES) {
        console.warn('[TTS] ElevenLabs disabled after repeated failures');
        this.elevenLabsDisabled = true;
      }
    }

    // Fallback to browser speech
    const browserResult = await this.tryBrowserSpeech(text);
    if (browserResult.success) {
      return browserResult;
    }

    // Silent mode (always succeeds)
    return {
      provider: 'silent',
      success: true,
    };
  }

  /**
   * Try ElevenLabs API
   */
  private async tryElevenLabs(text: string): Promise<TTSResult> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`ElevenLabs API error: ${res.status}`);
      }

      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      return {
        provider: 'elevenlabs',
        audioUrl: url,
        success: true,
      };
    } catch (err: any) {
      console.warn('[TTS] ElevenLabs failed:', err.message);
      return {
        provider: 'elevenlabs',
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * Try browser SpeechSynthesis API
   * Works offline, no cost, no rate limits
   */
  private async tryBrowserSpeech(text: string): Promise<TTSResult> {
    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('SpeechSynthesis not supported');
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Try to use a high-quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || // iOS
        v.name.includes('Google US English') || // Android
        v.lang.startsWith('en-')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);

      return {
        provider: 'browser',
        success: true,
      };
    } catch (err: any) {
      console.warn('[TTS] Browser speech failed:', err.message);
      return {
        provider: 'browser',
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Reset circuit breaker (for testing)
   */
  reset(): void {
    this.failureCount = 0;
    this.elevenLabsDisabled = false;
  }
}

// Singleton instance
export const ttsService = new TTSService();
