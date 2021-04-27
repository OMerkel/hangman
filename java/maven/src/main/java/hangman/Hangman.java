package hangman;

// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

import java.io.File;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Random;

public class Hangman {

  private class TestResult {
    String result;
    int incorrect;

    public TestResult( String word, String guesses ) {
      this.result = "";
      this.incorrect = 0;
      for (char c : word.toLowerCase().toCharArray()) {
        if (guesses.contains(Character.toString(c))) {
          result += c;
        }
        else {
          result += '_';
          this.incorrect++;
        }
      }
    }

    public String getResult() {
      return this.result;
    }

    public int getIncorrect() {
      return this.incorrect;
    }
  }

  private int maxFalseAttempts = 5;

  private void welcome() {
    System.out.println("Guess my secret word with a maximum of " +
      this.maxFalseAttempts + " false attempts.");
  }

  private Boolean playAgain() {
    List<String> yes = List.of( "y", "yes", "sure" );
    List<String> no = List.of( "n", "no", "nope" );
    Boolean isYes = false;
    Boolean isNo = false;
    while (!isYes && !isNo) {
      System.out.println("Play again? ");
      BufferedReader reader = new BufferedReader(
        new InputStreamReader(System.in));
      String answer = "";
      try { answer = reader.readLine().toLowerCase(); }
      catch(IOException ex) {
        System.out.println(ex.toString());
      }
      isYes = yes.contains(answer);
      isNo = no.contains(answer);
      if (!isYes && !isNo) {
        System.out.println("Sorry? Please answer with yes or no...");
      }
    }
    return isYes;
  }

  private String getWord() {
    String filename = "dict_en.txt";
    List<String> words = null;
    Random r = new Random();
    try{
      Path filePath = new File(filename).toPath();
      Charset charset = Charset.defaultCharset();
      words = Files.readAllLines(filePath, charset);
    }
    catch(IOException ex) {
      System.out.println(ex.toString());
      System.out.println("File not found:" + filename);
    }
    String word = "";
    while (word == "") {
      word = words.get(r.nextInt(words.size())).trim();
    }
    return word;
  }

  private void loop() {
    this.welcome();
    String word = this.getWord();
    Boolean endOfGame = false;
    int falseAttempts = 0;
    String guesses = "";
    while (!endOfGame) {
      TestResult test = (new TestResult(word, guesses));
      System.out.println(test.getResult());
      if (test.getIncorrect() == 0) {
        endOfGame = true;
        System.out.println("You won!");
      }
      else {
        System.out.println("Guess a character: ");
        BufferedReader reader = new BufferedReader(
          new InputStreamReader(System.in));
        String guess = "";
        try { guess = reader.readLine().toLowerCase(); }
        catch(IOException ex) {
          System.out.println(ex.toString());
        }
        if (guess.length() != 1) {
          System.out.println("Type a single character only! Try again...");
        }
        else if (!Character.isLetter(guess.charAt(0))) {
          System.out.println("Type a alphabetic character! Try again...");
        }
        else if (guesses.contains(guess)) {
          System.out.println("You already guessed this character! Try again...");
        }
        else {
          guesses += guess;
          if (!word.contains(guess)) {
            falseAttempts++;
            System.out.println("Wrong.");
            if (falseAttempts == 1) {
              System.out.println("You have one false attempt.");
            }
            else {
              System.out.println("You have " + falseAttempts + " false attempts.");
            }
            if (falseAttempts > maxFalseAttempts) {
              endOfGame = true;
              System.out.println("You lost!");
              System.out.println("The secret word has been " + word.toUpperCase());
            }
          }
        }
      }
    }
  }

  private void menuloop() {
    Boolean keepPlaying = true;
    while(keepPlaying) {
      this.loop();
      keepPlaying = this.playAgain();
    }
    System.out.println("Bye.");
  }

  public static void main(String[] args) {
    (new Hangman()).menuloop();
  }
}
