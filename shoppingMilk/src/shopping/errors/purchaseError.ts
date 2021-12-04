export const NOT_ENOUGH_BALANCE = "Not enough balance for purchase" as const
export type NotEnoughBalance = typeof NOT_ENOUGH_BALANCE

export const NO_WALLET_EXISTS = "No wallet exists. cannot proceed purchase" as const
export type NoWalletExists = typeof NO_WALLET_EXISTS

export type PurchaseError =
  NotEnoughBalance
  | NoWalletExists