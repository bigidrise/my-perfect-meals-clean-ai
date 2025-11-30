import OpenAI from "openai";

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CaptureCallbacks {
  onStart?: () => void;
  onAnalyzing?: () => void;
  onSuccess?: (result: MacroResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function launchMacroPhotoCapture(callbacks?: CaptureCallbacks): Promise<MacroResult | null> {
  return new Promise((resolve) => {
    try {
      callbacks?.onStart?.();
      
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment" as any;
      
      input.style.display = "none";
      document.body.appendChild(input);
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        
        document.body.removeChild(input);
        
        if (!file) {
          console.log("[PhotoCapture] No file selected");
          callbacks?.onCancel?.();
          resolve(null);
          return;
        }

        console.log("[PhotoCapture] File selected:", file.name);
        callbacks?.onAnalyzing?.();

        const reader = new FileReader();
        
        reader.onerror = () => {
          console.error("[PhotoCapture] FileReader error");
          callbacks?.onError?.("Could not read the image file.");
          resolve(null);
        };
        
        reader.onloadend = async () => {
          try {
            const imageDataUrl = reader.result as string;
            
            if (!imageDataUrl) {
              throw new Error("Failed to convert image to data URL");
            }

            console.log("[PhotoCapture] Sending to AI...");

            const response = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a nutrition AI that analyzes food images and estimates nutrition values. Respond ONLY in JSON format with keys: calories, protein, carbs, fat (all numbers).",
                },
                {
                  role: "user",
                  content: [
                    { type: "text", text: "Estimate the calories, protein (g), carbs (g), and fat (g) in this meal. Return only a JSON object." },
                    { type: "image_url", image_url: { url: imageDataUrl } },
                  ],
                },
              ],
              response_format: { type: "json_object" },
            });

            const parsed = JSON.parse(response.choices[0].message.content || "{}");
            const result: MacroResult = {
              calories: Number(parsed.calories) || 0,
              protein: Number(parsed.protein) || 0,
              carbs: Number(parsed.carbs) || 0,
              fat: Number(parsed.fat) || 0,
            };

            console.log("[PhotoCapture] AI analysis complete:", result);
            callbacks?.onSuccess?.(result);
            resolve(result);
          } catch (err) {
            console.error("[PhotoCapture] AI analysis failed:", err);
            callbacks?.onError?.("Could not analyze photo. Please try again.");
            resolve(null);
          }
        };
        
        reader.readAsDataURL(file);
      };
      
      input.click();
    } catch (err) {
      console.error("[PhotoCapture] Failed:", err);
      callbacks?.onError?.("Could not access camera. Please try again.");
      resolve(null);
    }
  });
}
