
type TypeApplier<T extends string, V, X> = Readonly<{ [key in T]: V }> & X
type ResultTypeApplier<V extends ResultType, X> = TypeApplier<"resultType", V, X>
type ValueAlias<V> = { value: V }

function compose<A, B, C, D, T1>(...functions: any) {
  return functions.reduce(
    (a: (x: T1) => Result<A, B>, b: (y: A) => Result<C, D>) =>
      (value: T1) => {
        const prevEvalResult = a(value)
        switch (prevEvalResult.resultType) {
          case 'Success':
            return b(prevEvalResult.value)
          case 'Failure':
            return prevEvalResult
        }
      })
}

type Success<S> = ResultTypeApplier<"Success", ValueAlias<S>>
function SUCCESS<S>(value: S): Success<S> {
  return {
    resultType: "Success",
    value: value
  }
}

type Failure<F> = ResultTypeApplier<"Failure", ValueAlias<F>>
function FAILURE<F>(value: F): Failure<F> {
  return {
    resultType: "Failure",
    value: value
  }
}

type ResultType = "Success" | "Failure"
type Result<S, F> =
  Success<S>
  | Failure<F>
//purchase Errors
type NotEnoughBalance = typeof NOT_ENOUGH_BALANCE
const NOT_ENOUGH_BALANCE = "Not enough balance for purchase" as const
type NoWalletExists = typeof NO_WALLET_EXISTS
const NO_WALLET_EXISTS = "No wallet exists. cannot proceed purchase" as const
type PurchaseError =
  NotEnoughBalance
  | NoWalletExists
//cart Errors
type NoCartExists = typeof NO_CART_EXISTS
const NO_CART_EXISTS = "No Cart Exists" as const

type ShoppingErrors =
  NoCartExists
  | ProcessRequestFailed<ItemType>
  | PurchaseError

type NoItemExists<IT extends ItemType> = `No Item ${IT} Exists`
function NO_ITEM_EXISTS(item: ItemType): NoItemExists<ItemType> {
  return `No Item ${item} Exists`
}

type CartIsFull = "Cart is full please unload item to continue"

type ProcessRequestFailed<IT extends ItemType> =
  NoItemExists<IT>
  | CartIsFull

function flatMap<A, B>(result: Result<A, B>) {
  switch (result.resultType) {
    case 'Success':
      return result.value
    case 'Failure':
      return result
  }
}

type ItemType = typeof ITEM_TYPE[number]
const ITEM_TYPE = ["Egg", "Milk"] as const

type Item<ItemName extends ItemType> = {
  readonly name: ItemName,
  readonly id: number,
  readonly price: number
}
type Items = Item<ItemType>[]

type Cart = {
  items: Items,
}
function CART(items: Items): Cart {
  return { items: items }
}

type MartInventory = { [P in ItemType]: Item<P>[] }
function EMPTY_INVENTORY(): MartInventory {
  return ITEM_TYPE.reduce((s, c: ItemType) => { s[c] = []; return s }, {} as MartInventory)
}
function MART_INVENTORY(items: Item<ItemType>[]): MartInventory {
  return items.reduce((accInventory, currentItem) => {
    (accInventory[currentItem.name] as Item<ItemType>[]).push(currentItem)
    return accInventory
  }, EMPTY_INVENTORY())
}


type Mart = {
  carts: Cart[],
  inventory: MartInventory
}
function MART(carts: Cart[], inventory: MartInventory): Mart {
  return {
    carts: JSON.parse(JSON.stringify(carts)),
    inventory: JSON.parse(JSON.stringify(inventory))
  }
}

type Wallet = {
  balance: number
}
function WALLET(balance: number): Wallet {
  return {
    balance: balance
  }
}

function addItemToCart(newItem: ItemType, amount: number, mart: Mart, cart: Cart)
  : Result<Cart, ProcessRequestFailed<ItemType>> {
  if (amount == 0)
    return SUCCESS(cart)
  const pickedItem = mart.inventory[newItem].pop()
  return pickedItem !== undefined
    ? addItemToCart(newItem, amount - 1, mart, CART([...cart.items, pickedItem]))
    : FAILURE(NO_ITEM_EXISTS(newItem))
}

