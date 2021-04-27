#!/usr/bin/env ruby
# -*-coding:utf-8-*-

=begin
  Copyright (c) 2021, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.

  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.
=end

class Hangman

  def welcome
    puts "Guess my secret word with a maximum of #{@maxFalseAttempts} false attempts."
  end

  def getWord
    filename = "dict_en.txt"
    dictionary = File.open(filename)
    words = dictionary.readlines
    words.sample.chomp
  end

  def getResult( word, guesses )
    result = ""
    incorrect = 0
    for rune in word.scan /\w/
      if guesses.include?rune.downcase
        result += rune
      else
        result += '_'
        incorrect += 1
      end
    end
    return { "result" => result, "incorrect" => incorrect }
  end

  def loop
    @maxFalseAttempts = 5
    welcome
    endOfGame = false
    word = getWord
    guesses = ''
    falseAttempts = 0
    until endOfGame
      test = getResult( word, guesses )
      puts test["result"]
      if test["incorrect"] == 0
        endOfGame = true
        puts "You won!"
      else
        puts "Guess a character:"
        guess = gets.chomp.downcase
        if guess.length != 1
          puts 'Type a single character only! Try again...'
        elsif not /[[:alpha:]]/ =~ guess
          puts 'Type a alphabetic character! Try again...'
        elsif guesses.include?guess
          puts 'You already guessed this character! Try again...'
        else
          guesses += guess
          if not word.downcase.include?guess
            falseAttempts += 1
            puts 'Wrong.'
            if falseAttempts == 1
              puts 'You have one false attempt.'
            else
              puts "You have #{falseAttempts} false attempts."
            end
            if falseAttempts > @maxFalseAttempts
              endOfGame = true
              puts 'You lost!'
              puts 'The secret word has been ' + word.upcase
            end
          end
        end
      end
    end
  end

end

def playAgain
  isYes = false
  isNo = false
  until isYes or isNo
    puts('Play again?')
    answer = gets.chomp.downcase
    isYes = /(y|yes|sure)$/ =~ answer
    isNo = /(n|no|nope)$/ =~ answer
    if not isYes and not isNo
      puts 'Sorry? Please answer with yes or no...'
    end
  end
  return isYes
end

if __FILE__ == $0
  h = Hangman.new
  keepPlaying = true
  while keepPlaying
    h.loop
    keepPlaying = playAgain
  end
  puts 'Bye.'
end
