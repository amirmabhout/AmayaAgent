import type { Plugin } from "@elizaos/core";
import getPrice from "./actions/getPrice";
import { nibblesPriceProvider } from "./providers";

export const coinmarketcapPlugin: Plugin = {
    name: "coinmarketcap",
    description: "CoinMarketCap Plugin for Eliza",
    actions: [],
    evaluators: [],
    providers: [nibblesPriceProvider],
};

export default coinmarketcapPlugin;
