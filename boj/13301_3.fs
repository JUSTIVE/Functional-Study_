open System;
open System.Numerics

let fibo n =
    let memo = Array.zeroCreate (n+1)
    let rec nestFibo (x:int):bigint =
        match x with
        | 1 -> 4I
        | 2 -> 6I
        | 3 -> 10I
        | x->
            match memo.[x] with
            | a when a = BigInteger.Zero ->
                memo.[x] <- [x-1;x-2]|>List.map nestFibo|>List.reduce (+)
                memo.[x]
            | v -> v
    nestFibo n

[<EntryPoint>]
let main argv = 
    Console.ReadLine()
    |>int
    |>fibo
    |>printfn "%A" 
    0