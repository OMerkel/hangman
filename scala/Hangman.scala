// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

import scala.io.Source
import scala.io.StdIn.readLine

object Hangman extends App {

  final val FILENAME = "dict_en.txt"
  final val MAXFALSEATTEMPTS = 5

  case class TestResult (result: String, incorrect: Int)

  def welcome() = {
    println("Guess my secret word with a maximum of " + MAXFALSEATTEMPTS + " false attempts.")
  }

  def playAgain() = {
    val yes = Array("y", "yes", "sure")
    val no = Array("n", "no", "nope")
    var isYes = false
    var isNo = false
    while (!isYes && !isNo) {
      print("Play again? ")
      val answer = readLine().trim().toLowerCase()
      isYes = yes contains answer
      isNo = no contains answer
      if (!isYes && !isNo) {
        println("Sorry? Please answer with yes or no...")
      }
    }
    isYes
  }

  def getWord() = {
    val words = Source.fromFile(FILENAME).getLines.toList
    val r = scala.util.Random
    val idx = r.nextInt(words.length)
    words(idx)
  }

  def getTestResult(word: String, guesses: String) = {
    val result = word.map((c: Char) => if (guesses contains c) then c else '_')
    val incorrect = (result.filter((c: Char) => c == '_')).length
    TestResult(result, incorrect)
  }

  def gameLoop() = {
    welcome()
    val word = getWord()
    var endOfGame = false
    var falseAttempts = 0
    var guesses = ""
    while (!endOfGame) {
      val test = getTestResult(word, guesses)
      println(test.result)
      if (test.incorrect == 0) {
        endOfGame = true
        println("You won!")
      }
      else {
        println("Guess a character: ")
        val guess = readLine().trim().toLowerCase()
        if (guess.length != 1) {
          println("Type a single character only! Try again...")
        }
        else if (!guess(0).isLetter) {
          println("Type a alphabetic character! Try again...")
        }
        else if (guesses contains guess) {
          println("You already guessed this character! Try again...")
        }
        else {
          guesses += guess
          if (!(word contains guess)) {
            falseAttempts += 1
            println("Wrong.")
            if (falseAttempts == 1) {
              println("You have one false attempt.")
            }
            else {
              println("You have " + falseAttempts + " false attempts.")
            }
            if (falseAttempts > MAXFALSEATTEMPTS) {
              endOfGame = true
              println("You lost!")
              println("The secret word has been " + word.toUpperCase())
            }
          }
        }
      }
    }
  }

  def menuLoop() = {
    var keepPlaying = true
    while (keepPlaying) {
      gameLoop()
      keepPlaying = playAgain()
    }
    println("Bye.")
  }

  menuLoop()
}
