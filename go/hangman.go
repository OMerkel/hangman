// Copyright (c) 2021, Oliver Merkel.
// Please see the AUTHORS file for details.
// All rights reserved.
//
// Use of this code is governed by a
// MIT license that can be found in the LICENSE file.

package main

import (
  "bufio"
  "fmt"
  "os"
  "log"
  "strings"
  "math/rand"
  "time"
  "strconv"
  "unicode"
)

func contains(slice []string, item string) bool {
  for _, s := range slice {
    if s == item {
      return true
    }
  }
  return false
}

func readLines(path string) ([]string, error) {
  file, err := os.Open(path)
  if err != nil {
    return nil, err
  }
  defer file.Close()

  var lines []string
  scanner := bufio.NewScanner(file)
  for scanner.Scan() {
    lines = append(lines, scanner.Text())
  }
  return lines, scanner.Err()
}

func welcome(maxFalseAttempts int) {
  fmt.Println("Guess my secret word with a maximum of " +
    strconv.Itoa(maxFalseAttempts) + " false attempts.")
}

func playAgain() bool {
  yes := []string { "y", "yes", "sure" }
  no := []string { "n", "no", "nope" }
  isYes := false
  isNo := false
  for (!isYes && !isNo) {
    fmt.Println("Play again? ")
    reader := bufio.NewReader(os.Stdin)
    answer, _ := reader.ReadString('\n')
    answer = strings.ToLower(strings.TrimSpace(answer))
    isYes = contains(yes, answer)
    isNo = contains(no, answer)
    if (!isYes && !isNo) {
      fmt.Println("Sorry? Please answer with yes or no...")
    }
  }
  return isYes
}

func getWord() string {
  words, err := readLines("dict_en.txt")
  if err != nil {
    log.Fatalf("readLines: %s", err)
  }
  word := words[rand.Intn(len(words))]
  return word
}

func getResult(word string, guesses string) (string, int) {
  result := ""
  incorrect := 0
  for _, ch := range word {
    if strings.Contains(guesses, strings.ToLower(string(ch))) {
      result = result + string(ch)
    } else {
      result += "_"
      incorrect += 1
    }
  }
  return result, incorrect
}

func loop() {
  endOfGame := false
  maxFalseAttempts := 5
  falseAttempts := 0
  word := getWord()
  guesses := ""
  welcome(maxFalseAttempts)
  for (!endOfGame) {
    result, incorrect := getResult(word, guesses)
    fmt.Println(result)
    if (incorrect == 0) {
      endOfGame = true
      fmt.Println("You won!")
    } else {
      fmt.Println("Guess a character: ")
      reader := bufio.NewReader(os.Stdin)
      guess, _ := reader.ReadString('\n')
      guess = strings.ToLower(strings.TrimSpace(guess))
      if len(guess) != 1 {
        fmt.Println("Type a single character only! Try again...")
      } else if !unicode.IsLetter(rune(guess[0])) {
        fmt.Println("Type a alphabetic character! Try again...")
      } else if strings.Contains(guesses, guess) {
        fmt.Println("You already guessed this character! Try again...")
      } else {
        guesses += guess
        if !strings.Contains(word, guess) {
          falseAttempts += 1
          fmt.Println("Wrong.")
          if falseAttempts == 1 {
            fmt.Println("You have one false attempt.")
          } else {
            fmt.Println("You have " + strconv.Itoa(falseAttempts) + " false attempts.")
          }
          if falseAttempts > maxFalseAttempts {
            endOfGame = true;
            fmt.Println("You lost!")
            fmt.Println("The secret word has been " + strings.ToUpper(word))
          }
        }
      }
    }
  }
}

func main() {
  rand.Seed(time.Now().UTC().UnixNano())
  keepPlaying := true
  for (keepPlaying) {
    loop()
    keepPlaying = playAgain()
  }
  fmt.Println("Bye.")
}
