import { currify } from './functions';
import { compose, FAILURE, Result, SUCCESS } from './result';
import { HAPPY_SHOPPING_RESULT, NOT_ENOUGH_BALANCE_WALLET_SHOPPING_RESULT, NO_CART_SHOPPING_RESULT, NO_MILK_SHOPPING_RESULT } from './shopping/const/shoppingConst';
import { printShoppingResult } from './shopping/utility/printer';

printShoppingResult(HAPPY_SHOPPING_RESULT)
printShoppingResult(NO_CART_SHOPPING_RESULT)
printShoppingResult(NO_MILK_SHOPPING_RESULT)
printShoppingResult(NOT_ENOUGH_BALANCE_WALLET_SHOPPING_RESULT)