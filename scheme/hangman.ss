#! /usr/bin/env scheme-script

;; Copyright (c) 2021, Oliver Merkel.
;; Please see the AUTHORS file for details.
;; All rights reserved.
;;
;; Use of this code is governed by a
;; MIT license that can be found in the LICENSE file.

(random-seed (time-nanosecond (current-time)))
(define MAXFALSEATTEMPTS 5)

;; (define strip-return-char
;;         (lambda (a) (string-truncate! a (- (string-length a) 1))))

(define (strip-return-char a)
    (if (eq? (string-ref a (- (string-length a) 1)) #\return)
    (string-truncate! a (- (string-length a) 1))
    a))

(define (welcome)
    (display (string-append "Guess my secret word with a maximum of " (number->string MAXFALSEATTEMPTS) " false attempts.\n")))

(define (play-again)
    (display "Play again? ")
    (set! answer (string-downcase (strip-return-char (get-line (current-input-port)))))
    (set! is-yes (not (equal? (member answer (list "y" "yes" "sure")) #f)))
    (set! is-no (not (equal? (member answer (list "n" "no" "nope")) #f)))
    (if (and (not is-yes) (not is-no))
        (begin
            (display "Sorry? Please answer with yes or no...\n")
            (play-again)))
    is-yes)

(define (read-words file-handler)
    (set! word (get-line file-handler))
    (if (eof-object? word)
        (begin
            (close-input-port file-handler)
            '())
        (cons (strip-return-char word) (read-words file-handler))))

(define (get-word)
    (let ((words (read-words (open-input-file "dict_en.txt"))))
        (list-ref words (random (length words)))))

(define (get-test-result word guesses)
    (let* ((word-list (string->list word))
           (result (list->string (map
               (lambda (c) (if (equal? (member c guesses) #f) #\_ c)) word-list)))
           (incorrect (apply + (map
               (lambda (c) (if (equal? (member c guesses) #f) 1 0)) word-list))))
          (list result incorrect)))

(define (get-single-alphabetic-char guesses)
    (display "Guess a character: ")
    (let ((c (string-downcase (strip-return-char (get-line (current-input-port))))))
        (if (eq? (string-length c) 1)
            (if (equal? (member (string-ref c 0) guesses) #f)
                (if (and (char>=? (string-ref c 0) #\a) (char<=? (string-ref c 0) #\z))
                    c
                    (begin
                        (display "Type a alphabetic character! Try again...\n")
                        (get-single-alphabetic-char guesses)
                    )
                )
                (begin
                    (display "You already guessed this character! Try again...\n")
                    (get-single-alphabetic-char guesses)
                )
            )
            (begin
                (display "Type a single character only! Try again...\n")
                (get-single-alphabetic-char guesses)))))

(define (game-loop word guesses false-attempts)
    (let ((result (get-test-result word guesses)))
        (begin
            (display (car result))
            (newline)
            (if (zero? (cadr result))
                (display "You won!\n")
                (begin
                    (set! c (get-single-alphabetic-char guesses))
                    ;; (display (cons (string-ref c 0) guesses))
                    ;; (newline)
                    (if (equal? (member (string-ref c 0) (string->list word)) #f)
                        (begin
                            (display "Wrong.\n")
                            (if (zero? false-attempts)
                                (display "You have one false attempt.\n")
                                (display (string-append "You have " (number->string (+ 1 false-attempts)) " false attempts.\n")))
                            (if (eq? false-attempts MAXFALSEATTEMPTS)
                                (begin
                                    (display "You lost!\n")
                                    (display (string-append "The secret word has been "
                                        (string-upcase word) "\n")))
                                (game-loop word (cons (string-ref c 0) guesses) (+ 1 false-attempts))))
                        (game-loop word (cons (string-ref c 0) guesses) false-attempts)))))))

(define (game-init)
    (welcome)
    (game-loop (get-word) '() 0))

(define (menu-loop)
    (game-init)
    (if (play-again)
        (menu-loop)
        (display "Bye.\n")))

(menu-loop)
