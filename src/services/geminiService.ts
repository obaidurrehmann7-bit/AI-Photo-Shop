import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ImageAnalysis {
  productName: string;
  category: string;
  lightingQuality: "low" | "medium" | "high";
  suggestedEdits: string[];
  platformResizing: string[];
  backgroundDescription: string;
  studioScore: number;
}

export async function analyzeProductPhoto(base64Image: string): Promise<ImageAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: `You are an expert e-commerce photographer and conversion specialist. 
          Analyze this product photo and provide a detailed assessment for an online seller.
          Return the analysis in JSON format with the following fields:
          - productName: A descriptive name for the product.
          - category: The product category (e.g., Electronics, Fashion, Home Decor).
          - lightingQuality: "low", "medium", or "high".
          - suggestedEdits: An array of 3-5 specific technical edits (e.g., "Increase contrast by 15%", "Correct white balance").
          - platformResizing: Ideal platforms for this photo (e.g., "Amazon", "Shopify").
          - backgroundDescription: Describe the current background and suggest a "Studio" quality background.
          - studioScore: A score from 0-100 on how "studio-ready" the photo is.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          category: { type: Type.STRING },
          lightingQuality: { type: Type.STRING, enum: ["low", "medium", "high"] },
          suggestedEdits: { type: Type.ARRAY, items: { type: Type.STRING } },
          platformResizing: { type: Type.ARRAY, items: { type: Type.STRING } },
          backgroundDescription: { type: Type.STRING },
          studioScore: { type: Type.NUMBER },
        },
        required: ["productName", "category", "lightingQuality", "suggestedEdits", "platformResizing", "backgroundDescription", "studioScore"],
      },
    },
  });

  return JSON.parse(response.text);
}
