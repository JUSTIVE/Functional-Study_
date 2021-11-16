# Typescript 를 이용한 대수적 타입

### Intro.

고전적인 웹 애플리케이션들은 순수한 HTML, CSS, Javascript의 세 언어만을 이용하여 구성되었습니다. 그 중에서 웹페이지의 상호작용 및 동작을 수행하는 Javascript는 동적 타입 언어로써 프로그램에 사용된 각 심볼들의 타입이 실행되는 순간에 평가되어지기 때문에 매우 유연하게 작성을 할 수 있다는 장점이 있고, 브라우저에서 실행 가능한 언어로써 지금까지도 많이 쓰이고 있습니다. 그러나 자바스크립트를 이용하여 작성된 프로그램에서는 많은 에러들이 런타임에 발생하고, 이런 런타임 에러들은 발생하기 전에는 찾거나 수정하기 상당히 까다롭다는 단점을 가지고 있기 때문에 모던 웹 개발에서는 이러한 문제를 해결하고자 Typescript라는 Javascript의 확장을 이용하는 시도를 하고 있습니다.

타입 시스템을 기반으로 실행 전에 신뢰할 수 있는 프로그램의 형태를 구성하기 위해서 “대수적 데이터 타입”이라는 개념을 이용하고 있습니다. 본 글에서는 이 대수적 데이터 타입이 무엇인지, 간단한 예시를 통해 설명하고자 합니다.

함수형 프로그래밍과 범주론에서는 대수적 데이터 타입(Algebraic Data Type,이하 ADT) 이라는 합성 타입을 이용하여 하위 타입들을 확장하고, 더 큰 범주의 타입을 설계할 수 있습니다. 가장 일반적인 ADT의 종류에는 다음의 두 가지가 있습니다.

- 합 타입(Sum Type, 혹은 Variants, Tagged Union)
- 곱 타입(Product Type, 혹은 Record, Tuple)

### 합 타입(Sum Type)

합 타입은 하위 타입들 중 하나만을 가지는 타입입니다. 합 타입으로 구성되는 타입의 집합의 크기(카디널리티)는 하위 타입들의 집합의 크기의 합과 같습니다

예를 들어, 트럼프 카드 세트와 타로 카드 세트를 포함하며 현실세계의 카드게임에 쓰이는 카드들의 세트를 모방하는 임의의 CardSet 타입은 다음과 같이 나타낼 수 있습니다.

```
type CardSet = TrumpCard | TarotCard
```

위의 CardSet은 TrumpCard의 하위가 나타낼 수 있는 모든 카드들과 TarotCard 가 나타낼 수 있는 모든 카드들을 포함합니다. 이는 트럼프 카드 세트의 “♠️4” 나 타로 카드 세트의 “바보” 카드가 하나의 카드 라는 집합에 속하지만 하나의 카드가 한번에 하나의 하위 타입에만 속한다는 것을 생각하면 당연한 구조입니다. 따라서 타입 CardSet이 나타낼 수 있는 총 카드의 수 NCardSet 은 (트럼프 카드의 수 NTrumpCard + 타로 카드의 수 NTarotCard ) 와 같습니다.

### 곱 타입(Product Type)

곱 타입은 하위 타입들을 동시에 가지는 타입입니다. 곱 타입으로 구성되는 타입의 집합의 크기는 하위 타입들의 집합의 곱과 같습니다.

위의 예제에 이어, 하나의 트럼프 카드는 문양을 나타내는 Suit 과 그 카드의 값인 Rank 를 동시에 가지므로, 다음과 같이 나타낼 수 있습니다.

```
type TrumpRank =
  1 | 2 | 3
  | 4 | 5 | 6
  | 7 | 8 | 9 | 10
  | "Jack" | "Queen" | "King"
type TrumpSuit =
  "♠️" | "♣️" | "♥️" | "♦️"

type TrumpCard = [TrumpSuit,TrumpRank]
```

