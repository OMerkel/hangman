// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

use rand::seq::IteratorRandom;
use std::{
    fs::File,
    io::{BufRead, BufReader},
};
use std::io;

const FILENAME: &str = "dict_en.txt";
const MAXFALSEATTEMPTS: u8 = 5;

struct TestResult {
    result: String,
    incorrect: u16,
}

fn welcome() {
    println!("Guess my secret word with a maximum of {} false attempts.", MAXFALSEATTEMPTS);
}

fn play_again() -> bool {
    let yes = vec![ "y", "yes", "sure" ];
    let no = vec![ "n", "no", "nope" ];
    let mut is_yes = false;
    let mut is_no = false;
    while !is_yes & !is_no {
        println!("Play again?");
        let mut answer = String::new();
        io::stdin()
            .read_line(&mut answer)
            .expect("Failed to get your answer.");
        answer = answer.trim().to_lowercase();
        is_yes = yes.contains( &answer.as_str() );
        is_no = no.contains( &answer.as_str() );
        if !is_yes & !is_no {
            println!("Sorry? Please answer with yes or no...");
        }
    }
    return is_yes;
}

fn get_word() -> String {
    let f = File::open(FILENAME)
        .unwrap_or_else(|e| panic!("File {} not found. {}", FILENAME, e));
    let file = BufReader::new(&f);
    let words = file.lines().map(|l| l.expect("Couldn't read word."));
    words
        .choose(&mut rand::thread_rng())
        .expect("Failed to get a secret word!")
        .trim().to_owned()
}

fn get_test_result ( word: &String, guesses: &String ) -> TestResult {
    let mut result = "".to_string();
    let mut incorrect = 0;
    for c in word.chars() {
        if guesses.contains(c) {
            result += &c.to_string();
        }
        else {
            result += "_";
            incorrect += 1;
        }
    }
    return TestResult {
        result: result,
        incorrect: incorrect,
    };
}

fn game_loop() {
    welcome();
    let word = get_word();
    let mut end_of_game = false;
    let mut false_attempts = 0;
    let mut guesses = "".to_string();
    while !end_of_game {
        let test = get_test_result( &word, &guesses );
        println!("{}", test.result);
        if test.incorrect == 0 {
            end_of_game = true;
            println!("You won!");
        }
        else {
            println!("Guess a character: ");
            let mut guess = String::new();
            io::stdin()
                .read_line(&mut guess)
                .expect("Failed to get your guess.");
            guess = guess.trim().to_lowercase();
            if guess.chars().count() != 1 {
                println!("Type a single character only! Try again...");
            }
            else if !guess.chars().nth(0).unwrap().is_alphabetic() {
                println!("Type a alphabetic character! Try again...");
            }
            else if guesses.contains(&guess) {
                println!("You already guessed this character! Try again...");
            }
            else {
                guesses += &guess;
                if !word.contains(&guess) {
                    false_attempts += 1;
                    println!("Wrong.");
                    if false_attempts == 1 {
                        println!("You have one false attempt.");
                    }
                    else {
                        println!("You have {} false attempts.", false_attempts);
                    }
                    if false_attempts > MAXFALSEATTEMPTS {
                        end_of_game = true;
                        println!("You lost!");
                        println!("The secret word has been {}", word.to_uppercase());
                    }
                }
            }
        }
    }
}

fn menu_loop() {
    let mut keep_playing = true;
    while keep_playing {
        game_loop();
        keep_playing = play_again();
    }
    println!("Bye.");
}

fn main() {
    menu_loop();
}
