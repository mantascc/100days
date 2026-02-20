import { sentimentEngine } from './sentiment-engine';

export interface AttributionToken {
    text: string;
    originalIndex: number;
    contribution: number;
}

export class AttributionAnalyzer {
    private tokenize(text: string): { text: string; index: number }[] {
        const tokens: { text: string; index: number }[] = [];
        let match;
        // Match non-whitespace sequences
        const regex = /\S+/g;
        while ((match = regex.exec(text)) !== null) {
            tokens.push({ text: match[0], index: match.index });
        }
        return tokens;
    }

    public async analyze(text: string, baselineScore: number): Promise<AttributionToken[]> {
        const tokens = this.tokenize(text);

        // Limit to first 50 tokens for performance in MVP
        const tokensToAnalyze = tokens.slice(0, 50);

        const promises = tokensToAnalyze.map(async (token) => {
            // Reconstruct text without this token
            // We handle spacing carefully to avoid creating double spaces that might affect BERT slightly,
            // though BERT is usually robust.
            const pre = text.substring(0, token.index);
            const post = text.substring(token.index + token.text.length);

            // Simple join. 
            const ablatedText = (pre + post).replace(/\s+/g, ' ').trim();

            const result = await sentimentEngine.predict(ablatedText);
            const newScore = result.score;

            // Contribution: How much did the score DROP when we removed this token?
            // If score dropped (positive -> neutral), contribution was positive.
            // If score increased (negative -> neutral), contribution was negative.
            const contribution = baselineScore - newScore;

            return {
                text: token.text,
                originalIndex: token.index,
                contribution: contribution
            };
        });

        return Promise.all(promises);
    }
}

export const attributionAnalyzer = new AttributionAnalyzer();
