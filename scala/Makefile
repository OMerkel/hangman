source = Hangman.scala

all: run

Hangman.class: $(source)
	scalac $(source)

run: Hangman.class
	scala Hangman

clean:
	rm -rf *.class *.tasty
