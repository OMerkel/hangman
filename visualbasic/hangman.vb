Imports System

REM  Copyright (c) 2021, Oliver Merkel.
REM  Please see the AUTHORS file for details.
REM  All rights reserved.

REM  Use of this code is governed by a
REM  MIT license that can be found in the LICENSE file.

Module hangman
  Dim maxFalseAttempts As Integer = 5

  Private Structure TResult
    Public result As String
    Public incorrect As Integer
  End Structure

  Private Sub Welcome()
    Console.WriteLine($"Guess my secret word with a maximum of {maxFalseAttempts} false attempts.")
  End Sub

  Private Function GetWord() As String
    Dim words() = IO.File.ReadAllLines("dict_en.txt")
    Dim word As String
    Dim r As New System.Random()
    word = ""
    While word.Equals("")
      word = words(r.Next(words.Length)).Trim()
    End While
    Return word
  End Function

  Private Function GetResult(word As String, guesses As String) As TResult
    Dim result As New TResult With {.result = "", .incorrect = 0}
    result.result = ""
    result.incorrect = 0
    For Each ch In word
      If guesses.Contains(ch.ToString().ToLower()) Then
        result.result = result.result + ch
      Else
        result.result = result.result + "_"
        result.incorrect = result.incorrect + 1
      End If
    Next
    Return result
  End Function

  Private Sub GameLoop()
    Welcome()
    Dim endOfGame = False
    Dim word = GetWord()
    Dim guesses = ""
    Dim falseAttempts = 0
    While Not endOfGame
      Dim test As New TResult With {.result = "", .incorrect = 0}
      test = GetResult(word, guesses)
      Console.WriteLine(test.result)
      If test.incorrect.Equals(0) Then
        endOfGame = True
        Console.WriteLine("You won!")
      Else
        Console.WriteLine("Guess a character:")
        Dim guess = Console.ReadLine().Trim().ToLower()
        If guess.Length <> 1 Then
          Console.WriteLine("Type a single character only! Try again...")
        ElseIf Not Char.IsLetter(guess, 0) Then
          Console.WriteLine("Type a alphabetic character! Try again...")
        ElseIf guesses.IndexOf(guess) <> -1 Then
          Console.WriteLine("You already guessed this character! Try again...")
        Else
          guesses = guesses + guess
          If Not word.ToLower().Contains(guess) Then
            falseAttempts = falseAttempts + 1
            Console.WriteLine("Wrong.")
            If falseAttempts = 1 Then
              Console.WriteLine("You have one false attempt.")
            Else
              Console.WriteLine($"You have {falseAttempts} false attempts.")
            End If
            If falseAttempts > maxFalseAttempts Then
              endOfGame = True
              Console.WriteLine("You lost!")
              Console.WriteLine("The secret word has been " + word.ToUpper())
            End If
          End If
        End If
      End If
    End While
  End Sub

  Private Function PlayAgain() As Boolean
    Dim yes = {"y", "yes", "sure"}
    Dim no = {"n", "no", "nope"}
    Dim isYes = False
    Dim isNo = False
    While Not isYes And Not isNo
      Console.WriteLine("Play again?")
      Dim answer = Console.ReadLine().Trim().ToLower()
      isYes = yes.Contains(answer)
      isNo = no.Contains(answer)
      If Not isYes And Not isNo Then
        Console.WriteLine("Sorry? Please answer with yes or no...")
      End If
    End While
    Return isYes
  End Function

  Public Sub Main(args As String())
    Dim keepPlaying = True
    While keepPlaying
      GameLoop()
      keepPlaying = PlayAgain()
    End While
    Console.WriteLine("Bye.")
  End Sub
End Module
