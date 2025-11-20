
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { analyzeFace } from './services/geminiService';
import { CameraIcon, SparklesIcon, ArrowUturnLeftIcon } from './components/Icons';

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    resetState();
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      setImageUrl(url);
      setIsLoading(true);
      try {
        const result = await analyzeFace(file);
        setAnalysis(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(`분석 중 오류가 발생했습니다: ${err.message}`);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            AI 얼굴 분석기
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            사진을 업로드하여 당신의 얼굴을 분석해보세요.
          </p>
        </header>

        <main className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 transition-all duration-300">
          {!imageUrl && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}

          {imageUrl && (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-sm mb-6">
                <img 
                  src={imageUrl} 
                  alt="Uploaded face" 
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
                <button
                  onClick={resetState}
                  className="absolute -top-3 -right-3 bg-white text-slate-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500 transition-all transform hover:scale-110"
                  aria-label="Remove image"
                >
                  <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center text-center">
                  <Spinner />
                  <p className="mt-4 text-lg text-violet-600 animate-pulse">
                    AI가 당신의 얼굴을 분석하고 있습니다...
                  </p>
                </div>
              )}
              
              {analysis && !isLoading && (
                <ResultDisplay text={analysis} />
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-100 text-red-700 border border-red-200 rounded-lg p-4 text-center">
              <p>{error}</p>
            </div>
          )}
        </main>

        <footer className="text-center mt-8 text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Face Analyzer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}