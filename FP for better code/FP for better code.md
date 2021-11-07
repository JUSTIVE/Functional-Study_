# 더 좋은 코드를 위한 함수형 프로그래밍

전이삭, Blizzard Entertainment, NDC 2017

- 순수함수와 불변성
- 고차함수와 함수의 합성
- 타입 시스템과 대수적 자료형
- 타입을 매개로 한 함수의 합성

## 순수 함수 Pure Functions

- 함수의 결과값이 오직 인자값에 의해서 결정
- 특정 입력 값에 대해서 결과값이 결정적으로 대응되는 함수
- 부작용이 없는 함수

### 부작용

모든 부작용은 상태와 관련이 있음

- 상태에 영향을 받거나 변화를 주는 모든 동작
- 화면 출력
- 소켓 통신
- 디스크 I/O
- try/catch
- 현재 시간 읽기
- 난수

> 그렇다면 왜 이렇게까지 상태를 없애고, 부작용을 없애려 하나?  
> ➡`참조 투명성 Referential Transparency`를 얻기 위해서

### 참조 투명성

어떤 함수 `f(x)` 에 대해 `x=1` 일때 `f(x) = 2` 임이 보장되면 프로그램 내의 모든 `f(1)`을 `2`로 교체할 수 있음

컴파일러가 프로그램을 최적화 할 여지가 생김

- `메모이제이션 memoization` 어떤 함수를 연산하는 데에 드는 일체의 비용을 절감할 수 있음
- `지연 연산 lazy evalutation` 함수와 인자를 실제 결과값이 필요한 순간까지 연산하지 않음

#### 지연 연산 lazy evaulation

<table>
  <tr>
    <td>언어</td>
    <td>지연 연산 여부</td>
    <td>코드</td>
    <td>비고</td>
  </tr>
  <tr>
    <td rowspan=2>Scala</td>
    <td>❌</td>
    <td>
    <pre lang="scala">
object main {
  def main(args:Array[String]):Unit ={
    val x = List(1,2,3,4,5)
    val y = x.map(l=>l*2)//이 시점에서 계산됨
    println(y)
  }
}
    </pre>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>⭕</td>
    <td>
    <pre lang="scala">
object main {
  def main(args:Array[String]):Unit ={
    val x = List(1,2,3,4,5)
    lazy val y = x.map(l=>l*2)
    println(y)//이 시점에서 계산됨
  }
}
    </pre>
    </td>
    <td></td>
  </tr>
  <tr>
    <td rowspan=2>F#</td>
    <td>❌</td>
    <td>
    <pre lang="fsharp">
open System
[&ltEntryPoint&gt]
let main argv = 
  let x = [1;2;3;4;5]
  let y = x |> List.map(fun l -> l*2)//이 시점에서 계산됨
  printfn "%A" y.Force
  0
    </pre>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>⭕</td>
    <td>
    <pre lang="fsharp">
open System
[&ltEntryPoint&gt]
let main argv = 
  let x = [1;2;3;4;5]
  let y = lazy(x |> List.map(fun l -> l*2))
  printfn "%A" (y.Force())//이 시점에서 계산됨
  0
    </pre>
    </td>
    <td></td>
  </tr>
  <tr>
    <td >Rust</td>
    <td>❓</td>
    <td>
    <pre lang="rust">
언어 스펙상에는 Iterator 계열에만 적용, `rust-lazy` 나 `Trunk` 같은 외부 라이브러리를 통해 함수의 lazy evaluation 구현 가능
    </pre>
    </td>
    <td></td>
  </tr>
</table>

##### Scala 에서의 메모이제이션 처리
scala 에서는 매우 강력한 메모이제이션이 수행되는 것으로 확인됨
```scala
object main {
  def main(args:Array[String]):Unit ={
    val x = {//lazy 키워드에 상관 없이
      println("print")
      234234
    }
    val w = x//여기서 print가 수행됨
    val w2 = x//x의 값은 234234 로 평가되기 때문에 print가 수행되지 않음
  }
}
```

>### FP 실천사항 1 - 순수함수
>- 코드에서 가능한 순수 함수의 비율이 높아지도록 하자
>  - 전역 변수나 멤버 변수의 의존도를 낮추기
>  - 상태를 없애거나 줄이고 부작용 격리
>- 함수는 주어진 인자만 처리하는 형태로
>  - 레퍼런스 인자를 받는 것을 지양하고 값을 리턴하는 형태로
>  - 한번에 여러 값을 반환할 때는 tuple 타입 사용

## 불변성 Immutability
새로운 객체를 생성할 때만 값을 바꿀 수 있음  
ex) Java String
```java
String str = "Codemind 2020";
str.replace("2020","2021")
System.out.println(str);
```
위의 예제의 경우 `str.replace` 함수는 원본 객체를 건드리지 않고, 변경된 새 객체를 반환하므로 변경된 값이 출력되지 않음. 아래의 예제는 변경된 값을 출력하는 예시

```java
String str = "Codemind 2020";
String newStr = str.replace("2020","2021")
System.out.println(newStr);
```

### 불변객체의 특징
- 내용의 변경은 새로운 객체를 생성할 때만 가능
- 생성, 테스트, 사용법이 단순하고 쉬움
  - 생성자만 보면 이 객체를 알 수 있음
