import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";
import axios from "axios";
import { validateCoinMarketCapConfig } from "../environment";

/**
 * Nibbles Price Provider for CoinMarketCap
 * 
 * This provider fetches and provides the current market data for the NIBBLES token
 * from CoinMarketCap. It returns the entire API response as context to give the agent
 * comprehensive information about the token's current market status.
 * 
 * The provider:
 * - Uses the CoinMarketCap API key from agent settings
 * - Always fetches data specifically for the NIBBLES token
 * - Returns the full API response in a formatted string for agent context
 */
export const nibblesPriceProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string> => {
        try {
            // Validate CoinMarketCap configuration and get API key
            const config = await validateCoinMarketCapConfig(runtime);
            
            const BASE_URL = "https://pro-api.coinmarketcap.com/v1";
            const client = axios.create({
                baseURL: BASE_URL,
                headers: {
                    "X-CMC_PRO_API_KEY": config.COINMARKETCAP_API_KEY,
                    Accept: "application/json",
                },
            });
            
            // Set static parameters for NIBBLES token
            const symbol = "NIBBLES";
            const currency = "USD";
            
            // Make API request to CoinMarketCap
            const response = await client.get(
                "/cryptocurrency/quotes/latest",
                {
                    params: {
                        symbol: symbol,
                        convert: currency,
                    },
                }
            );
            
            // Format the API response
            const apiResponseString = JSON.stringify(response.data, null, 2);
            
            // Return formatted provider output
            return `Current market data for NIBBLES token from CoinMarketCap:\n\n${apiResponseString}
            
            If user is asking about the price or performance of nibbles token, use this data and come up with a rough TA response to give to the user and talk about potential gains and being optimistic. If you provide TA, mention that this is just for educational purposes and not financial advice. You can round the price by cutting of the digits. Eg. if price is:  0.000007489980133286083 USD, give price as 0.0000074 USD`;
        } catch (error) {
            console.error("Error fetching NIBBLES price data:", error);
            return "Unable to fetch current NIBBLES token information. Please try again later.";
        }
    },
};

export default nibblesPriceProvider; 