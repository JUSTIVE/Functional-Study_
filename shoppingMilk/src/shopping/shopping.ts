import { compose, FAILURE, Result, SUCCESS } from '../result';
import { ShoppingErrors } from './errors/shoppingError';
import { NoCartExists, NO_CART_EXISTS } from './errors/cartError';
import { NO_ITEM_EXISTS, ProcessRequestFailed } from './errors/processError';
import { Cart, CART, Items, ItemType, Mart, Wallet } from './mart';
import { currify } from '../functions';
import { NOT_ENOUGH_BALANCE, NO_WALLET_EXISTS, PurchaseError } from './errors/purchaseError';

export type ShoppingResult = Result<Items, ShoppingErrors>
export type AddItemResult = Result<Cart,ProcessRequestFailed<ItemType>>
export type CartError = Result<Cart, NoCartExists>
export type PurchaseResult = Result<Items, PurchaseError>
export type CheckWalletResult = Result<Wallet, PurchaseError>

function addItemToCart(newItem: ItemType, amount: number, mart: Mart, cart: Cart)
  : AddItemResult {
  if (amount == 0)
    return SUCCESS(cart)
  const pickedItem = mart.inventory[newItem].pop()
  return pickedItem !== undefined
    ? addItemToCart(newItem, amount - 1, mart, CART([...cart.items, pickedItem]))
    : FAILURE(NO_ITEM_EXISTS(newItem))
}

function addItemToCartIfExists(newItem: ItemType, amount: number, mart: Mart, cart: Cart)
  : AddItemResult {
  if (amount == 0)
    return SUCCESS(cart)
  const pickedItem = mart.inventory[newItem].pop()
  return pickedItem !== undefined
    ? addItemToCartIfExists(newItem, amount - 1, mart, CART([...cart.items, pickedItem]))
    : addItemToCartIfExists(newItem, amount - 1, mart, cart)
}

function getCart(mart: Mart): CartError {
  const pickCart = mart.carts.pop()
  return pickCart
    ? SUCCESS(pickCart)
    : FAILURE(NO_CART_EXISTS)
}

function purchase(wallet: Wallet, cart: Cart): PurchaseResult {
  const totalPrice = cart.items.map(x => x.price).reduce((x, y) => x + y)
  function checkWallet(wallet: Wallet): CheckWalletResult {
    return wallet
      ? SUCCESS(wallet)
      : FAILURE(NO_WALLET_EXISTS)
  }
  function checkPrice(wallet: Wallet):PurchaseResult {
    return totalPrice < wallet.balance
      ? SUCCESS(cart.items)
      : FAILURE(NOT_ENOUGH_BALANCE)
  }
  return compose(
    checkWallet,
    checkPrice
  )(wallet)
}

function processRequest(mart: Mart, myCart: Cart)
  : Result<Cart, ProcessRequestFailed<ItemType>> {
  return compose(
    currify(addItemToCart, "Milk", 1, mart),
    currify(addItemToCartIfExists, "Egg", 6, mart)
  )(myCart)
}

export function shopping(mart: Mart, wallet: Wallet)
  : ShoppingResult {
  return compose(
    currify(getCart, mart),
    currify(processRequest, mart),
    currify(purchase, wallet)
  )()
}