- Thread-safe
  - Read only 이기 때문에 race condition 발생이 없다
- 쉬운 캐싱 : 같은 이름이면 내용도 같음
- Temporal Coupling 이 적음
>`시간적 결합 Temporal Coupling`  
>소프트웨어의 설계 요소 자체로서의 시간
> - 동시성
> - 순서
>
>이 경우에는 `순서` 에 조금 더 중점을 맞춤.  
>메소드 A->B->C 순서대로 처리되어야 할 때 불변객체는 생성자에서 객체의 상태가 보장되기 때문에 단계 누락, 순서 오류로부터 안전함
- Identity Mutability Problem이 없음
- 메모리 낭비가 심함
  - 그러나 CPU 클럭 속도의 한계와 무어의 법칙이 근대의 CPU에 계승되지 못하는 반면, 메모리의 가격과 용량은 빠르게 증가하고 있는 추세

>### FP 실천사항 2 - 불변객체
>- 사용하는 객체를 불변으로 일단 바꾸어 놓고 코드를 고쳐보자
>   - Setter 대신 생성자에서 인자로 초기화
>   - 객체를 변경하지 않는 멤버함수들은 const로
>- 영속성 자료 구조에 대해 알아보기
>>`영속성 자료 구조 persistent data structure`

## 고차함수와 함수의 합성

### 고차함수
- 함수의 인자로 한 개 이상의 함수를 넘겨 받거나, 함수의 결과값으로 다른 함수를 돌려주는 함수
- cpp 에서의 algorithm

### 고차함수의 기본 3총사
- map,transform
>`map function`  
>`A[T]`를 `A[V]`로 바꾸는 함수
- reduce,accumulate,fold
>`A[T]`에 대해 `f(f(f(A[0]),f([1])),f[2])...` 를 적용하는 함수
- filter,remove_if,copy_if
>`A[T]` 의 각 요소 e에 대해 인자로 받은 함수 `f(e)`가 참인 요소만 반환

### 함수의 합성 function composition
[레퍼런스 링크](../The Power of Composition/The Power of Composition.md)



>### FP 실천사항 3 - 고차함수와 합성
>- 고차함수를 사용해서 코드를 간결하게 만들기
>   - 적은 코드에서는 버그찾기가 쉬움 (사막에서 바늘찾기 VS 방에서 책찾기)
>- 알고리즘의 구현부와 사용부분을 분리하기
>   - 로직 구현에서는 실제 관련 없는 임시변수와 상태를 없앰
>- 함수를 합성 가능하게 해서 재활용성을 높이자
>   - 검증된 함수들을 조립해서 안전한 프로그래밍과 빠른 코딩을!
>- 지연연산을 이용한 최적화를 시도하자
>   - 무한리스트에 대해 알아보기(GUI에서의 infinite list가 아니라;)
>        - [레퍼런스 링크](https://kwangyulseo.com/2016/10/19/%ED%95%98%EC%8A%A4%EC%BC%88-%EB%AC%B4%ED%95%9C-%EB%A6%AC%EC%8A%A4%ED%8A%B8/)

## 타입 시스템의 활용

### 타입의 활용
 - 메모리상에 저장된 데이터가 쓰일 방법을 정의
 - 가능한 빠른 단계에서 오류 발견
 - 코드의 함축성 증가
 - 로직 설계의 도구
 - 지원하지 않는 동작은 문법상에서 구현할 수 없음
 - 합성을 위한 접착제

#### Optional 타입 예제
Optional type은 `billion dollar mistake` 인 null을 피하기 위한(null-safe 한)동작을 가능하게 하는 `타입`
```fsharp
type Option<'a> =
  | Some of 'a
  | None
```



### 대수적 자료형 Algebraic Data Types(ADT : abstract data type 아님 ㅎㅎ)

- Product types(*) : pair, typle, struct/class
- Sum types(+) : optional, variant, etc

유효한 상태의 개수보다 데이터 타입의 Cardinality(표현될 수 있는 경우의 수)가 크다면 버그를 유발할 수 있음

```fsharp
type AppleVariety = Red | Green
type BananaVariety = Yellow | Brown
type CherryVariety = Tart | Sweet

type FruitSalad = {
  Apple: AppleVariety
  Banana: BananaVariety
  Cherry: CherryVariety
}

type SaladVariety = FruitSalad | ChickenBrestSalad

type Breakfast = {
  salad: SaladVariety
  ...
}
```
```fsharp
type Suit = 
  | Club 
  | Diamond 
  | Space 
  | Heart
type Rank = 
  | Ace   | Two   | Three 
  | Four  | Five  | Six 
  | Seven | Eight | Nine 
  | Ten   | Jack  | Queen | King

type Card = {
  Suit: Suit
  Rank: Rank
}

type Hand = list<Card>
type Deck = list<Card>

type Player = {
  Name : string,
  Hand : Hand
}

type Game = {
  Deck: Deck
  Players: list<Player>
}

type Deal = Deck -> (Deck * Card)

type PickupCard = (Hand * Card) -> Hand
```

하나의 화면 안에 도메인을 모두 담을 수 있다(조금 비약적임)

이런 방식의 설계를 `Domain Driven Design` 이라고 함
