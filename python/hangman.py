#!/usr/bin/env python3
# -*-coding:utf-8-*-

"""
// Copyright (c) 2019, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

>>> Game().loop(word="banana", guesses="abn")
banana
You won!
"""

import random

class Game:
  """
  >>> g = Game()
  """

  maxFalseAttempts = 5

  def welcome(self):
    """
    >>> Game().welcome() # doctest: +ELLIPSIS
    Guess my secret word with a maximum of 5 false attempts.
    <hangman.Game object at 0x...>
    """
    print("Guess my secret word with a maximum of " + str(self.maxFalseAttempts) + " false attempts.")
    return self

  def playAgain(self, isYes = False, isNo = False):
    """
    >>> Game().playAgain(isYes = True)
    True
    >>> Game().playAgain(isNo = True)
    False
    """
    yes = [ 'y', 'yes', 'sure' ]
    no = [ 'n', 'no', 'nope' ]
    while not isYes and not isNo:
      answer = str(input('Play again? ')).lower()
      isYes = answer in yes
      isNo = answer in no
      if not isYes and not isNo:
        print('Sorry? Please answer with yes or no...')
    return isYes;

  def getWord(self, verbose=False, fileName="dict_en.txt"):
    """
    >>> Game().getWord() != ""
    True
    >>> len(Game().getWord()) >= 5
    True
    >>> Game().getWord(verbose=True) != ""
    Found 419 words.
    True
    >>> Game().getWord(verbose=True, fileName="dict_de.txt") != ""
    Found 554 words.
    True
    """
    with open(fileName, 'r') as file:
      words = list(file)
    file.close()
    if verbose:
      print("Found " + str(len(words)) + " words.")
    result = ""
    while len(result) == 0:
      result = random.choice(words).lower().strip()
    return result

  def getResult(self, word, guesses):
    """
    >>> Game().getResult("secret", "eca")
    ('_ec_e_', 3)
    >>> Game().getResult("secret", "ecs")
    ('sec_e_', 2)
    >>> Game().getResult("secret", "ecsrt")
    ('secret', 0)
    >>> Game().getResult("abcdef", "")
    ('______', 6)
    """
    result = ''
    incorrect = 0
    for char in word:
      if char in guesses:
        result += char
      else:
        result += "_"
        incorrect += 1
    return (result, incorrect)

  def loop(self, endOfGame=False, falseAttempts=0, word="hangman", guesses=""):
    """
    >>> Game().loop(endOfGame=True)
    >>> Game().loop(guesses="aghmn")
    hangman
    You won!
    >>> Game().loop(word="banana", guesses="abn")
    banana
    You won!
    """
    while not endOfGame:
      (result, incorrect) = self.getResult(word, guesses)
      print(result)
      if incorrect == 0:
        endOfGame = True
        print("You won!")
      else:
        guess = str(input("Guess a character: ")).lower()
        if len(guess) != 1:
          print("Type a single character only! Try again...")
          continue
        if not guess.isalpha():
          print("Type a alphabetic character! Try again...")
          continue
        if guess in guesses:
          print("You already guessed this character! Try again...")
          continue
        guesses += guess
        if guess not in word:
          falseAttempts += 1
          print("Wrong.")
          if falseAttempts == 1:
            print("You have one false attempt.")
          else:
            print("You have " + str(falseAttempts) + " false attempts.")
          if falseAttempts > self.maxFalseAttempts:
            endOfGame = True
            print("You lost!")
            print("The secret word has been " + word.upper())

if __name__ == "__main__":
  g = Game()
  g.welcome()
  keepPlaying = True
  while keepPlaying:
    g.loop(word=g.getWord())
    keepPlaying = g.playAgain()
  print('Bye.')
