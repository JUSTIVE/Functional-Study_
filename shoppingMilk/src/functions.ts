export function currify<F extends (...x: any) => any>(
  fn: (...x: Parameters<F>[]) => ReturnType<F>,
  ...givenArguments: Parameters<F>[]) {
  return (...nextArguments: any) => {
    const joinedArguements = [...givenArguments, ...nextArguments]
    return (joinedArguements.length >= fn.length)
      ? fn(...joinedArguements)
      : currify(fn, ...joinedArguements)
  }
}