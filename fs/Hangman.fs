open System
open System.IO

(*
// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.
*)

type TestResult = { result: string; incorrect: int; }

let FILENAME = "dict_en.txt"
let MAXFALSEATTEMPTS = 5

let welcome() =
    Console.WriteLine("Guess my secret word with a maximum of " + MAXFALSEATTEMPTS.ToString() + " false attempts.")

let playAgain() =
    let yes = [ "y"; "yes"; "sure" ]
    let no = [ "n"; "no"; "nope" ]
    let mutable isYes = false
    let mutable isNo = false
    while not isYes && not isNo do
        Console.Write("Play again? ")
        let answer = (Console.ReadLine()).ToLower()
        isYes <- List.contains answer yes
        isNo <- List.contains answer no
        if not isYes && not isNo then
            Console.WriteLine("Sorry? Please answer with yes or no...")
    isYes

let getWord() =
    let words = File.ReadAllLines(FILENAME)
    let idx = (new System.Random()).Next(0, words.Length)
    words.[idx]

let getTestResult( word: string, guesses: string ) =
    let mutable result = String.map(fun c -> if guesses.Contains c then c else '_') word
    let mutable incorrect = (String.filter(fun c -> c = '_') result).Length
    { TestResult.result= result; TestResult.incorrect= incorrect; }

let gameLoop() =
    welcome()
    let mutable word = getWord()
    let mutable endOfGame = false
    let mutable falseAttempts = 0
    let mutable guesses = ""
    while not endOfGame do
        let test = getTestResult( word, guesses )
        Console.WriteLine(test.result)
        if test.incorrect = 0 then
            endOfGame <- true
            Console.WriteLine("You won!")
        else
            Console.WriteLine("Guess a character: ")
            let guess = (Console.ReadLine()).ToLower()
            if guess.Length <> 1 then
                Console.WriteLine("Type a single character only! Try again...")
            elif not (Char.IsLetter(guess, 0)) then
                Console.WriteLine("Type a alphabetic character! Try again...")
            elif guesses.Contains guess then
                Console.WriteLine("You already guessed this character! Try again...");
            else
                guesses <- guesses + guess
                if not (word.Contains guess) then
                    falseAttempts <- falseAttempts + 1
                    Console.WriteLine("Wrong.")
                    if falseAttempts = 1 then
                        Console.WriteLine("You have one false attempt.")
                    else
                        Console.WriteLine("You have " + falseAttempts.ToString() + " false attempts.")
                    if falseAttempts > MAXFALSEATTEMPTS then
                        endOfGame <- true
                        Console.WriteLine("You lost!")
                        Console.WriteLine("The secret word has been " + word.ToUpper())

let mainLoop() =
    let mutable keepPlaying = true
    while keepPlaying do
        gameLoop()
        keepPlaying <- playAgain()
    Console.WriteLine("Bye.")

[<EntryPoint>]
let main (_ : string[]) =
    mainLoop()
    0;;
