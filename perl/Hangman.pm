package Hangman;
=begin comment

  Copyright (c) 2021, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.

  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.

=end comment
=cut

use strict;
use warnings;
use feature 'say';
use experimental 'smartmatch';

sub new {
  my ($class,$args) = @_;
  my $self = bless {
    _maxFalseAttempts => 5
  }, $class;
  return $self;
}

sub welcome {
  my $self = shift;
  say "Guess my secret word with a maximum of " . $self->{_maxFalseAttempts} . " false attempts.";
}

sub playAgain {
  my @yes = ( "y", "yes", "sure" );
  my @no = ( "n", "no", "nope" );
  my $isYes = undef;
  my $isNo = undef;
  while (!$isYes && !$isNo) {
    say 'Play again? ';
    my $answer = lc <STDIN>;
    chomp $answer;
    
    $isYes = $answer ~~ @yes;
    $isNo = $answer ~~ @no;
    if (!$isYes && !$isNo) {
      say 'Sorry? Please answer with yes or no...';
    }
  }
  return $isYes;
}

sub getWord {
  my $self = shift;

  my $filename = "dict_en.txt";

  open my $filehandle, '<', $filename;
  chomp(my @words = <$filehandle>);
  close($filehandle);

  # say $#words;
  my $word = "";
  while( $word eq "" ) {
    $word = $words[rand @words];
    chomp $word;
  }

  return $word;
}

sub getResult {
  my ( $self, $word, $guesses ) = @_;
  my $result = "";
  my $incorrect = 0;
  my $char;
  foreach $char (split //, $word) {
    if (index( $guesses, $char ) != -1) {
      $result .= $char;
    }
    else {
      $result .= "_";
      ++$incorrect;
    }
  }
  return ( $result, $incorrect );
}

sub loop {
  my $self = shift;
  
  my $endOfGame = undef;
  my $falseAttempts = 0;
  my $word = $self->getWord;
  my $guesses = "";
  $self->welcome;
  while (!$endOfGame) {
    my ( $result, $incorrect ) = $self->getResult( $word, $guesses );
    say $result;
    if ( $incorrect == 0 ) {
      $endOfGame = "true";
      say 'You won!'
    }
    else {
      say 'Guess a character: ';
      my $guess = lc <STDIN>;
      chomp $guess;
      if (length $guess != 1) {
        say 'Type a single character only! Try again...';
      }
      elsif ($guess lt "a" or $guess gt "z" ) {
        say 'Type a alphabetic character! Try again...';
      }
      elsif (index( $guesses, $guess ) != -1) {
        say 'You already guessed this character! Try again...';
      }
      else {
        $guesses .= $guess;
        if (index( $word, $guess) == -1) {
          ++$falseAttempts;
          say 'Wrong.';
          if ( $falseAttempts == 1 ) {
            say 'You have one false attempt.';
          }
          else {
            say 'You have ' . $falseAttempts . ' false attempts.';
          }
          if ( $falseAttempts > $self->{_maxFalseAttempts} ) {
            $endOfGame = "true";
            say 'You lost!';
            say 'The secret word has been ' . uc $word;
          }
        }
      }
    }
  }
  say $word;
}

sub run {
  my $self = shift;
  my $keepPlaying = "true";
  while ($keepPlaying) {
    $self->loop;
    $keepPlaying = $self->playAgain;
  }
  say 'Bye.';
}

1;
