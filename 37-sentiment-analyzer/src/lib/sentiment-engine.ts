import { pipeline, env } from '@xenova/transformers';

// Skip local model checks for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface SentimentResult {
    label: string;
    score: number; // Weighted average 1-5
    confidence: number; // Score of the top label
    distribution: number[]; // Probabilities for 1-5 stars
}

class SentimentEngine {
    private static instance: SentimentEngine;
    private classifier: any = null;
    private modelId = 'Xenova/bert-base-multilingual-uncased-sentiment';

    private constructor() { }

    public static getInstance(): SentimentEngine {
        if (!SentimentEngine.instance) {
            SentimentEngine.instance = new SentimentEngine();
        }
        return SentimentEngine.instance;
    }

    public async init() {
        if (!this.classifier) {
            console.log('Loading model...');
            this.classifier = await pipeline('text-classification', this.modelId, {
                quantized: true,
            });
            console.log('Model loaded.');
        }
    }

    public async predict(text: string): Promise<SentimentResult> {
        if (!this.classifier) {
            await this.init();
        }

        // Create a timeout promise
        const timeout = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Inference timed out')), 10000);
        });

        // Race between classifier and timeout
        const output = await Promise.race([
            this.classifier(text, { topk: 5 }),
            timeout
        ]);

        // Output format: [{ label: '5 stars', score: 0.85 }, { label: '4 stars', score: 0.1 }, ...]

        let totalScore = 0;
        let totalWeight = 0;
        const distribution = new Array(5).fill(0);

        for (const item of output) {
            const stars = parseInt(item.label.split(' ')[0]);
            if (!isNaN(stars)) {
                totalScore += stars * item.score;
                totalWeight += item.score;
                distribution[stars - 1] = item.score;
            }
        }

        const weightedAverage = totalWeight > 0 ? totalScore / totalWeight : 0;
        const topPrediction = output[0];

        // Derive label from weighted average for consistency
        let derivedLabel = 'Neutral';
        if (weightedAverage < 1.8) derivedLabel = 'Very Negative';
        else if (weightedAverage < 2.6) derivedLabel = 'Negative';
        else if (weightedAverage < 3.4) derivedLabel = 'Neutral';
        else if (weightedAverage < 4.2) derivedLabel = 'Positive';
        else derivedLabel = 'Very Positive';

        return {
            label: derivedLabel, // Use derived label instead of raw top class
            score: weightedAverage,
            confidence: topPrediction.score,
            distribution: distribution
        };
    }
}

export const sentimentEngine = SentimentEngine.getInstance();
