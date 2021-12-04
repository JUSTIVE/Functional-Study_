import { TypeApplier, ValueAlias } from './metaType';

type ResultTypeApplier<V extends ResultType, X> = TypeApplier<"resultType", V, X>
export function compose<A, B, C, D, T1>(...functions: any) {
  return functions.reduce(
    (a: (x: T1) => Result<A, B>, b: (y: A) => Result<C, D>) =>
      (value: T1) => {
        const prevEvalResult = a(value)
        switch (prevEvalResult.resultType) {
          case 'Success':
            return b(prevEvalResult.value)
          case 'Failure':
            return prevEvalResult
        }
      })
}

export function flatMap<A, B>(result: Result<A, B>) {
  switch (result.resultType) {
    case 'Success':
      return result.value
    case 'Failure':
      return result
  }
}

export type Success<S> = ResultTypeApplier<"Success", ValueAlias<S>>
export function SUCCESS<S>(value: S): Success<S> {
  return {
    resultType: "Success",
    value: value
  }
}

export type Failure<F> = ResultTypeApplier<"Failure", ValueAlias<F>>
export function FAILURE<F>(value: F): Failure<F> {
  return {
    resultType: "Failure",
    value: value
  }
}

export type ResultType = "Success" | "Failure"
export type Result<S, F> =
  Success<S>
  | Failure<F>