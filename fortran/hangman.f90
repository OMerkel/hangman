
!! Copyright (c) 2021, Oliver Merkel.
!! Please see the AUTHORS file for details.
!! All rights reserved.
!!
!! Use of this code is governed by a
!! MIT license that can be found in the LICENSE file.

!Hangman
program Hangman
  implicit none
  integer :: maxFalseAttempts = 5
  character(len=50) :: word ! maximum word length supposed to be 50
  logical :: keepPlaying = .TRUE.
  call random_seed()

  do while( keepPlaying )
    call loop
    keepPlaying = playAgain()
  end do
  print '(A)', "Bye."

contains

  function toLower( s )
    implicit none
    character(*), intent(in) :: s
    character(len(s)) :: toLower
    integer :: i, idx
    character(26) :: upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    character(26) :: lower = 'abcdefghijklmnopqrstuvwxyz'
    toLower=s
    do i=1,len_trim(s)
      idx=index(upper,s(i:i))
      if (idx > 0) toLower(i:i) = lower(idx:idx)
    end do
  end function toLower

  function toUpper( s )
    implicit none
    character(*), intent(in) :: s
    character(len(s)) :: toUpper
    integer :: i, idx
    character(26) :: upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    character(26) :: lower = 'abcdefghijklmnopqrstuvwxyz'
    toUpper=s
    do i=1,len_trim(s)
      idx=index(lower,s(i:i))
      if (idx > 0) toUpper(i:i) = upper(idx:idx)
    end do
  end function toUpper

  function isCharAlpha( c )
    implicit none
    character(*), intent(in) :: c
    logical :: isCharAlpha
    character(26) :: alphabet = 'abcdefghijklmnopqrstuvwxyz'
    isCharAlpha = index(alphabet,trim(c)) /= 0
  end function isCharAlpha

  subroutine welcome
    print '(A,I1,A)', "Guess my secret word with a maximum of ", maxFalseAttempts, " false attempts."
  end subroutine welcome

  function playAgain()
    character(len=5) :: y1,y2,y3,n1,n2,n3
    logical :: playAgain
    logical :: isYes = .FALSE.
    logical :: isNo = .FALSE.
    character(len=10) :: answer = ""
    y1="y"
    y2="yes"
    y3="sure"
    n1="n"
    n2="no"
    n3="nope"
    isYes=.FALSE.
    isNo=.FALSE.
    do while ( .NOT. isYes .AND. .NOT. isNo )
      print '(A)', "Play again? "
      read (*,*) answer
      answer=toLower(answer)
      isYes = answer == y1 .OR. answer == y2 .OR. answer == y3
      isNo = answer == n1 .OR. answer == n2 .OR. answer == n3
      if ( .NOT. isYes .AND. .NOT. isNo ) then
        print '(A)', "Sorry? Please answer with yes or no..."
      end if
    end do
    playAgain = isYes
  end function playAgain

  function getWord()
    real :: r
    integer, parameter :: read_unit = 99
    integer :: n
    integer :: ios
    character(len=50) :: words(1000) ! maximum amount of words is 1000 here
    character(len=50) :: getWord

    open(unit=read_unit, file='dict_en.txt', iostat=ios)
    if ( ios /= 0 ) stop "Error opening dictionary file."
    n = 0
    do
      read(read_unit, '(A)', iostat=ios) words(n+1)
      if (ios /= 0) exit
      n = n + 1
    end do
    close(read_unit)

    call random_number(r)
    getWord = trim(words(INT(r * n)))
  end function getWord

  subroutine getResult(word, guesses, testResult, testIncorrect)
    character(len=50), intent(in) :: word
    character(len=30), intent(in) :: guesses
    character(len=50), intent(out) :: testResult
    integer, intent(out) :: testIncorrect
    integer :: i
    testResult=""
    testIncorrect=0
    do i = 1,len_trim(word)
      if (index(guesses, toLower(word(i:i))) /= 0) then
        testResult = trim(testResult)//word(i:i)
      else
        testResult = trim(testResult)//"_"
        testIncorrect = testIncorrect + 1
      end if
    end do
  end subroutine getResult

  subroutine loop
    integer :: falseAttempts = 0
    logical :: endOfGame = .FALSE.
    character(len=30) :: guesses = ""
    character(len=50) :: testResult = ""
    integer :: testIncorrect = 0
    character(len=10) :: guess = ""
    call welcome
    word = getWord()
    falseAttempts = 0
    endOfGame = .FALSE.
    guesses = ""
    do while( .NOT. endOfGame )
      testResult = ""
      testIncorrect = 0
      call getResult(word, guesses, testResult, testIncorrect)
      print '(A)', testResult
      if (testIncorrect == 0) then
        endOfGame = .TRUE.
        print '(A)', "You won!"
      else
        print '(A)', "Guess a character: "
        read (*,*) guess
        guess = toLower(guess)
        if (len_trim(guess) /= 1) then
          print '(A)', "Type a single character only! Try again..."
        else if (.NOT. isCharAlpha(guess)) then
          print '(A)', "Type a alphabetic character! Try again..."
        else if (index(guesses, trim(guess)) /= 0) then
          print '(A)', "You already guessed this character! Try again..."
        else
          guesses = trim(guesses)//guess
          if(index(word, trim(guess))==0) then
            falseAttempts = falseAttempts + 1
            print '(A)', "Wrong."
            if (falseAttempts == 1) then
              print '(A)', "You have one false attempt."
            else
              print '(A,I1,A)', "You have ", falseAttempts, " false attempts."
            end if
            if (falseAttempts > maxFalseAttempts) then
              endOfGame = .TRUE.
              print '(A)', "You lost!"
              print '(A)', "The secret word has been "//toUpper(trim(word))
            end if
          end if
        end if
      end if
    end do
  end subroutine loop

end program Hangman
