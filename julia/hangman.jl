#!/usr/bin/env bash
# -*-coding:utf-8-*-
#=
exec julia --color=yes --startup-file=no -e 'include(popfirst!(ARGS))' \
    "${BASH_SOURCE[0]}" "$@"
=#

# Copyright (c) 2021, Oliver Merkel.
# Please see the AUTHORS file for details.
# All rights reserved.
#
# Use of this code is governed by a
# MIT license that can be found in the LICENSE file.

const FILENAME = "dict_en.txt"
const MAXFALSEATTEMPTS = 5

function welcome()
    println("Guess my secret word with a maximum of $MAXFALSEATTEMPTS false attempts.")
end

function get_word()
    words = readlines(FILENAME)
    word = words[rand(1:length(words))]
    return word
end

function get_test_result( word::String, guesses::String )
    result = ""
    incorrect = 0
    for c in word
        if c in guesses
            result *= c
        else
            result *= "_"
            incorrect += 1
        end
    end
    ( result, incorrect )
end

function play_again()
    yes = [ "y", "yes", "sure" ]
    no = [ "n", "no", "nope" ]
    is_yes = false
    is_no = false
    while (!is_yes && !is_no)
        println("Play again?")
        answer = lowercase(readline())
        is_yes = answer in yes
        is_no = answer in no
        if (!is_yes && !is_no)
            println("Sorry? Please answer with yes or no...")
        end
    end
    return is_yes
end

function game_loop()
    welcome()
    word = get_word()
    end_of_game = false
    false_attempts = 0
    guesses = ""
    while !end_of_game
        ( result, incorrect ) = get_test_result( word, guesses )
        println(result)
        if incorrect == 0
            end_of_game = true
            println("You won!")
        else
            println("Guess a character: ")
            guess = lowercase(strip(readline()))
            if length(guess) != 1
                println("Type a single character only! Try again...")
            elseif !all(isletter, guess)
                println("Type a alphabetic character! Try again...")
            elseif occursin(guess, guesses)
                println("You already guessed this character! Try again...")
            else
                guesses *= guess
                if !occursin(guess, word)
                    false_attempts += 1
                    println("Wrong.")
                    if false_attempts == 1
                        println("You have one false attempt.")
                    else
                        println("You have $false_attempts false attempts.")
                    end
                    if false_attempts > MAXFALSEATTEMPTS
                        end_of_game = true
                        println("You lost!")
                        println("The secret word has been ", uppercase(word))
                    end
                end
            end
        end
    end
end

function menu_loop()
    keep_playing = true
    while keep_playing
        game_loop()
        keep_playing = play_again()
    end
    println("Bye.");
end

menu_loop()
