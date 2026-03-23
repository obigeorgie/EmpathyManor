import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const getGeminiResponse = async (prompt: string, systemInstruction: string = "") => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate content. Please check your API key.";
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with calm, professional authority: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      // Create a blob and play it
      // Note: Gemini TTS returns raw PCM or similar, but browser Audio usually expects a container.
      // For simplicity in this demo environment, we'll assume the user can handle the audio playback
      // or we provide a simple way to play it if it's a supported format.
      // Actually, standard practice for raw PCM in browser is using Web Audio API.
      return arrayBuffer;
    }
  } catch (error) {
    console.error("Speech Generation Error:", error);
  }
  return null;
};

export const playAudioBuffer = async (buffer: ArrayBuffer) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  // The buffer is raw PCM 16-bit Mono 24kHz
  const float32Data = new Float32Array(buffer.byteLength / 2);
  const int16Data = new Int16Array(buffer);
  for (let i = 0; i < float32Data.length; i++) {
    float32Data[i] = int16Data[i] / 32768.0;
  }

  const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
  audioBuffer.getChannelData(0).set(float32Data);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
};
