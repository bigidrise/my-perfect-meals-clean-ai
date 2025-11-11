import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, X, CheckCircle } from 'lucide-react';

interface ScanResult {
  decodedText: string;
  result: any;
}

interface Food {
  food_id: string;
  barcode: string;
  name: string;
  brand?: string;
  serving_sizes: Array<{ label: string; grams: number }>;
  nutr_per_serving: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
  };
  verified: boolean;
  source: string;
}

interface BarcodeScannerProps {
  onItemScanned: (barcode: string, productName: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onFoodFound, onClose, isLoading = false }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const scannerRef = useRef<HTMLDivElement>(null);

  // Auto-start scanner on mount
  useEffect(() => {
    if (cameraPermission === 'granted' && !scanning) {
      setScanning(true);
    }
  }, [cameraPermission]);

  // Initialize scanner
  useEffect(() => {
    if (!scanning || !scannerRef.current) return;

    const html5QrCodeScanner = new Html5QrcodeScanner(
      "barcode-scanner",
      {
        fps: 10,
        qrbox: { width: 280, height: 120 },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false // verbose logging
    );

    const onScanSuccess = async (decodedText: string, decodedResult: any) => {
      console.log("📱 Barcode scanned:", decodedText);
      setError(null);
      
      try {
        // Normalize barcode (remove spaces, leading zeros)
        const normalizedBarcode = decodedText.replace(/\s+/g, '').replace(/^0+/, '');
        
        // Look up the barcode to get product name
        const response = await fetch(`/api/barcode/${encodeURIComponent(normalizedBarcode)}`);
        
        let productName = "Unknown Product";
        
        if (response.ok) {
          const food = await response.json();
          productName = food.brand ? `${food.brand} ${food.name}` : food.name;
          console.log("✅ Product found:", productName);
        } else {
          // Even if not found in database, still add with barcode
          console.log("⚠️ Product not in database, adding with barcode only");
          productName = `Product ${normalizedBarcode}`;
        }
        
        // Stop scanner and add to shopping list
        html5QrCodeScanner.clear();
        setScanning(false);
        onItemScanned(normalizedBarcode, productName);
      } catch (err) {
        console.error("❌ Barcode scan error:", err);
        // Still add to list even on error
        const productName = `Product ${decodedText}`;
        html5QrCodeScanner.clear();
        setScanning(false);
        onItemScanned(decodedText, productName);
      }
    };

    const onScanFailure = (error: string) => {
      // Silent fail for scan attempts - this is normal
      if (!error.includes("NotFoundException")) {
        console.warn("Scan attempt failed:", error);
      }
    };

    html5QrCodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrCodeScanner);

    return () => {
      if (html5QrCodeScanner) {
        try {
          html5QrCodeScanner.clear();
        } catch (e) {
          console.warn("Scanner cleanup error:", e);
        }
      }
    };
  }, [scanning, onFoodFound]);

  // Check camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraPermission('denied');
          setError('Camera not supported on this device');
          return;
        }

        // Try to get camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Prefer back camera
        });
        
        // Success - stop the stream and set permission
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission('granted');
      } catch (err) {
        console.error("Camera permission error:", err);
        setCameraPermission('denied');
        setError('Camera access denied. Please enable camera permissions.');
      }
    };

    checkCameraPermission();
  }, []);

  const startScanning = () => {
    if (cameraPermission === 'granted') {
      setScanning(true);
      setError(null);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

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
          {/* Camera Permission Status */}
          {cameraPermission === 'pending' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Checking camera access...</span>
            </div>
          )}

          {cameraPermission === 'denied' && (
            <div className="text-center py-8">
              <div className="text-red-400 mb-4">Camera access is required to scan barcodes</div>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
            </div>
          )}

          {/* Scanner auto-starts when ready */}

          {/* Active Scanner */}
          {scanning && (
            <div className="space-y-4">
              <div 
                id="barcode-scanner" 
                ref={scannerRef}
                className="w-full rounded-lg overflow-hidden"
              />
              <div className="flex justify-center">
                <Button 
                  onClick={stopScanning}
                  className="bg-black text-white border border-white/20 hover:bg-black/90"
                >
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}

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

          {/* Supported Formats */}
          <div className="text-center text-xs text-gray-400">
            <div className="mb-2">Supported formats:</div>
            <div className="flex flex-wrap justify-center gap-1">
              {['UPC-A', 'UPC-E', 'EAN-13', 'EAN-8', 'Code 128', 'Code 39', 'QR Code'].map(format => (
                <Badge key={format} variant="outline" className="text-gray-400 border-gray-600">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;