import { shopping } from '../shopping';
import { HAPPY_MART, HAPPY_WALLET, NO_CART_MART, NO_MILK_MART, POOR_WALLET } from './mart_const';

export const HAPPY_SHOPPING_RESULT = shopping(HAPPY_MART(), HAPPY_WALLET)
export const NO_CART_SHOPPING_RESULT = shopping(NO_CART_MART(), HAPPY_WALLET)
export const NO_MILK_SHOPPING_RESULT = shopping(NO_MILK_MART(), HAPPY_WALLET)
export const NOT_ENOUGH_BALANCE_WALLET_SHOPPING_RESULT = shopping(HAPPY_MART(), POOR_WALLET)