import { ItemType } from '../mart';

export type NoItemExists<IT extends ItemType> = `No Item ${IT} Exists`
export function NO_ITEM_EXISTS(item: ItemType): NoItemExists<ItemType> {
  return `No Item ${item} Exists`
}

export type CartIsFull = "Cart is full please unload item to continue"

export type ProcessRequestFailed<IT extends ItemType> =
  NoItemExists<IT>
  | CartIsFull