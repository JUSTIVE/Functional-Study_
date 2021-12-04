import { ItemType } from '../mart';
import { NoCartExists } from './cartError';
import { ProcessRequestFailed } from './processError';
import { PurchaseError } from './purchaseError';

export type ShoppingErrors =
  NoCartExists
  | ProcessRequestFailed<ItemType>
  | PurchaseError