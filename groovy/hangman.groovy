#!/usr/bin/env groovy
// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

class Hangman {

  private maxFalseAttempts = 5

  def welcome() {
    println "Guess my secret word with a maximum of " + maxFalseAttempts + " false attempts."
  }

  def playAgain() {
    def yes = [ 'y', 'yes', 'sure' ]
    def no = [ 'n', 'no', 'nope' ]
    Boolean isYes = false
    Boolean isNo = false
    while(!isYes && !isNo) {
      print('Play again? ')
      def answer = System.in.newReader().readLine()
      isYes = yes.contains(answer)
      isNo = no.contains(answer)
      if(!isYes && !isNo) {
        println('Sorry? Please answer with yes or no...')
      }
    }
    return isYes
  }

  def getWord() {
    def words = new File('dict_en.txt').getText('UTF-8').split('\n')
    def word = words.shuffled()[0].trim()
    return word
  }

  def getResult( word, guesses ) {
    String result = ''
    int incorrect = 0
    for(rune in word) {
      if(guesses.contains(rune.toLowerCase())) {
        result += rune
      }
      else {
        result += '_'
        incorrect++
      }
    }
    return [ "result" : result, "incorrect" : incorrect ]
  }

  def loop() {
    welcome()
    int falseAttempts = 0
    String word = getWord()
    String guesses = ''
    Boolean endOfGame = false
    while(!endOfGame) {
      def test = getResult(word, guesses)
      println(test["result"])
      if(test["incorrect"] == 0) {
        endOfGame = true
        println('You won!')
      }
      else {
        print('Guess a character: ');
        String guess = System.in.newReader().readLine().toLowerCase()
        def guessChr = guess.chars
        if (guess.length() != 1) {
          println('Type a single character only! Try again...');
          continue;
        }
        if (!guessChr[0].isLetter()) {
          println('Type a alphabetic character! Try again...');
          continue;
        }
        if (guesses.contains(guess)) {
          println('You already guessed this character! Try again...');
          continue;
        }
        guesses += guess;
        if (!word.contains(guess)) {
          falseAttempts++;
          println('Wrong.');
          if (falseAttempts == 1) {
            println('You have one false attempt.');
          }
          else {
            println('You have ' + falseAttempts + ' false attempts.');
          }
          if (falseAttempts > maxFalseAttempts) {
            endOfGame = true;
            println('You lost!');
            println('The secret word has been ' + word.toUpperCase());
          }
        }
      }
    }
  }

  static void main(String[] args) {
    def h = new Hangman()
    Boolean keepPlaying = true
    while(keepPlaying) {
      h.loop()
      keepPlaying = h.playAgain()
    }
    print('Bye.')
  }

}
