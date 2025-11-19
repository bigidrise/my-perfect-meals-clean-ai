// server/services/mealImageGenerator.ts
// DALL-E 3 meal image generation with permanent storage via Replit Object Storage

import OpenAI from 'openai';
import crypto from 'crypto';
import { uploadImageToPermanentStorage, checkImageExists } from './permanentImageStorage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface MealImageRequest {
  mealName: string;
  ingredients: string[];
  style?: 'overhead' | 'plated' | 'rustic' | 'restaurant';
  templateRef?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  templateRef?: string;
  hash: string;
  createdAt: string;
}

// In-memory cache for generated images (replace with database/Redis in production)
const imageCache = new Map<string, GeneratedImage>();

// Generate stable hash for caching
function generateImageHash(request: MealImageRequest): string {
  const key = `${request.mealName}-${request.ingredients.join(',')}-${request.style || 'overhead'}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

// Extract cooking method visual cues for premium image differentiation
function extractCookingCues(mealName: string): string {
  const nameLower = mealName.toLowerCase();
  
  // Egg preparations - highly visual differences
  if (nameLower.includes('scrambled')) return 'fluffy scrambled texture, soft curds, slightly wet appearance';
  if (nameLower.includes('sunny side up') || nameLower.includes('sunny-side')) return 'perfectly round yolk, white fully set, crispy edges';
  if (nameLower.includes('over easy')) return 'glossy yolk visible through translucent white, runny center';
  if (nameLower.includes('over hard')) return 'fully cooked yolk, firm white, no runniness';
  if (nameLower.includes('poached')) return 'teardrop shape, silky white coating runny yolk, delicate appearance';
  if (nameLower.includes('hard-boiled') || nameLower.includes('hard boiled')) return 'firm oval shape, sliced to show yellow yolk, smooth white';
  if (nameLower.includes('soft-boiled') || nameLower.includes('soft boiled')) return 'halved with jammy yolk, creamy center, firm white edges';
  if (nameLower.includes('omelette') || nameLower.includes('omelet')) return 'folded half-moon, golden surface, fluffy interior visible';
  if (nameLower.includes('fried egg')) return 'crispy lacy edges, golden yolk, white fully cooked';
  
  // Meat preparations
  if (nameLower.includes('grilled')) return 'distinct grill marks, charred edges, caramelized exterior';
  if (nameLower.includes('pan-seared') || nameLower.includes('seared')) return 'golden-brown crust, caramelized surface, rich color';
  if (nameLower.includes('baked')) return 'even golden color, tender appearance, no grill marks';
  if (nameLower.includes('blackened')) return 'dark spice crust, Cajun seasoning visible, charred appearance';
  if (nameLower.includes('roasted')) return 'deep caramelization, crispy exterior, herb-crusted';
  if (nameLower.includes('broiled')) return 'top surface deeply browned, caramelized edges, intense color';
  if (nameLower.includes('steamed')) return 'moist surface, tender texture, no browning';
  
  // Steak doneness
  if (nameLower.includes('rare')) return 'bright red center, seared exterior, very juicy';
  if (nameLower.includes('medium-rare')) return 'warm red center, pink throughout, perfect sear';
  if (nameLower.includes('medium')) return 'warm pink center, browned exterior, firm texture';
  if (nameLower.includes('well-done')) return 'fully brown throughout, no pink, firm texture';
  
  // Rice/grain preparations
  if (nameLower.includes('fried rice')) return 'individual grains separated, lightly toasted, vegetables mixed throughout';
  if (nameLower.includes('steamed rice')) return 'fluffy individual grains, pure white color, glossy surface';
  if (nameLower.includes('pilaf')) return 'golden toasted grains, fluffy texture, herb-flecked';
  
  // Vegetables
  if (nameLower.includes('steamed') && nameLower.includes('broccoli')) return 'vibrant green, tender florets, slight sheen';
  if (nameLower.includes('roasted') && nameLower.includes('vegetables')) return 'caramelized edges, golden-brown spots, charred tips';
  if (nameLower.includes('sautéed') || nameLower.includes('sauteed')) return 'glistening with oil, tender-crisp, lightly browned';
  if (nameLower.includes('stir-fry') || nameLower.includes('stir fry')) return 'glossy sauce coating, vibrant colors, wok char visible';
  
  return ''; // No specific cooking method detected
}

// Create deterministic prompts with cooking method differentiation for premium quality
function createImagePrompt(request: MealImageRequest): string {
  const { mealName, ingredients, style = 'overhead' } = request;
  
  const baseStyle = {
    overhead: "overhead 3/4 view on clean white plate, neutral matte background, soft natural lighting",
    plated: "beautifully plated on elegant dish, restaurant presentation, soft natural lighting", 
    rustic: "rustic home-style presentation on wooden table, warm natural lighting",
    restaurant: "professional restaurant plating, garnished, clean presentation"
  }[style];
  
  const ingredientList = ingredients.slice(0, 4).join(', ');
  
  // Extract cooking-specific visual cues for differentiation
  const cookingCues = extractCookingCues(mealName);
  const cookingDetails = cookingCues ? `, ${cookingCues}` : '';
  
  return `${mealName} featuring ${ingredientList}${cookingDetails}, ${baseStyle}, professional food photography, realistic, appetizing, high-end presentation, no text, no logos, magazine quality, highly detailed`;
}

// Generate meal image using DALL-E 3 and store permanently
export async function generateMealImage(request: MealImageRequest): Promise<GeneratedImage> {
  const hash = generateImageHash(request);
  
  // Check cache first
  const cached = imageCache.get(hash);
  if (cached) {
    console.log(`🎨 Using cached image for ${request.mealName}`);
    return cached;
  }
  
  // Check if already exists in permanent storage
  const existingUrl = await checkImageExists(hash);
  if (existingUrl) {
    console.log(`🎨 Found existing permanent image for ${request.mealName}`);
    const result: GeneratedImage = {
      url: existingUrl,
      prompt: createImagePrompt(request),
      templateRef: request.templateRef,
      hash,
      createdAt: new Date().toISOString()
    };
    imageCache.set(hash, result);
    return result;
  }
  
  const prompt = createImagePrompt(request);
  console.log(`🎨 Generating image for: ${request.mealName}`);
  console.log(`📝 Prompt: ${prompt}`);
  
  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });
    
    const tempUrl = response.data?.[0]?.url;
    if (!tempUrl) {
      throw new Error('No image URL returned from DALL-E');
    }
    
    // Upload to permanent storage immediately
    console.log(`📦 Uploading to permanent storage...`);
    const uploadResult = await uploadImageToPermanentStorage({
      imageUrl: tempUrl,
      mealName: request.mealName,
      imageHash: hash,
    });
    
    const result: GeneratedImage = {
      url: uploadResult.permanentUrl,
      prompt,
      templateRef: request.templateRef,
      hash,
      createdAt: uploadResult.uploadedAt
    };
    
    // Cache the result with permanent URL
    imageCache.set(hash, result);
    console.log(`✅ Generated and stored permanent image for ${request.mealName}`);
    
    return result;
    
  } catch (error: any) {
    console.error(`❌ Failed to generate image for ${request.mealName}:`, error.message);
    
    // Return fallback image info instead of throwing
    const fallback: GeneratedImage = {
      url: `/assets/meals/default-${request.mealName.toLowerCase().includes('breakfast') ? 'breakfast' : 
             request.mealName.toLowerCase().includes('lunch') ? 'lunch' : 'dinner'}.svg`,
      prompt: `Fallback for: ${prompt}`,
      templateRef: request.templateRef,
      hash,
      createdAt: new Date().toISOString()
    };
    
    imageCache.set(hash, fallback);
    return fallback;
  }
}

// Batch generate images for multiple meals
export async function generateMealImages(requests: MealImageRequest[]): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];
  
  // Process in small batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    
    const batchPromises = batch.map(request => 
      generateMealImage(request).catch(error => {
        console.error(`Batch error for ${request.mealName}:`, error);
        return {
          url: `/assets/meals/default-dinner.svg`,
          prompt: `Error: ${error.message}`,
          hash: generateImageHash(request),
          createdAt: new Date().toISOString()
        };
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Get cached image if available
export function getCachedImage(request: MealImageRequest): GeneratedImage | null {
  const hash = generateImageHash(request);
  return imageCache.get(hash) || null;
}

// Clear cache (for development/testing)
export function clearImageCache(): void {
  imageCache.clear();
  console.log('🗑️ Image cache cleared');
}

// Get cache statistics
export function getImageCacheStats(): { size: number; entries: string[] } {
  return {
    size: imageCache.size,
    entries: Array.from(imageCache.keys())
  };
}