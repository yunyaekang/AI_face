
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:*/*;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeFace = async (imageFile: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured in environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: imageFile.type,
    },
  };

  const textPart = {
    text: "이 얼굴 사진을 분석해주세요. 한국어로 답변해주세요. 얼굴의 특징, 전체적인 인상, 그리고 사진에서 드러나는 감정 상태에 대해 상세하고 긍정적인 관점에서 설명해주세요."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from AI. Please check the API configuration and try again.");
  }
};
