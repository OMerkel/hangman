module Hangman;

// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

import std.stdio;
import std.string;
import std.random;
import std.conv;
import std.algorithm: canFind;
import std.ascii: isAlpha;
import std.range: stride;

const FILENAME = "dict_en.txt";
const MAXFALSEATTEMPTS = 5;

struct TestResult {
    string result;
    int incorrect;
}

void welcome() {
    writeln("Guess my secret word with a maximum of ", MAXFALSEATTEMPTS, " false attempts.");
}

auto playAgain() {
    auto yes = [ "y", "yes", "sure" ];
    auto no = [ "n", "no", "nope" ];
    auto isYes = false;
    auto isNo = false;
    while (!isYes && !isNo) {
        writeln("Play again?");
        auto answer = strip(readln()).toLower();
        isYes = yes.canFind( answer );
        isNo = no.canFind( answer );
        if (!isYes && !isNo) {
            writeln("Sorry? Please answer with yes or no...");
        }
    }
    return isYes;
}

string getWord() {
    auto rnd = Random(unpredictableSeed);
    string[] words;
    foreach (line ; File(FILENAME).byLine)
        words ~= strip(line.to!string);
    auto word = words[uniform(0, words.length, rnd)];
    return word;
}

TestResult getTestResult( string word, string guesses ) {
    auto result = "";
    auto incorrect = 0;
    foreach (c; word.stride(1)) {
        if (guesses.canFind(c)) {
            result ~= c;
        }
        else {
            result ~= "_";
            incorrect += 1;
        }
    }
    TestResult tr = { result, incorrect };
    return tr;
}

void gameLoop() {
    welcome();
    auto word = getWord();
    auto endOfGame = false;
    auto falseAttempts = 0;
    auto guesses = "";
    while (!endOfGame) {
        auto test = getTestResult( word, guesses );
        writeln(test.result);
        if (test.incorrect == 0) {
            endOfGame = true;
            writeln("You won!");
        }
        else {
            writeln("Guess a character: ");
            auto guess = strip(readln()).toLower();
            if (guess.length != 1) {
                writeln("Type a single character only! Try again...");
            }
            else if (!isAlpha(guess[0])) {
                writeln("Type a alphabetic character! Try again...");
            }
            else if (guesses.canFind(guess)) {
                writeln("You already guessed this character! Try again...");
            }
            else {
                guesses ~= guess;
                if (!word.canFind(guess)) {
                    falseAttempts += 1;
                    writeln("Wrong.");
                    if (falseAttempts == 1) {
                        writeln("You have one false attempt.");
                    }
                    else {
                        writeln("You have ", falseAttempts, " false attempts.");
                    }
                    if (falseAttempts > MAXFALSEATTEMPTS) {
                        endOfGame = true;
                        writeln("You lost!");
                        writeln("The secret word has been ", word.toUpper());
                    }
                }
            }
        }
    }
}

void menuLoop() {
    auto keepPlaying = true;
    while (keepPlaying) {
        gameLoop();
        keepPlaying = playAgain();
    }
    writeln("Bye.");
}

int main()
{
    menuLoop();
    return 0;
}
