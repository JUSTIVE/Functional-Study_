export type TypeApplier<T extends string, V, X> = Readonly<{ [key in T]: V }> & X
export type ValueAlias<V> = { value: V }