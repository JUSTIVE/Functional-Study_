export type ItemType = typeof ITEM_TYPE[number]
export const ITEM_TYPE = ['Egg', 'Milk'] as const

export type Item<ItemName extends ItemType> = {
  readonly name: ItemName
  readonly id: number
  readonly price: number
}
export type Items = Item<ItemType>[]

export type Cart = {
  items: Items
}
export function CART(items: Items): Cart {
  return { items: items }
}

export type MartInventory = { [P in ItemType]: Item<P>[] }
export function EMPTY_INVENTORY(): MartInventory {
  return ITEM_TYPE.reduce((s, c: ItemType) => {
    s[c] = []
    return s
  }, {} as MartInventory)
}
export function MART_INVENTORY(items: Item<ItemType>[]): MartInventory {
  return items.reduce((accInventory, currentItem) => {
    ;(accInventory[currentItem.name] as Item<ItemType>[]).push(currentItem)
    return accInventory
  }, EMPTY_INVENTORY())
}

export type Mart = {
  carts: Cart[]
  inventory: MartInventory
}
export function MART(carts: Cart[], inventory: MartInventory): Mart {
  return {
    carts: JSON.parse(JSON.stringify(carts)),
    inventory: JSON.parse(JSON.stringify(inventory))
  }
}

export type Wallet = {
  balance: number
}
export function WALLET(balance: number): Wallet {
  return {
    balance: balance
  }
}
