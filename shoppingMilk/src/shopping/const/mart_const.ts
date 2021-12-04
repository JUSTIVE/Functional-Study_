import { Cart, CART, Mart, MART, MartInventory, MART_INVENTORY, WALLET, Wallet } from '../mart';

//consts for simulation
export const MART_INVENTORY_NO_MILK: () => MartInventory =
  () => MART_INVENTORY([
    { name: "Egg", id: 1, price: 500 },
    { name: "Egg", id: 2, price: 500 }
  ])
export const MART_INVENTORY_WITH_MILK: () => MartInventory =
  () => MART_INVENTORY([
    { name: "Egg", id: 1, price: 500 },
    { name: "Egg", id: 2, price: 500 },
    { name: "Milk", id: 2, price: 3000 }
  ])

export const NO_CARTS: Cart[] = []
export const SOME_CARTS: () => Cart[] = () => [
  CART([]),
  CART([]),
  CART([]),
  CART([]),
  CART([]),
  CART([])
]

export const HAPPY_MART: () => Mart = () => MART(SOME_CARTS(), MART_INVENTORY_WITH_MILK())
export const NO_CART_MART: () => Mart = () => MART(NO_CARTS, MART_INVENTORY_WITH_MILK())
export const NO_MILK_MART: () => Mart = () => MART(SOME_CARTS(), MART_INVENTORY_NO_MILK())

export const HAPPY_WALLET: Wallet = WALLET(50000)
export const POOR_WALLET: Wallet = WALLET(0)
