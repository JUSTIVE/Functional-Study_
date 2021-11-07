open System;

let mutable memoize = Map.empty<int,bigint>

let rec fibo n :bigint =
    match n with
    | known when n < 6 -> 
        [|1;1;2;3;5|].[known - 1]
        |>bigint 
    | __ -> memoFibo (n-1) + memoFibo (n-2)

and memoFibo (n:int) =
    match memoize|>Map.tryFind n with
    | Some v -> v
    | None ->
        let result = fibo n
        memoize <- memoize|>Map.add n result
        result

let calculateSquare x :bigint=
    match x with
    | a when x = 1 -> (memoFibo x) * (bigint 4)
    | b when x = 2 -> (memoFibo x) * (bigint 6)
    | c when x = 3 -> (memoFibo x) * (bigint 3) + (memoFibo (x-1)) * (bigint 4)
    | __ -> 
        (memoFibo x) * (bigint 3)
        + (memoFibo (x-1)) * (bigint 2)
        + (memoFibo (x-2)) * (bigint 2)
        + (memoFibo (x-3)) 

[<EntryPoint>]
let main argv = 
    Console.ReadLine()
    |>int
    |>calculateSquare
    |>printfn "%A" 
    0