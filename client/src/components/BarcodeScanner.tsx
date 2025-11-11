
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onItemScanned: (barcode: string, productName: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onItemScanned, onClose, isLoading = false }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const lastScanTime = useRef<number>(0);

  // Check if native BarcodeDetector is available
  const supportsNativeBarcodeDetector = 'BarcodeDetector' in window;

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
        setError(null);
        
        // Start scanning after video is ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setTimeout(() => scanBarcode(), 500); // Give camera time to focus
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please allow camera permissions or use manual entry.');
      setManualEntry(true);
    }
  };

  const scanBarcode = async () => {
    if (!scanning || !videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanBarcode);
      return;
    }

    // Prevent scanning too frequently
    const now = Date.now();
    if (now - lastScanTime.current < 300) {
      animationFrameRef.current = requestAnimationFrame(scanBarcode);
      return;
    }

    try {
      if (supportsNativeBarcodeDetector) {
        // Use native BarcodeDetector API (Chrome, Edge)
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'code_39']
        });

        const barcodes = await barcodeDetector.detect(videoRef.current);
        
        if (barcodes.length > 0) {
          const barcode = barcodes[0].rawValue;
          console.log('📱 Barcode detected:', barcode);
          lastScanTime.current = now;
          handleBarcodeDetected(barcode);
          return;
        }
      } else {
        // Fallback: Use canvas + ZXing for Safari/Firefox
        await scanWithZXing();
      }
    } catch (err) {
      console.log('Scan attempt error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(scanBarcode);
  };

  const scanWithZXing = async () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Dynamically import ZXing
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const codeReader = new BrowserMultiFormatReader();
      
      // Try to decode from the canvas
      const result = await codeReader.decodeFromCanvas(canvas);
      if (result) {
        const barcode = result.getText();
        console.log('📱 Barcode detected (ZXing):', barcode);
        const now = Date.now();
        lastScanTime.current = now;
        handleBarcodeDetected(barcode);
      }
    } catch (err) {
      // No barcode found in this frame - this is normal, keep scanning
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    stopCamera();

    try {
      const normalizedBarcode = barcode.replace(/\s+/g, '').replace(/^0+/, '');
      
      const response = await fetch(`/api/barcode/${encodeURIComponent(normalizedBarcode)}`);
      
      let productName = "Unknown Product";
      
      if (response.ok) {
        const food = await response.json();
        productName = food.brand ? `${food.brand} ${food.name}` : food.name;
      } else {
        productName = `Product ${normalizedBarcode}`;
      }
      
      onItemScanned(normalizedBarcode, productName);
    } catch (err) {
      console.error('Barcode lookup error:', err);
      onItemScanned(barcode, `Product ${barcode}`);
    }
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim());
    }
  };

  useEffect(() => {
    // Auto-start camera on mount
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (manualEntry) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-black/30 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Enter Barcode Manually
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Barcode Number</label>
              <Input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number..."
                className="bg-white/10 border-white/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleManualSubmit}
                disabled={!manualBarcode.trim() || isLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Looking up...
                  </>
                ) : (
                  'Add to List'
                )}
              </Button>
              <Button
                onClick={() => setManualEntry(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Try Camera
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/30 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Scan Barcode
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Video Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              playsInline
              muted
              autoPlay
            />
            
            {/* Scanning overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-4 border-orange-500 rounded-lg animate-pulse">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 animate-scan"></div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
              <span className="text-white">Looking up product...</span>
            </div>
          )}

          {/* Scanning Tips */}
          {scanning && !error && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
              <div className="text-sm text-orange-200 space-y-2">
                <div className="font-semibold mb-2">📱 Scanning Tips:</div>
                <div>• Hold phone 6-8 inches from barcode</div>
                <div>• Make sure barcode is well-lit</div>
                <div>• Keep phone steady</div>
                <div>• Line up barcode in the orange box</div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            {scanning && (
              <Button 
                onClick={stopCamera}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Stop Scanning
              </Button>
            )}

            {!scanning && !error && (
              <Button 
                onClick={startCamera}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Start Scanning
              </Button>
            )}

            <Button
              onClick={() => setManualEntry(true)}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Manual Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
