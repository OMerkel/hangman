--[[
  Copyright (c) 2021, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.

  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.
]]

math.randomseed( tonumber(tostring(os.time()):reverse():sub(1,6)) )

local function contains( table, val )
  for index, value in ipairs(table) do
    if value == val then
      return true
    end
  end
  return false
end

function welcome( maxFalseAttempts )
  print('Guess my secret word with a maximum of ' ..
    maxFalseAttempts .. ' false attempts.')
end

function playAgain()
  local yes = { 'y', 'yes', 'sure' }
  local no = { 'n', 'no', 'nope' }
  local isYes = false
  local isNo = false
  while not isYes and not isNo do
    print('Play again?')
    local answer = string.lower(io.read())
    isYes = contains(yes, answer)
    isNo = contains(no, answer)
    if not isYes and not isNo then
      print('Sorry? Please answer with yes or no...')
    end
  end
  return isYes
end

function getWord()
  local words = {}
  for line in io.lines("dict_en.txt") do
    words[#words + 1] = line
  end
  return words[math.random(#words)]
end

function getResult( word, guesses )
  local ret = {}
  local result = ''
  local incorrect = 0
  for char in word:gmatch"." do
    if string.match(guesses, string.lower(char)) then
      result = result .. char
    else
      result = result .. '_'
      incorrect = incorrect + 1
    end
  end
  ret[ 'result' ] = result
  ret[ 'incorrect' ] = incorrect
  return ret
end

function loop()
  local endOfGame = false
  local maxFalseAttempts = 5
  local falseAttempts = 0
  local word = getWord()
  local guesses = ''
  welcome( maxFalseAttempts )
  while not endOfGame do
    local test = getResult(word, guesses)
    print(test['result'])
    if test['incorrect'] == 0 then
      endOfGame = true
      print('You won!')
    else
      print('Guess a character: ')
      local guess = string.lower(io.read())
      if #guess ~= 1 then
        print('Type a single character only! Try again...')
      elseif guess < "a" or guess > "z" then
        print('Type a alphabetic character! Try again...')
      elseif string.match(guesses, guess) then
        print('You already guessed this character! Try again...')
      else
        guesses = guesses .. guess
        if not string.match(word, guess) then
          falseAttempts = falseAttempts + 1
          print('Wrong.')
          if falseAttempts == 1 then
            print('You have one false attempt.')
          else
            print('You have ' .. falseAttempts .. ' false attempts.')
          end
          if falseAttempts > maxFalseAttempts then
            endOfGame = true
            print('You lost!')
            print('The secret word has been ' .. string.upper(word))
          end
        end
      end
    end
  end
end

local keepPlaying = true
while keepPlaying do
  loop()
  keepPlaying = playAgain()
end
print('Bye.')
