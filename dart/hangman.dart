import 'dart:io';
import 'dart:convert';
import 'dart:math';

String getWord() {
  var rand = Random();
  var file = File('dict_en.txt');
  var words = file.readAsStringSync(encoding: ascii).split('\n');
  var word = '';
  while (word.isEmpty) {
    word = words[rand.nextInt(words.length)].trim();
  }
  return word;
}

Map<Object, Object> getResult(word, guesses) {
  var result = '';
  var incorrect = 0;
  for (var rune in word.runes.toList()) {
    var char=new String.fromCharCode(rune);
    if (guesses.contains(char.toLowerCase())) {
      result += char;
    }
    else {
      result += '_';
      incorrect++;
    }
  };
  return { 'result': result, 'incorrect': incorrect };
}

bool isalpha(c) {
  return 'abcdefghijklmnopqrstuvwxyz'.contains(c.toLowerCase());
}

void main() {
  var maxFalseAttempts = 5;
  var falseAttempts = 0;
  var endOfGame = false;
  var word = getWord();
  var guesses = '';
  print('Guess my secret word with a maximum' +
    'of ${maxFalseAttempts} false attempts.');
  while (!endOfGame) {
    var test = getResult(word, guesses);
    print(test['result']);
    if (test['incorrect'] == 0) {
      endOfGame = true;
      print('You won!');
    }
    else{
      print('Guess a character: ');
      var guess = stdin.readLineSync().toLowerCase();
      if (guess.length != 1) {
        print('Type a single character only! Try again...');
        continue;
      }
      if (!isalpha(guess)) {
        print('Type a alphabetic character! Try again...');
        continue;
      }
      if (guesses.contains(guess)) {
        print('You already guessed this character! Try again...');
        continue;
      }
      guesses += guess;
      if (!word.contains(guess)) {
        falseAttempts++;
        print('Wrong.');
        if (falseAttempts == 1) {
          print('You have one false attempt.');
        }
        else {
          print('You have ${falseAttempts} false attempts.');
        }
        if (falseAttempts > maxFalseAttempts) {
          endOfGame = true;
          print('You lost!');
          print('The secret word has been ' + word.toUpperCase());
        }
      }
    }
  }
}
