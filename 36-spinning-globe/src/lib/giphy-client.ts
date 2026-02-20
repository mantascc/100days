// API key from environment variables (Vite)
const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || '';

export class GiphyClient {
    private static instance: GiphyClient;
    private isRateLimited = false;

    private constructor() { }

    public static getInstance(): GiphyClient {
        if (!GiphyClient.instance) {
            GiphyClient.instance = new GiphyClient();
        }
        return GiphyClient.instance;
    }

    public async getRandomSticker(tag: string): Promise<string | null> {
        if (this.isRateLimited) {
            return null;
        }

        try {
            // Randomly choose between 'stickers' (transparent, emoji-like) and 'gifs' (rectangular, movie clips/memes)
            const type = Math.random() > 0.5 ? 'stickers' : 'gifs';
            const endpoint = `https://api.giphy.com/v1/${type}/random`;

            // For stickers, we append 'emoji' to get that specific aesthetic.
            // For gifs, we use the raw tag to get "old fashion" reaction GIFs.
            const queryTag = type === 'stickers' ? `${tag} emoji` : tag;

            const url = `${endpoint}?api_key=${API_KEY}&tag=${encodeURIComponent(queryTag)}&rating=g`;

            const response = await fetch(url);

            if (response.status === 401 || response.status === 403) {
                console.warn('GIPHY API rate limited or unauthorized. Switching to static fallback.');
                this.isRateLimited = true;
                return null;
            }

            if (!response.ok) {
                throw new Error(`GIPHY API error: ${response.statusText}`);
            }

            const data = await response.json();
            // data.data.images.original.url or fixed_height.url
            return data.data?.images?.fixed_height?.url || null;
        } catch (error) {
            // Only log non-auth errors to avoid noise
            if (!this.isRateLimited) {
                console.warn('Failed to fetch GIPHY media:', error);
            }
            return null;
        }
    }
}

export const giphyClient = GiphyClient.getInstance();