여기서는 TrumpCard라는 하나의 타입을 TrumpSuit 과 TrumpRank로 구성된 튜플 타입으로 나타내었습니다. 여기서의 타입 TrumpCard가 나타낼 수 있는 총 카드의 수 NTrumpCard 은 (카드의 문양 수 NSuit * 카드의 랭크의 수 NRank )입니다. 이는 TrumpRank 와 TrumpSuit가 가지는 집합의 크기는 각각 13과 4 이므로, TrumpCard 타입의 집합의 크기는 52임이 결정됨을 의미합니다.

튜플 타입의 하위 타입들은 인덱스를 통해 접근할 수 있으나, 코드를 작성할 때에 튜플 타입을 인덱스로 접근하는 것이 직관적이지 않고 코드의 가독성을 해치므로, 일반적으로 Typescript에서는 튜플 타입을 대신하여 Record Type을 통해 Product Type을 이용합니다. 위의 TrumpCard 타입은 Record로 변환하면 다음과 같이 작성할 수 있습니다.

```
type TrumpCard = {
  suit:TrumpSuit;
  rank:TrumpRank;
}
```

이제 각 TrumpCard 타입의 값들의 문양과 랭크는 각각의 이름인 suit와 rank를 통해 접근할 수 있습니다. 아래 예제의 isSpade 함수는 주어진 TrumpCard 타입의 suit 속성값을 참조하여 인자로 받은 trumpCard 타입의 값의 문양이 ♠️인 경우에는 true, 아닌 경우에는 false를 반환 하는 함수입니다.

```
function isSpade(trumpCard:TrumpCard){
  return trumpCard.suit === "♠️"
}

const spadeFour:TrumpCard = {
  suit: "♠️",
  rank: 4
}
const heartKing:TrumpCard = {
  suit: "♥️",
  rank: 'King'
}

const isSpadeFourSpade = isSpade(spadeFour) //true
const isHeartKingSpade = isSpade(heartKing) //false
```

### 구분 필드를 이용한 가독성 확보

위의 트럼프 카드 타입의 예제에서 조커 카드가 빠졌다고 생각하셨나요? 위의 트럼프 카드를 확장하면 됩니다. 이처럼 대수적 타입은 확장에 유연한 구조를 가지고 있습니다. 아래의 코드에서는 흑백 조커 카드 BWJoker 와 컬러 조커 카드 ColorJoker 를 Sum Type 으로 확장한 TrumpJoker 타입을 기존의 TrumpCard 타입에 Sum Type으로 확장했습니다.

```
type TrumpRank =
  1 | 2 | 3
  | 4 | 5 | 6
  | 7 | 8 | 9 | 10
  | "Jack" | "Queen" | "King"
type TrumpSuit =
  "♠️" | "♣️" | "♥️" | "♦️"

type TrumpJoker = "BWJoker"|"ColorJoker"

type TrumpCard = {
  suit:TrumpSuit;
  rank:TrumpRank;
}|TrumpJoker
```

이렇게 대수적 타입을 이용하면 하나의 트럼프 카드 셋 타입에서 발생할 수 있는 모든 카드의 조합을 빠르고 간단하게 정의할 수 있습니다.

그러나 TrumpJoker타입을 추가하게 됨으로써 isSpade 함수에 에러가 발생하는 것을 볼 수 있습니다.  이는 TrumpJoker 타입에는 suit라는 속성이 없기 때문입니다.

> Property ‘suit’ does not exist on type ‘TrumpCard’. Property ‘suit’ does not exist on type ‘“BWJoker”'(2399).
> 

이 경우에 변경된 TrumpCard에 대응하는 isSpade를 확장하는 방법은 다음의 세 가지가 있습니다.

1. 인자로 들어온 trumpCard 값을 조커의 하위 타입 리터럴들과 비교한 후 예외 절에서 suit 속성을 참조하여 판별한다.
2. 인자로 들어온 trumpCard 값의 suit 속성이 존재하는 지 판별한 후, suit 속성이 존재하는 경우에만 suit 속성을 참조하여 판별한다.
3. TrumpCard 타입의 하위 타입들을 확장하여, 두 하위 타입을 구분할 수 있는 별개의 속성 필드를 통해 판별한다.

