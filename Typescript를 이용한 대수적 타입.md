# Typescript 를 이용한 대수적 타입


### Intro.

고전적인 웹 애플리케이션들은 순수한 HTML, CSS, Javascript의 세 언어만을 이용하여 구성되었고, 그 중에서도 웹페이지의 상호작용 및 동작을 수행하는 Javascript는 동적 타입 언어로써 프로그램에 사용된 각 심볼들의 타입이 실행되는 순간에 평가되어지기 때문에 매우 유연하게 작성을 할 수 있다는 장점이 있었으나 많은 에러들이 런타임에 발생하고 이런 런타임 에러들을 잡기에 상당히 까다롭다는 단점을 가지고 있었습니다. 이에 모던 웹 개발에서는 이러한 문제를 해결하고자 Typescript라는 Javascript의 확장을 이용하는 시도를 하고 있습니다.

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

여기서는 TrumpCard라는 하나의 타입을 TrumpSuit 과 TrumpRank로 구성된 튜플 타입으로 나타내었습니다. 이 때, TrumpRank 와 TrumpSuit가 가지는 집합의 크기는 각각 13과 4 이므로, TrumpCard 타입의 집합의 크기는 52임이 결정됩니다.

위의 트럼프 카드 타입의 예제에서 조커 카드가 빠졌다고 생각하셨나요? 위의 트럼프 카드를 확장하면 됩니다. 이처럼 대수적 타입은 확장에 유연한 구조를 가지고 있습니다.

```
type TrumpRank =
  1 | 2 | 3
  | 4 | 5 | 6
  | 7 | 8 | 9 | 10
  | "Jack" | "Queen" | "King"
type TrumpSuit =
  "♠️" | "♣️" | "♥️" | "♦️"

type TrumpJoker = "BWJoker"|"ColorJoker"

type TrumpCard = [TrumpSuit,TrumpRank]|TrumpJoker
```

이렇게 하나의 트럼프 카드 셋 타입에서 발생할 수 있는 모든 카드의 조합을 빠르고 간단하게 정의할 수 있습니다.

### 대수적 데이터 타입을 이용한 안전한 개발

대수적 데이터 타입을 이용하면 보다 쉽게 안전한 개발이 가능합니다. 타입을 확장할 때에 곱 타입을 이용한 확장인지, 합 타입을 이용한 확장인지만을 통해 새로 확장되는 타입이 가지게 될 역할의 범주가 결정되고, 이렇게 결정된 범주들을 기반으로 타입스크립트 린터와 컴파일러는 코드를 실행하기도 전에 값의 유효성을 검사하고 보장합니다.

예를 들어, 위의 예제에서의 TrumpCard 타입을 유효하지 않은 값으로 설정하려 하면  타입스크립트 컴파일러는 다음과 같은 경고를 제시합니다.

```
const cardInstance:TrumpCard = ["👍","😎"]
```

> Type ‘“👍“’ is not assignable to type ‘TrumpSuit’(2322).
> 
> 
> Type ‘“😎“’ is not assignable to type ‘TrumpRank’(2322).
> 

뿐만 아니라 IDE에서는 이러한 ADT들을 이해하여 해당 타입의 심볼을 정의할 때에 유효한 값의 목록을 보여주기도 합니다.

Sum type으로 정의된 타입에 대해서 switch-case문을 이용한 분기문을 처리할 때에, default문을 이용한 fallback을 기재하지 않았다면 case로 정의되지 않은 하위 타입이 있음을 나타내는 경고를 보여주기도 합니다.

```
function SuitOfTrumpCard(trumpCard:TrumpCard){
  switch(trumpCard[0]){
    case "♠️":
      return "Spade"
  }
}
```

> Not all code paths return a value(7030).
> 

이러한 대수적 데이터 타입을 이용한 React를 이용한 개발에서는 이러한 Sum/Product 타입을 이용하여 하나의 컴포넌트의 입력으로 받는 Prop(Property) 타입을 설계하고, 각 Prop으로부터 마크업으로의 단사 함수(Injective function)를 정의함으로써 컴포넌트를 구현할 수 있습니다.

### 결론