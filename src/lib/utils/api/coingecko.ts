import { IndexApi } from '@/lib/utils/api/index-api'
import { OPTIMISM, POLYGON } from '../../../constants/chains'
import { ETH } from '../../../constants/tokens'

const baseURL = '/coingecko'
const indexApi = new IndexApi()

const getAssetPlatform = (chainId: number) => {
  if (chainId === POLYGON.chainId) return 'polygon-pos'
  if (chainId === OPTIMISM.chainId) return 'optimistic-ethereum'
  return 'ethereum'
}

export const fetchCoingeckoTokenPrice = async (
  address: string,
  chainId: number,
  baseCurrency = 'usd'
): Promise<number> => {
  if (address === ETH.address) {
    console.log("fetching eth price")
    const priceUrl =
      baseURL + `/simple/price/?ids=ethereum&vs_currencies=${baseCurrency}`

    const data = await indexApi.get(priceUrl).catch(() => {
      console.log(data);
      return 0
    })

    console.log(data);

    return data["price"];
  }

  const getPriceUrl =
    // baseURL +
    // `/simple/token_price/${getAssetPlatform(
    //   chainId
    // )}/?contract_addresses=${address}&vs_currencies=${baseCurrency}`
    baseURL +
    `/simple/token_price/?contract_addresses=${address}&vs_currencies=${baseCurrency}`

  const data = await indexApi.get(getPriceUrl).catch(() => {
    return 0
  })

  console.log("token endpoint")
  console.log(data);

  return data["price"];
}
