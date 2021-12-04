import { Items, ItemType } from '../mart'
import { ShoppingResult } from '../shopping'

type ItemSummary = {
  [P in ItemType]: number
}

function itemSummary(items: Items): ItemSummary {
  return items.reduce((summary, item) => {
    if (summary[item.name] !== undefined) summary[item.name] += 1
    else summary[item.name] = 1
    return summary
  }, {} as ItemSummary)
}

function itemListToString(items: Items): string {
  return Object.entries(itemSummary(items))
    .map(([itemName, amount]: [string, number]) => {
      return `${amount} ${itemName}${amount > 1 ? 's' : ''}`
    })
    .join(', ')
}

export function printShoppingResult(sr: ShoppingResult) {
  switch (sr.resultType) {
    case 'Success':
      console.log(`[ 👍 Success ] I got ${itemListToString(sr.value)}`)
      break
    case 'Failure':
      console.log(`[ ❌ Failed  ] ${sr.value}`)
      break
  }
}