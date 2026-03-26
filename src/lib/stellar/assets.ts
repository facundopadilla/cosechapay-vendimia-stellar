import { Asset } from '@stellar/stellar-sdk'

export function nativeAsset(): Asset {
  return Asset.native()
}

export function getAssetDisplayLabel(asset: string): string {
  // For native/XLM-only MVP, always returns 'XLM'
  if (asset === 'native') return 'XLM'
  return 'XLM'
}
