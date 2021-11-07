open System;

let rec genFibo (state:array<bigint>) n=
    if (n>80) then state
    else
        genFibo ([|(state.[n-1]+state.[n-2])|]|>Array.append state) (n+1)

let calculateSquare x:bigint=
    let memoize = genFibo ([|0;1;1;2;3;5|]|>Array.map bigint) 6
    printfn "%A" memoize

    match x with
    | a when x = 1 -> (memoize.[x]) * (bigint 4)
    | b when x = 2 -> (memoize.[x]) * (bigint 6)
    | c when x = 3 -> (memoize.[x]) * (bigint 3) + (memoize.[(x-1)]) * (bigint 4)
    | __ -> 
        (memoize.[x]) * (bigint 3)
        + (memoize.[(x-1)]) * (bigint 2)
        + (memoize.[(x-2)]) * (bigint 2)
        + (memoize.[(x-3)]) 

[<EntryPoint>]
let main argv = 
    Console.ReadLine()
    |>int
    |>calculateSquare
    |>printfn "%A" 
    0