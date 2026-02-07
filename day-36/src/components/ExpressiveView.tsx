import { useMemo, useState, useEffect } from 'react';
import type { SentimentResult } from '../lib/sentiment-engine';
import { giphyClient } from '../lib/giphy-client';
import { HowItWorks } from './HowItWorks';

interface Props {
    text: string;
    onChange: (text: string) => void;
    result: SentimentResult | null;
    loading: boolean;
}

export const ExpressiveView: React.FC<Props> = ({ text, onChange, result, loading }) => {
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [currentTag, setCurrentTag] = useState<string>('');
    const [showFallback, setShowFallback] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Determine the sentiment tag/category
    const sentimentTag = useMemo(() => {
        if (loading) return 'thinking';
        if (!result || !text) return 'listening'; // Reverted to 'listening' for reliability

        const score = result ? result.score : 3;

        if (score < 1.8) return 'sad crying';
        if (score < 2.6) return 'sad face';
        if (score < 3.4) return 'meh';
        if (score < 4.2) return 'happy';
        return 'excited';
    }, [result, text, loading]);

    // Fetch GIF when tag changes
    useEffect(() => {
        const fetchGif = async () => {
            if (sentimentTag !== currentTag) {
                setCurrentTag(sentimentTag);
                setGifUrl(null); // Clear old GIF to avoid mismatch
                setIsImageLoaded(false); // Reset image load state

                if (sentimentTag === 'listening') {
                    setShowFallback(true); // Show emoji immediately
                    return; // Skip fetching GIF
                }

                setShowFallback(false); // Hide emoji initially

                // Start fallback timer (2s delay)
                const fallbackTimer = setTimeout(() => {
                    setShowFallback(true);
                }, 2000);

                const url = await giphyClient.getRandomSticker(sentimentTag);

                clearTimeout(fallbackTimer); // Cancel fallback if loaded in time

                if (url) {
                    setGifUrl(url);
                } else {
                    setShowFallback(true); // Show fallback if failed
                }
            }
        };

        fetchGif();
    }, [sentimentTag, currentTag]);

    const { gradient, emojiScale, emoji, isRestless } = useMemo(() => {
        if (loading) {
            return {
                gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                emojiScale: 1.1,
                emoji: '🤔',
                isRestless: false
            };
        }

        if (!result || !text) {
            return {
                gradient: 'radial-gradient(circle at center, #ffffff 0%, #d1d5db 100%)',
                emojiScale: 1,
                emoji: '👂',
                isRestless: true
            };
        }

        const score = result ? result.score : 3;

        let colorStart, colorEnd;
        let scale = 1;
        let emojiChar = '😐';

        if (score < 2.0) {
            colorStart = '#fee2e2';
            colorEnd = '#fecaca';
            scale = 1.0;
            emojiChar = score < 1.5 ? '😭' : '☹️';
        } else if (score < 2.8) {
            colorStart = '#ffedd5';
            colorEnd = '#fed7aa';
            scale = 1.0;
            emojiChar = '😕';
        } else if (score < 3.2) {
            colorStart = '#f3f4f6';
            colorEnd = '#e5e7eb';
            scale = 1.0;
            emojiChar = '😐';
        } else if (score < 4.2) {
            colorStart = '#dcfce7';
            colorEnd = '#bbf7d0';
            scale = 1.1;
            emojiChar = '🙂';
        } else {
            colorStart = '#d1fae5';
            colorEnd = '#a7f3d0';
            scale = 1.3;
            emojiChar = '🤩';
        }

        return {
            gradient: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`,
            emojiScale: scale,
            emoji: emojiChar,
            isRestless: false
        };
    }, [result, text, loading]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div
            className={`min-h-screen w-full flex flex-col items-center justify-center p-8 transition-all duration-1000 ease-in-out relative ${isRestless ? 'animate-breathing-glow' : ''}`}
            style={{ background: gradient }}
        >
            <div className="max-w-2xl w-full space-y-12 text-center">

                <div className="h-48 flex items-center justify-center">
                    <div
                        className="transition-all duration-500 ease-spring"
                        style={{ transform: `scale(${emojiScale})` }}
                    >
                        {gifUrl ? (
                            <img
                                src={gifUrl}
                                alt="Sentiment Sticker"
                                onLoad={() => setIsImageLoaded(true)}
                                className={`h-40 w-40 object-contain drop-shadow-xl transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ) : (
                            showFallback ? <div className={`text-9xl ${isRestless ? 'animate-pulse' : ''}`}>{emoji}</div> : null
                        )}
                    </div>
                </div>

                <textarea
                    className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 text-base text-left text-gray-800 placeholder:text-gray-500/70 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-lg transition-all resize-none h-48"
                    placeholder="Share a random thought"
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                />

                <div className={`text-gray-600 font-medium text-sm uppercase tracking-widest transition-all duration-500 ${result ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    Sentiment{result ? `: ${result.score.toFixed(1)} / 5.0` : ''}
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-[10px] text-gray-400 hover:text-gray-800 hover:bg-white/40 active:bg-white/60 active:scale-95 uppercase tracking-widest transition-all duration-200 cursor-pointer"
                >
                    How this works
                </button>

            </div>

            <HowItWorks isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
