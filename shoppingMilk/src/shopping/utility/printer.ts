import { ShoppingResult } from '../shopping';

export function printShoppingResult(sr: ShoppingResult) {
  switch (sr.resultType) {
    case 'Success':
      console.log(`[ 👍 Success ] I got ${sr.value.map(x => x.name)}`)
      break;
    case 'Failure':
      console.log(`[ ❌ Failed  ] ${sr.value}`)
      break;
  }
}