import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

interface NibblesQuote {
    USD: {
        price: number;
        volume_24h: number;
        volume_change_24h: number;
        percent_change_1h: number;
        percent_change_24h: number;
        percent_change_7d: number;
        percent_change_30d: number;
        percent_change_60d: number;
        percent_change_90d: number;
        market_cap: number;
        market_cap_dominance: number;
        fully_diluted_market_cap: number;
        tvl: null;
        last_updated: string;
    };
}

interface NibblesData {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: number;
    date_added: string;
    tags: string[];
    max_supply: number;
    circulating_supply: number;
    total_supply: number;
    is_active: number;
    infinite_supply: boolean;
    platform: null;
    cmc_rank: number;
    is_fiat: number;
    self_reported_circulating_supply: number;
    self_reported_market_cap: number;
    tvl_ratio: null;
    last_updated: string;
    quote: NibblesQuote;
}

interface CMCApiResponse {
    status: {
        timestamp: string;
        error_code: number;
        error_message: null | string;
        elapsed: number;
        credit_count: number;
        notice: null | string;
    };
    data: {
        NIBBLES: NibblesData;
    };
}

/**
 * Provider that fetches current market data for the NIBBLES token from CoinMarketCap.
 * This provider always returns the complete market data for NIBBLES, including price,
 * volume, market cap, and other metrics.
 */
export const nibblesPriceProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string> => {
        try {
            const apiKey = runtime.getSetting("CMC_API_KEY");
            if (!apiKey) {
                throw new Error("CoinMarketCap API key not configured");
            }

            const response = await fetch(
                "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=NIBBLES",
                {
                    headers: {
                        "X-CMC_PRO_API_KEY": apiKey,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = (await response.json()) as CMCApiResponse;

            return `Current market data about NIBBLES token:\n\n${JSON.stringify(data, null, 2)}`;
        } catch (error) {
            console.error("Error fetching NIBBLES price data:", error);
            return "Unable to fetch NIBBLES token information. Please try again later.";
        }
    },
}; 