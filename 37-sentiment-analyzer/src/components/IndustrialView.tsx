import React, { useEffect, useState } from 'react';
import { SentimentInput } from './SentimentInput';
import { AttributionHeatmap } from './AttributionHeatmap';
import { AttributionAnalyzer } from '../lib/attribution-analyzer';
import type { AttributionToken } from '../lib/attribution-analyzer';
import type { SentimentResult } from '../lib/sentiment-engine';

interface Props {
    text: string;
    onChange: (text: string) => void;
    result: SentimentResult | null;
    loading: boolean;
}

export const IndustrialView: React.FC<Props> = ({ text, onChange, result, loading }) => {
    const [tokens, setTokens] = useState<AttributionToken[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const analyzer = new AttributionAnalyzer();

    // Clear tokens when text changes (to avoid mismatch and show pending state)
    useEffect(() => {
        setTokens([]);
    }, [text]);

    // Run analysis only when a NEW result is available
    useEffect(() => {
        const analyzeAttribution = async () => {
            console.log('IndustrialView effect running. Result:', result ? 'Present' : 'Null', 'Text:', text);
            if (result && text) {
                setIsAnalyzing(true);
                try {
                    console.log('Starting attribution analysis...');
                    const analysis = await analyzer.analyze(text, result.score);
                    console.log('Attribution analysis complete:', analysis);
                    setTokens(analysis);
                } catch (e) {
                    console.error("Attribution analysis failed", e);
                } finally {
                    setIsAnalyzing(false);
                }
            }
        };

        analyzeAttribution();
    }, [result]); // Removed 'text' from dependency to prevent analysis on every keystroke

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-mono text-sm text-gray-800">
            <div className="w-full max-w-[800px] mx-auto space-y-8">
                <header className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-gray-900">Sentiment + explanations</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-lime-primary animate-pulse"></span>
                            <span className="text-xs text-gray-500 uppercase">Listening</span>
                        </div>
                    </div>
                </header>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 mb-2">Input Stream</h2>
                        <SentimentInput
                            value={text}
                            onChange={onChange}
                            disabled={loading}
                            placeholder="Enter your text here"
                        />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xs font-bold uppercase text-gray-400">Attribution Heatmap</h2>
                            {isAnalyzing && <span className="text-xs text-blue-500 animate-pulse">Computing gradients...</span>}
                        </div>
                        <AttributionHeatmap
                            text={text}
                            tokens={tokens}
                            onTokenClick={(t) => console.log(t)}
                        />
                    </section>

                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 mb-2">Analysis Metrics</h2>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            {result ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Section 1: Metrics */}
                                    <div className="space-y-4 flex flex-col justify-between">
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">Label</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${result.score > 3.5 ? 'bg-green-100 text-green-700' :
                                                result.score < 2.5 ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {result.label}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">Sentiment Score</span>
                                            <span className="font-mono">{result.score.toFixed(3)}</span>
                                        </div>

                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">Confidence</span>
                                            <span className="font-mono">{result.confidence.toFixed(3)}</span>
                                        </div>
                                    </div>

                                    {/* Section 2: Distribution */}
                                    <div className="flex flex-col h-full">
                                        <span className="text-gray-500 block mb-2">Class Distribution</span>
                                        <div className="flex-1 flex items-end gap-1 min-h-[120px]">
                                            {result.distribution.map((p, i) => (
                                                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                                                    <div className="h-full flex flex-col justify-end">
                                                        <div
                                                            className="bg-gray-500/20 hover:bg-gray-500/40 transition-all rounded-t w-full"
                                                            style={{ height: `${p * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 text-center mt-1">{i + 1}★</span>

                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                                                        {(p * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : text.trim() ? (
                                <div className="h-[160px] listening-gradient rounded"></div>
                            ) : (
                                <div className="h-[160px] flex items-center justify-center text-gray-400 italic">
                                    Waiting for your text...
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-bold uppercase text-gray-400 mb-2">System Logs</h2>
                        <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-xs overflow-hidden">
                            <div className="space-y-1">
                                <div><span className="text-green-500">➜</span> System initialized</div>
                                <div><span className="text-blue-500">ℹ</span> Model provider: 🤗 Transformers.js</div>
                                <div><span className="text-blue-500">ℹ</span> Model: bert-base-multilingual-uncased</div>
                                <div><span className="text-blue-500">ℹ</span> Quantization: int8</div>
                                {loading && <div><span className="text-yellow-500">⚡</span> Inference running...</div>}
                                {result && <div><span className="text-green-500">✓</span> Analysis complete ({Date.now()})</div>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
