Program Hangman;
{$MODE DELPHI}

(*
  Copyright (c) 2021, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.

  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.
 *)

Uses
  Classes, SysUtils;

Type
  TResult = Record
    result: String;
    incorrect: UInt8;
  End;

Const maxFalseAttempts = 5;

Procedure welcome();
Begin
  Writeln('Guess my secret word with a maximum of ' +
    IntToStr(maxFalseAttempts) + ' false attempts.');
End;

Function playAgain(): Boolean;
Var
  yes: TStringList = nil;
  no: TStringList = nil;
  isYes: Boolean;
  isNo: Boolean;
  answer: String;
Begin
  yes := TStringList.create;
  yes.Delimiter := ';';
  yes.Add( 'y' );
  yes.Add( 'yes' );
  yes.Add( 'sure' );
  no := TStringList.create;
  no.Delimiter := ';';
  no.Add( 'n' );
  no.Add( 'no' );
  no.Add( 'nope' );
  isYes := False;
  isNo := False;
  While not isYes and not isNo Do
  Begin
    Writeln('Play again?');
    Readln(answer);
    answer := Lowercase( answer );
    isYes := yes.IndexOf( answer ) <> -1;
    isNo := no.IndexOf( answer ) <> -1;
    If not isYes and not isNo Then
    Begin
      Writeln('Sorry? Please answer with yes or no...');
    End;
  End;
  result := isYes;
End;

Function getWord():String;
Var
  FS: TFileStream;
  RB: TReader;
  words: TStringList;
  word: String;
Begin
  words := TStringList.Create;
  Try
    words.LoadFromFile('dict_en.txt');
  Except
    on E: EInOutError Do
      Writeln('File error occurred: ', E.Message);
  End;
  result := words.Strings[Random(words.Count)];
  words.Free;
End;

Function getResult( Const word: String; Const guesses: String ):TResult;
Var res : TResult;
  ch: String;
Begin
  res.result := '';
  res.incorrect := 0;
  For ch in word Do
  Begin
    If guesses.IndexOf(ch) <> -1 Then
    Begin
      res.result := res.result + ch;
    End
    Else
    Begin
      res.result := res.result + '_';
      res.incorrect := res.incorrect + 1;
    End;
  End;
  result := res;
End;

Procedure loop();
Var word: String;
  endOfGame: Boolean;
  falseAttempts: UInt8;
  guesses: String;
  test: TResult;
  guess: String;
Begin
  endOfGame := False;
  falseAttempts := 0;
  word := getWord();
  guesses := '';
  welcome();
  While not endOfGame Do
  Begin
    test := getResult(word, guesses);
    Writeln(test.result);
    If test.incorrect = 0 Then
    Begin
      endOfGame := True;
      Writeln('You won!');
    End
    Else
    Begin
      Writeln('Guess a character: ');
      Readln(guess);
      guess := Lowercase( guess );
      If Length(guess) <> 1 Then
      Begin
        Writeln('Type a single character only! Try again...');
      End
      Else If (CompareStr(guess, 'a') < 0) or (CompareStr(guess, 'z') > 0) Then
      Begin
        Writeln('Type a alphabetic character! Try again...');
      End
      Else If guesses.IndexOf(guess) <> -1 Then
      Begin
        Writeln('You already guessed this character! Try again...');
      End
      Else
      Begin
        guesses := guesses + guess;
        If word.IndexOf(guess) = -1 Then
        Begin
          falseAttempts := falseAttempts + 1;
          Writeln('Wrong.');
          If falseAttempts = 1 Then
          Begin
            Writeln('You have one false attempt.');
          End
          Else
          Begin
            Writeln('You have ' + IntToStr(falseAttempts) + ' false attempts.');
          End;
          If falseAttempts > maxFalseAttempts Then
          Begin
            endOfGame := True;
            Writeln('You lost!');
            Writeln('The secret word has been ' + Uppercase(word));
          End;
        End;
      End;
    End;
  End;
End;

Procedure main();
Var keepPlaying: Boolean;
Begin
  keepPlaying := True;
  While keepPlaying Do
  Begin
    loop();
    keepPlaying := playAgain();
  End;
  Writeln( 'Bye.' );
End;

Begin
  Randomize;
  main();
End.
