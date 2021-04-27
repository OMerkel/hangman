#!/usr/bin/env node

'use strict';

/*
   Copyright (c) 2021, Oliver Merkel.
   Please see the AUTHORS file for details.
   All rights reserved.

  @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>

   Use of this code is governed by a
   MIT license that can be found in the LICENSE file.
 */

const fs = require('fs')
const prompt = require('prompt-sync')();

function Hangman() {
}

Hangman.prototype.welcome = function(maxFalseAttempts) {
  console.log('Guess my secret word with a maximum of ' +
    maxFalseAttempts + ' false attempts.');
};

Hangman.prototype.playAgain = function() {
  var yes = [ 'y', 'yes', 'sure' ];
  var no = [ 'n', 'no', 'nope' ];
  var isYes = false;
  var isNo = false;
  while (!isYes && !isNo) {
    var answer = prompt('Play again? ').toLowerCase();
    isYes = yes.includes(answer);
    isNo = no.includes(answer);
    if (!isYes && !isNo) {
      console.log('Sorry? Please answer with yes or no...');
    }
  }
  return isYes;
};

Hangman.prototype.getWord = function() {
  var word = '';
  try {
    var words = fs.readFileSync('dict_en.txt', 'utf8').split('\n');
    while (word == '') {
      word = words[Math.floor(Math.random() * words.length)].trim();
    }
  } catch (err) {
    console.error(err)
  }
  return word;
};

Hangman.prototype.getResult = function( word, guesses ) {
  var result = '';
  var incorrect = 0;
  for (var i=0; i<word.length; ++i) {
    var char=word[i];
    if (guesses.includes(char.toLowerCase())) {
      result += char;
    }
    else {
      result += '_';
      incorrect++;
    }
  }
  return { 'result': result, 'incorrect': incorrect };
};

Hangman.prototype.loop = function() {
  var maxFalseAttempts = 5;
  var falseAttempts = 0;
  var endOfGame = false;
  var word = this.getWord();
  var guesses = '';
  this.welcome(maxFalseAttempts);
  while (!endOfGame) {
    var test = this.getResult(word, guesses);
    console.log(test['result']);
    if (test['incorrect'] == 0) {
      endOfGame = true;
      console.log('You won!');
    }
    else {
      var guess = prompt('Guess a character: ').toLowerCase();
      if (guess.length != 1) {
        console.log('Type a single character only! Try again...');
      }
      else if (!guess.match(/[a-z]/i)) {
        console.log('Type a alphabetic character! Try again...');
      }
      else if (guesses.includes(guess)) {
        console.log('You already guessed this character! Try again...');
      }
      else {
        guesses += guess;
        if (!word.includes(guess)) {
          falseAttempts++;
          console.log('Wrong.');
          if (falseAttempts == 1) {
            console.log('You have one false attempt.');
          }
          else {
            console.log('You have ' + falseAttempts + ' false attempts.');
          }
          if (falseAttempts > maxFalseAttempts) {
            endOfGame = true;
            console.log('You lost!');
            console.log('The secret word has been ' + word.toUpperCase());
          }
        }
      }
    }
  }
};

Hangman.prototype.main = function() {
  var keepPlaying = true;
  while (keepPlaying) {
    this.loop();
    keepPlaying = this.playAgain();
  }
  console.log('Bye.');
};

(new Hangman()).main();
