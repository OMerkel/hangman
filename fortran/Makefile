source = hangman.f90
all: run

clean:
	rm -f hangman

run: hangman
	./hangman

hangman: $(source)
	gfortran -std=f95 -Wextra -Wall -fall-intrinsics -pedantic -fbounds-check -ffree-form -Wintrinsics-std $(source) -o hangman