본 장에서는 3. 의 방법을 통해 이 문제를 해결하는 과정을 설명합니다. 각각의 방법에는 장/단점들이 존재하지만, 3.과 같은 방법은 추후 TrumpCard의 하위 타입이 병렬적으로 증가할 때에 유연하게 대처할 수 있고, 명확한 하위 타입의 이름을 값으로 참조함으로써 코드의 가독성을 높이는 장점이 있기 때문입니다.

우선 조커가 아닌, suit와 rank의 속성을 가지는 집합인 TrumpNormalCard 타입을 아래와 같이 정의합니다.

```
type TrumpNormalCard = {
  suit:TrumpSuit;
  rank:TrumpRank;
  trumpType:"normal"
}
```

suit 와 rank 외에 trumpType:"normal"이 추가된 것에 주목하세요. 이제 TrumpCard 타입의 하위 타입들은 이 속성을 통해 구분할 것입니다.

TrumpJoker 타입도 trumpType 속성을 가지도록 아래와 같이 확장합니다.

```
type TrumpJoker = {
  jokerType:"BW"|"Color"
  trumpType:"joker"
}
```

그리고 TrumpCard 타입을 TrumpNormalCard 와 TrumpJoker의 Sum Type으로 구성합니다.

```
type TrumpCard = TrumpNormalCard|TrumpJoker
```

이제 isSpade 함수에서 바로 인자로 들어온 trumpCard의 suit 속성을 참조하는 것이 아닌, trumpType을 먼저 판별하도록 수정합니다. 그리고 normal 인 경우에만 suit 속성을 통해 판별합니다.

```
function isSpade(trumpCard:TrumpCard){
  switch(trumpCard.trumpType){
    case "normal" :  return trumpCard.suit === "♠️"
    case "joker"  :  return false
  }
}
```

이제 isSpade 함수는 joker 값들로 확장된 TrumpCard의 모든 경우에 대해서 대응할 수 있는 함수로 거듭났고, 누가 보더라도 이해할 수 있도록 작성되었습니다. 다른 방식으로 isSpade를 구현한 것들은 어떻게 나타내어질까요?

1. **인자로 들어온 trumpCard 값을 조커의 하위 타입 리터럴들과 비교한 후 예외 절에서 suit 속성을 참조하여 판별한다.**

```
function isSpade(trumpCard:TrumpCard){
  if(trumpCard==="BWJoker"||trumpCard==="ColorJoker")
    return false
  return trumpCard.suit==="♠️"
}
```

Typescript의 타입 추론은 강력하기 때문에, early return 에서 반환되지 않은 trumpCard 타입은 suit 속성을 가진다는 것을 보장합니다. 그러나 조커의 종류가 흑백과 색상을 가지는 두 종류였기에 다행이지, 수십개의 중첩된 타입의 집합이었다면 모든 최하위 타입들의 값들을 전부 배제하도록 써야 했을 것입니다.

**2. 인자로 들어온 trumpCard 값의 suit 속성이 존재하는 지 판별한 후, suit 속성이 존재하는 경우에만 suit 속성을 참조하여 판별한다.**

```
function isSpade(trumpCard:TrumpCard){
  if("suit" in trumpCard)
    return trumpCard.suit==="♠️"
  return false
}
```

이 경우에는 1.과 같이 번잡하게 모든 경우를 쓸 필요는 없어졌습니다. 그러나 이 함수가 단순히 하나의 필드만을 참조하고, 하위 타입들을 단순히 하나의 필드만을 통해 분별할 수 있는 경우이기에 깔끔하게 표현될 수 있었고, 하위 타입들 중에 공유되는 필드를 가지고 있는 경우가 있는 경우 그들을 구분할 수 있는 서브 타입들을 찾아야 하며, 코드상으로 드러나는 구분 방식도 직관적이지 않을 것입니다.

예를 들어, 온라인 쇼핑몰이라는 하나의 도메인이 있을 때, 같은 아이디와 비밀번호를 가지는 사용자와 관리자, 그리고 판매자가 있는 매우 간단한 다음의 타입들을 정의하겠습니다.

