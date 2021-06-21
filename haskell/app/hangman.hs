{-|
  Copyright (c) 2019, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.
 
  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.
-}

import Data.Char     (toLower)
import Data.Char     (toUpper)
import System.Random (randomRIO)
import System.IO

fileName :: FilePath
fileName = "dict_en.txt"

maxFalseAttempts = 5 :: Int

data GameState = GameState
    { word    :: String
    , guesses :: String
    , falseAttempts :: Int
    }

data TestResult = TestResult
    { result :: String
    , incorrect :: Int
    }

welcome :: IO ()
welcome = putStrLn $ "Guess my secret word with a maximum of " ++ show maxFalseAttempts ++ " false attempts."

getWord :: IO String
getWord = do
    contents <- readFile fileName
    let words = lines contents
    idx <- randomRIO (0 :: Int, (length words) - 1 )
    let word = map toLower (words !! idx )
    return word

getTestResult :: GameState -> TestResult
getTestResult gameState = do
    let result' = map visibility (word gameState)
    let incorrect' = length $ filter isHidden result'
    TestResult result' incorrect'
    where
        visibility c
            | c `elem` (guesses gameState) = c
            | otherwise = '_'
        isHidden c = c == '_'

getSingleChar :: IO Char
getSingleChar = do
    line <- getLine
    case line of
        [] -> getSingleChar
        (c:_) -> return c

getNextChar :: String -> IO Char
getNextChar guesses' = do
    putStrLn "Guess a character: "
    c <- getSingleChar
    if c `elem` guesses'
    then do
        putStrLn "You already guessed this character! Try again..."
        getNextChar guesses'
    else
        return c

playAgain :: IO Bool
playAgain = do
    putStrLn "Play again? (y/n):"
    answer <- getSingleChar
    return (answer == 'y')

gameInit :: IO GameState
gameInit = do
    welcome
    word <- getWord
    let guesses' = ""
    let falseAttempts' = 0
    return $ GameState word guesses' falseAttempts'

gameLoop :: GameState -> IO ()
gameLoop gameState = do
    let test = getTestResult gameState
    putStrLn (result test)
    if (incorrect test) == 0 then
        putStrLn "You won!"
    else do
        c <- getNextChar (guesses gameState)
        falseAttempts' <- if (c `notElem` (word gameState)) then do
                putStrLn "Wrong."
                if (falseAttempts gameState) == 0 then
                    putStrLn "You have one false attempt."
                else
                    putStrLn $ "You have " ++ show ((falseAttempts gameState) + 1) ++ " false attempts."
                return ((falseAttempts gameState) + 1)
            else
                return (falseAttempts gameState)
        let endOfGame' = (c `notElem` (word gameState)) && falseAttempts' > maxFalseAttempts
        if endOfGame' then do
            putStrLn "You lost!"
            putStrLn $ "The secret word has been " ++ map toUpper (word gameState)
        else
            gameLoop $ gameState { guesses = guesses gameState ++ [c],
                falseAttempts = falseAttempts'}

mainLoop :: IO ()
mainLoop = do
    hSetBuffering stdin NoBuffering
    hSetBuffering stdout NoBuffering
    gameInit >>= gameLoop
    keepPlaying <- playAgain
    if keepPlaying then mainLoop else putStrLn "Bye."

main :: IO ()
main = mainLoop
