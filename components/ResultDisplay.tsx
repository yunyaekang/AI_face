
import React, { useState, useEffect } from 'react';
import { SparklesIcon, ClipboardIcon, CheckIcon, ShareIcon, KakaoIcon, DownloadIcon } from './Icons';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ResultDisplayProps {
  text: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setIsShareSupported(true);
    }
    
    if (window.Kakao) {
      // TODO: Replace with your actual Kakao JavaScript Key from Kakao Developers.
      const KAKAO_JAVASCRIPT_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY'; 
      
      if (KAKAO_JAVASCRIPT_KEY !== 'YOUR_KAKAO_JAVASCRIPT_KEY' && !window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
          if (window.Kakao.isInitialized()) {
            setIsKakaoInitialized(true);
          }
        } catch (error) {
          console.error('Kakao SDK initialization failed:', error);
          setIsKakaoInitialized(false);
        }
      } else if (window.Kakao.isInitialized()) {
        setIsKakaoInitialized(true);
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!isShareSupported) return;
    try {
      await navigator.share({
        title: 'AI 얼굴 분석 결과',
        text: text,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Sharing failed or was cancelled.', error);
    }
  };

  const handleKakaoShare = () => {
    if (!isKakaoInitialized) {
        alert('Kakao SDK has not been initialized. Please ensure you have provided a valid API key.');
        return;
    };
    
    window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: `AI 얼굴 분석 결과:\n\n${text}`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
        buttons: [
            {
                title: '결과 확인하기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_face_analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const buttonClasses = "bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-violet-500 transition-colors flex items-center text-sm";

  return (
    <div className="w-full animate-fade-in mt-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center">
          <SparklesIcon className="w-6 h-6 mr-2" />
          AI 분석 결과
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className={buttonClasses}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-1.5 text-green-500" />
                복사 완료!
              </>
            ) : (
              <>
                <ClipboardIcon className="w-4 h-4 mr-1.5" />
                결과 복사
              </>
            )}
          </button>
          {isShareSupported && (
            <button
              onClick={handleShare}
              className={buttonClasses}
              aria-label="Share analysis results"
            >
              <ShareIcon className="w-4 h-4 mr-1.5" />
              공유하기
            </button>
          )}
          {isKakaoInitialized && (
            <button
              onClick={handleKakaoShare}
              className="bg-[#FEE500] text-[#3C1E1E] px-3 py-1.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-yellow-400 transition-opacity flex items-center text-sm font-bold"
              aria-label="Share on KakaoTalk"
            >
              <KakaoIcon className="w-4 h-4 mr-1.5" />
              카톡 공유
            </button>
          )}
          <button
            onClick={handleDownload}
            className={buttonClasses}
            aria-label="Download analysis results"
          >
            <DownloadIcon className="w-4 h-4 mr-1.5" />
            다운로드
          </button>
        </div>
      </div>
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};