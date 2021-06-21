
# Hangman in Haskell

This Hangman implementation has been developed on Glasgow Haskell Compiler.

## Glasgow Haskell Compiler

For building and running the hangman.hs the Cabal build system is recommended.
If Cabal does not come included in your Glasgow Haskell Compiler you should get that first.

```
$ ghc --version
The Glorious Glasgow Haskell Compilation System, version 9.0.1

$ cabal --version
cabal-install version 3.4.0.0
compiled using version 3.4.0.0 of the Cabal library
```

As you can see in hangman.cabal the implementation depends on System.Random module. Current ghc versions do not come with System.Random preinstalled.
To get System.random simply run...

```
$ cabal install --lib random
```

## Build and Run

```
$ cabal run
Resolving dependencies...
Build profile: -w ghc-9.0.1 -O1
In order, the following will be built (use -v for more details):
 - hangman-1.0.0 (exe:hangman) (configuration changed)
Configuring executable 'hangman' for hangman-1.0.0..
Preprocessing executable 'hangman' for hangman-1.0.0..
Building executable 'hangman' for hangman-1.0.0..
[1 of 1] Compiling Main             ( app\hangman.hs, haskell\dist-newstyle\build\x86_64-windows\ghc-9.0.1\hangman-1.0.0\x\hangman\build\hangman\hangman-tmp\Main.o )
Linking haskell\dist-newstyle\build\x86_64-windows\ghc-9.0.1\hangman-1.0.0\x\hangman\build\hangman\hangman.exe ...
Guess my secret word with a maximum of 5 false attempts.
_______
Guess a character:
```
