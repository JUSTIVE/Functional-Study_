# Uniform Function Call Syntax
[reference](https://en.wikipedia.org/wiki/Uniform_Function_Call_Syntax)  
범용 함수 호출 문법`Uniform Function Call Syntax`,`Universal Function Call Syntax`는 D 언어 및 Nim 언어에서 수용체를 첫 인자로 사용하고 주어진 인자를 나머지 인자에 사용하여 모든 함수를 메소드 호출처럼 사용할 수 있게 하는 것이다. UFCS는 함수가 체이닝 되어있을 때 특히 강력하다(파이프와 비슷하게 동작함). 이는 자유 함수들을 다른 언어들의 메소드 확장과 비슷한 역할을 수행할 수 있도록 한다. 메소드 호출 문법의 또 다른 장점은 IDE에서 `. 자동 완성`을 사용할 수 있게 하는 것이다.

## cpp 제안서
cpp 표준화의 초창기부터 UFCS는 논의되어왔다. Glassborow(2004)는 특별하게 표시된`annotated` 자유 함수들을 멤버 함수 표기로 호출할 수 있도록 허용하는 Uniform Calling Syntax`UCS`를 제안했다. 이는 Bjarne Stroustrup과 Herb Sutter(2016)에 의해 자유 함수와 멤버 함수를 쓰는 애매한 결정들을 줄여 템플릿 코드를 간단하게 쓸 수 있도록 더 최근에 제안되었다.  
많은 프로그래머들은 멤버 함수 문법의 장점(예를 들어, IDE에서의 `. 자동 완성`같은 것들)을 누리기 위해 멤버 함수를 쓰곤 했다. 그러나 이는 클래스간의 과도한 결합`coupling`으로 이어졌다.

## Rust에서의 사용법
2018까지는 완전 보장 경로 문법, 혹은 보장된(명시적)인 경로 구문을 의미하는 용어로 UFCS를 사용하는 것이 일반적이었습니다. 이유는 같은 구조체에 구현된 동일한 메소드를 정의하는 여러 특성`trait`을 가질 수 있기 때문입니다.

멤버 함수는 또한 자유 함수 함수들을 보장된(이름 공간-된) 경로를 통하게 하는 용도로 쓸 수도 있다.
> 이 경우에서 UFCS는 잘못된 용도로 사용된 것이다:  
> 이는 메소드를 이름 공간된 자유 함수처럼 사용하게 하는 것이지,  
> 자유 함수를 메소드처럼 사용하는 것이 아니기 때문이다.

[reference](https://tour.dlang.org/tour/kr/gems/uniform-function-call-syntax-ufcs)  
## ex)

일반적인 함수 호출의 형태가 다음과 같다고 할 때,
```java
foo(bar(a))
```
UFCS를 이용한 표기는 다음과 같다.
```java
a.bar().foo()
```

D 언어에서는 입력이 필요하지 않은 소괄호도 생략이 가능하다

## more to read
- Trait
- Interface
- Go: 메소드에 더 열린 철학을 가지고 있음
- Loose coupling
- Duck typing