# Hangman in Chez Scheme

Here the _Revised<sup>6</sup> Report on the Algorithmic Language Scheme_ (abbreviated R6RS) is used.
In a more general form the term RnRS is used, too, whereas n represents a maturity level of the standard. Higher n means newer standard.

_IEEE 1178-1990 - IEEE Standard for the Scheme Programming Language_ is an old outdated Scheme language standard.

## Usage

```
D:\>scheme --version
9.5.4

D:\>scheme --script hangman.ss
Guess my secret word with a maximum of 5 false attempts.
________
Guess a character:
```

## Compile

You can run Hangman as a script as shown before. Chez Scheme offers to pre-compile the script, too, to speed up loading and starting the implementation a bit.

```
D:\>echo (compile-file "hangman") | scheme -q
compiling hangman.ss with output to hangman.so

D:\>
```

As a result there is now a pre-compiled binary _hangman.so_

This shared object file will now be preferred when using the script. See according section in the Chez Scheme User Guide (csug).

## Links

* https://github.com/cisco/ChezScheme
* https://cisco.github.io/ChezScheme
* http://cisco.github.io/ChezScheme/csug9.5/csug.html
* http://community.schemewiki.org/?RnRS
* http://community.schemewiki.org/?r6rs
