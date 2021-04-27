// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

using System;
using System.Collections.Generic;
using System.IO;

namespace Hangman
{
  class Hangman
  {
    private int maxFalseAttempts = 5;

    class TestResult
    {
      public string result { get; }
      public int incorrect { get; }

      public TestResult ( string word, string guesses )
      {
        this.result = "";
        this.incorrect = 0;
        foreach (char c in word.ToLower())
        {
          if (guesses.Contains(Char.ToString(c)))
          {
            result += c;
          }
          else
          {
            result += "_";
            this.incorrect++;
          }
        }
      }
    }

    private void welcome()
    {
      Console.WriteLine("Guess my secret word with a maximum of " +
        this.maxFalseAttempts + " false attempts.");
    }

    private Boolean playAgain()
    {
      var yes = new List<string> { "y", "yes", "sure" };
      var no = new List<string> { "n", "no", "nope" };
      Boolean isYes = false;
      Boolean isNo = false;
      while (!isYes && !isNo)
      {
        Console.WriteLine("Play again? ");
        String answer = Console.ReadLine().ToLower(); ;
        isYes = yes.Contains(answer);
        isNo = no.Contains(answer);
        if (!isYes && !isNo)
        {
          Console.WriteLine("Sorry? Please answer with yes or no...");
        }
      }
      return isYes;
    }

    private string getWord()
    {
      Random r = new Random();
      string[] words = { };
      try
      {
        words = File.ReadAllLines(@"dict_en.txt");
      }
      catch( IOException ex )
      {
        Console.WriteLine( ex );
      }
      string word = "";
      while (word == "")
      {
        word = words[r.Next(words.Length)].Trim();
      }
      return word;
    }

    private void loop()
    {
      this.welcome();
      string word = this.getWord();
      Boolean endOfGame = false;
      int falseAttempts = 0;
      string guesses = "";
      while (!endOfGame)
      {
        TestResult test = (new TestResult(word, guesses));
        Console.WriteLine(test.result);
        if (test.incorrect == 0)
        {
          endOfGame = true;
          Console.WriteLine("You won!");
        }
        else
        {
          Console.WriteLine("Guess a character: ");
          string guess = Console.ReadLine();
          if (guess.Length != 1)
          {
            Console.WriteLine("Type a single character only! Try again...");
          }
          else if (!char.IsLetter(guess, 0))
          {
            Console.WriteLine("Type a alphabetic character! Try again...");
          }
          else if (guesses.Contains(guess))
          {
            Console.WriteLine("You already guessed this character! Try again...");
          }
          else
          {
            guesses += guess;
            if (!word.Contains(guess))
            {
              falseAttempts++;
              Console.WriteLine("Wrong.");
              if (falseAttempts == 1)
              {
                Console.WriteLine("You have one false attempt.");
              }
              else
              {
                Console.WriteLine("You have " + falseAttempts + " false attempts.");
              }
              if (falseAttempts > maxFalseAttempts)
              {
                endOfGame = true;
                Console.WriteLine("You lost!");
                Console.WriteLine("The secret word has been " + word.ToUpper());
              }
            }
          }
        }
      }
    }

    private void menuloop()
    {
      Boolean keepPlaying = true;
      while (keepPlaying)
      {
        this.loop();
        keepPlaying = this.playAgain();
      }
      Console.WriteLine("Bye.");
    }

    static void Main(string[] args)
    {
      (new Hangman()).menuloop();
    }
  }
}
