#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <algorithm>
#include <string>
#include <ctime>

using namespace std;

class Game
{
private:
  static const int maxFalseAttempts = 5;

  string getWord(const char* file);
  string renderResult(string word, string guesses);
public:
  void loop();
};

string Game::getWord(const char* file)
{
  ifstream wordFile(file);
  string word;
  int wordCount=0;
  while (getline(wordFile, word)) ++wordCount;
  int index = rand() % wordCount;
  wordFile.clear();
  wordFile.seekg(0, ios::beg);
  for (int n=0; getline(wordFile, word) && n<index; ++n);
  return word;
}

void Game::loop()
{
  const char* file = "dict_en.txt";
  string word = getWord(file);
  string guesses = "";
  int falseAttempts = 0;
  bool endOfGame = false;
  while(!endOfGame)
  {
    string result = renderResult(word, guesses);
    cout << result << endl;
    if(result == word)
    {
      endOfGame = true;
      cout << "You won!" << endl;
    }
    else
    {
      string guess;
      cout << "Guess a character: ";
      cin >> guess;
      if (guess.size() != 1)
      {
        cout << "Type a single character only! Try again..." << endl;
      }
      else if (!isalpha(guess[0]))
      {
        cout << "Type a alphabetic character! Try again..." << endl;
      }
      else if (guesses.find(tolower(guess[0])) != string::npos)
      {
        cout << "You already guessed this character! Try again..." << endl;
      }
      else
      {
        guesses += tolower(guess[0]);
        if (word.find(tolower(guess[0])) == string::npos)
        {
          ++falseAttempts;
          cout << "Wrong." << endl;
          if (1 == falseAttempts)
          {
            cout << "You have one false attempt." << endl;
          }
          else
          {
            cout << "You have " << falseAttempts << " false attempts." << endl;
          }
          if (falseAttempts > maxFalseAttempts)
          {
            endOfGame = true;
            cout << "You lost!" << endl;
            string upperWord = word;
            std::transform(upperWord.begin(), upperWord.end(),
              upperWord.begin(), ::toupper);
            cout << "The secret word has been " << upperWord << endl;
          }
        }
      }
    }
  }
}

string Game::renderResult(string word, string guesses)
{
  string result = "";
  for(unsigned int n=0; n<word.size(); ++n) result+= '_';
  for(unsigned int i=0; i<guesses.size(); ++i)
    for(unsigned int n=0; n<word.size(); ++n)
      if (guesses[i]==word[n]) result[n] = word[n];
  return result;
}

int main (int argc, const char * argv[])
{
  srand((unsigned)time(NULL));
  Game game;
  game.loop();
  return 0;
}