```
type ShoppingItem = string
type Store = {
  name:string,
  location:string,
  items:ShoppingItem[]
}

type Seller = {
  id:string,
  password:string,
  stores:Store[]
}
type UserType = Customer|Admin|Seller

type Customer = {
  id:string,
  password:string,
  cart:ShoppingItem[]
}

type Admin = {
  id:string,
  password:string,
  storeList:Store[]
  userList:Customer[]
  sellerList:Seller[]
}
```

만약 UserType 의 값을 인자로 받는 함수가 있고, 이 함수가 각각의 사용자의 유형별로 처리를 해야 한다면 각각의 하위 타입들을 고유하게 구분할 수 있는 속성군들을 추려내어야 할 것입니다.

```
function applyToUserType(userType:UserType){
  if("cart" in userType){
    //...Customer의 처리문
  }
  else if("sellerList" in userType){
    //...Admin의 처리문
  }
  else if("profit" in userType){
    //...Seller의 처리문
  }
}
```

이 방법은 이와 같이 작성하는 순간에는 고유한 속성을 고려해야 하고, 읽을 때에는 속성으로부터 고유한 집합군을 연상하는 과정이 번거로운 문제가 있습니다.

### 대수적 데이터 타입을 이용한 안전한 개발

대수적 데이터 타입을 이용하면 보다 쉽게 안전한 개발이 가능합니다. 타입을 확장할 때에 곱 타입을 이용한 확장인지, 합 타입을 이용한 확장인지만을 결정함으로써 새로 확장되는 타입이 가지게 될 역할의 범주가 결정되고, 이렇게 결정된 범주들을 기반으로 타입스크립트 린터와 컴파일러는 코드를 실행하기도 전에 값의 유효성을 검사하고 보장합니다.

예를 들어, 위의 TrumpCard예제에서의 TrumpCard 타입을 유효하지 않은 값으로 설정하려 하면  타입스크립트 컴파일러는 다음과 같은 경고를 제시합니다.

```
const cardInstance:TrumpCard = {
  suit:"👍",
  rank:"😎",
  trumpType:"normal"
}
```

> Type ‘“👍“’ is not assignable to type ‘TrumpSuit’(2322).
> 
> 
> Type ‘“😎“’ is not assignable to type ‘TrumpRank’(2322).
> 

뿐만 아니라 IDE에서는 이러한 ADT들을 이해하여 해당 타입의 심볼을 정의할 때에 유효한 값의 목록을 보여주기도 합니다.

Sum type으로 정의된 타입에 대해서 switch-case문을 이용한 분기문을 작성할 때에, default문을 이용한 fallback을 기재하지 않았다면 case로 정의되지 않은 Sum Type의 하위 타입이 있음을 나타내는 경고를 보여주기도 합니다.

```
function NameOfSuit(trumpSuit:TrumpSuit){
  switch(trumpSuit){
    case "♠️":
      return "Spade"
  }
}
```

> Not all code paths return a value(7030).
> 

이러한 대수적 데이터 타입을 이용한 React를 이용한 개발에서는 이러한 Sum/Product 타입을 이용하여 하나의 컴포넌트의 입력으로 받는 Prop(Property) 타입을 설계하고, 각 Prop으로부터 마크업으로의 단사 함수(Injective function)를 정의함으로써 컴포넌트를 구현할 수 있습니다.

### 결론

본 글에서는 신뢰할 수 있는 원소들의 집합들로부터 타입을 합성하고 확장할 수 있게 하는 대수적 데이터 타입에 대해 알아보았습니다. 이처럼 견고한 타입 시스템은 사람이 코드를 작성할 때에 발생할 수 있는 사소한 실수부터 작성된 프로그램이 실행될 때에 발견될 수 있는 에러들을 컴파일 타임에 확인함으로써 보다 에러가 적고, 고치기 쉽고, 명확한 프로그램을 기술하는 데에 큰 도움을 주고 있습니다.