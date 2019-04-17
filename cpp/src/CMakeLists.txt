cmake_minimum_required (VERSION 3.5.1)
project (hangman)
add_executable(hangman hangman.cc)
install (FILES dict_en.txt DESTINATION / )