function addItemToCartIfExists(newItem: ItemType, amount: number, mart: Mart, cart: Cart)
  : Result<Cart, ProcessRequestFailed<ItemType>> {
  if (amount == 0)
    return SUCCESS(cart)
  const pickedItem = mart.inventory[newItem].pop()
  return pickedItem !== undefined
    ? addItemToCartIfExists(newItem, amount - 1, mart, CART([...cart.items, pickedItem]))
    : addItemToCartIfExists(newItem, amount - 1, mart, cart)
}

function getCart(mart: Mart): Result<Cart, NoCartExists> {
  const pickCart = mart.carts.pop()
  return pickCart
    ? SUCCESS(pickCart)
    : FAILURE(NO_CART_EXISTS)
}

function purchase(wallet: Wallet, cart: Cart): Result<Items, PurchaseError> {
  const totalPrice = cart.items.map(x => x.price).reduce((x, y) => x + y)
  function checkWallet(wallet: Wallet): Result<Wallet, PurchaseError> {
    return wallet
      ? SUCCESS(wallet)
      : FAILURE(NO_WALLET_EXISTS)
  }
  function checkPrice(wallet: Wallet) {
    return totalPrice < wallet.balance
      ? SUCCESS(cart.items)
      : FAILURE(NOT_ENOUGH_BALANCE)
  }
  return compose(
    checkWallet,
    checkPrice
  )(wallet)
}

function currify<F extends (...x: any) => any>(
  fn: (...x: Parameters<F>[]) => ReturnType<F>,
  ...givenArguments: Parameters<F>[]) {
  return (...nextArguments: any) => {
    const joinedArguements = [...givenArguments, ...nextArguments]
    return (joinedArguements.length >= fn.length)
      ? fn(...joinedArguements)
      : currify(fn, ...joinedArguements)
  }
}

function processRequest(mart: Mart, myCart: Cart)
  : Result<Cart, ProcessRequestFailed<ItemType>> {
  return compose(
    currify(addItemToCart, "Milk", 1, mart),
    currify(addItemToCartIfExists, "Egg", 6, mart)
  )(myCart)
}

type ShoppingResult = Result<Items, ShoppingErrors>

function shopping(mart: Mart, wallet: Wallet)
  : ShoppingResult {
  return compose(
    currify(getCart, mart),
    currify(processRequest, mart),
    currify(purchase, wallet)
  )()
}

//consts for simulation
const MART_INVENTORY_NO_MILK: () => MartInventory =
  () => MART_INVENTORY([
    { name: "Egg", id: 1, price: 500 },
    { name: "Egg", id: 2, price: 500 }
  ])
const MART_INVENTORY_WITH_MILK: () => MartInventory =
  () => MART_INVENTORY([
    { name: "Egg", id: 1, price: 500 },
    { name: "Egg", id: 2, price: 500 },
    { name: "Milk", id: 2, price: 3000 }
  ])

const NO_CARTS: Cart[] = []
const SOME_CARTS: () => Cart[] = () => [
  CART([]),
  CART([]),
  CART([]),
  CART([]),
  CART([]),
  CART([])
]

const HAPPY_MART: () => Mart = () => MART(SOME_CARTS(), MART_INVENTORY_WITH_MILK())
const NO_CART_MART: () => Mart = () => MART(NO_CARTS, MART_INVENTORY_WITH_MILK())
const NO_MILK_MART: () => Mart = () => MART(SOME_CARTS(), MART_INVENTORY_NO_MILK())

const HAPPY_WALLET: Wallet = WALLET(50000)
const POOR_WALLET: Wallet = WALLET(0)

const HAPPY_SHOPPING_RESULT = shopping(HAPPY_MART(), HAPPY_WALLET)
const NO_CART_SHOPPING_RESULT = shopping(NO_CART_MART(), HAPPY_WALLET)
const NO_MILK_SHOPPING_RESULT = shopping(NO_MILK_MART(), HAPPY_WALLET)
const NOT_ENOUGH_BALANCE_WALLET_SHOPPING_RESULT = shopping(HAPPY_MART(), POOR_WALLET)


function printShoppingResult(sr: ShoppingResult) {
  switch (sr.resultType) {
    case 'Success':
      console.log(sr.value.map(x => x.name))
      break;
    case 'Failure':
      console.log(sr.value)
      break;
  }
}

printShoppingResult(HAPPY_SHOPPING_RESULT)
printShoppingResult(NO_CART_SHOPPING_RESULT)
printShoppingResult(NO_MILK_SHOPPING_RESULT)
printShoppingResult(NOT_ENOUGH_BALANCE_WALLET_SHOPPING_RESULT)