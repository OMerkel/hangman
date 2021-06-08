
;; Copyright (c) 2021, Oliver Merkel.
;; Please see the AUTHORS file for details.
;; All rights reserved.
;;
;; Use of this code is governed by a
;; MIT license that can be found in the LICENSE file.

(defvar MAXFALSEATTEMPTS 5)
(defvar FILENAME "dict_en.txt")

(defun welcome ()
  (princ-list "Guess my secret word with a maximum of " MAXFALSEATTEMPTS " false attempts."))

(defun play-again ()
  (y-or-n-p "Play again?"))

(defun get-word ()
  (defvar words '("action" "content"))
  (setq words (with-temp-buffer
    (insert-file-contents FILENAME)
    (split-string (buffer-string) "\n" t)))
  (progn (nth (random (length words)) words)))

(defun get-test-result (word guesses)
  (defvar incorrect 0)
  (defvar result "")
  (setq incorrect 0
        result (mapconcat 'identity
                          (mapcar
                           (lambda (c)
                             (if (string-match (char-to-string c) guesses)
                                 (progn (char-to-string c))
                               (progn
                                 (setq incorrect (+ incorrect 1))
                                 (progn "_")))) word) ""))
  (list result incorrect))

(defun game-loop ()
  (welcome)
  (defvar word "secret")
  (defvar end-of-game nil)
  (defvar false-attempts 0)
  (defvar guesses "")
  (defvar guess "")
  (setq word (get-word)
        end-of-game nil
        false-attempts 0
        guesses ""
        guess "")
  (while (not end-of-game)
    (setq result (get-test-result word guesses))
    (princ-list (car result))
    (if (equal (nth 1 result) 0)
        (progn
          (setq end-of-game t)
          (princ "You won!\n")
          )
      (progn
        (setq guess (downcase (read-string "Guess a character: ")))
        ;; (print guesses)
        (if (not (equal (length guess) 1))
            (princ "Type a single character only! Try again...\n")
          (if (not (string-match "[a-z]" guess))
              (princ "Type a alphabetic character! Try again...\n")
            (if (string-match guess guesses)
                (princ "You already guessed this character! Try again...\n")
              (progn
                (setq guesses (concat guesses guess))
                (if (not (string-match guess word))
                    (progn
                      (setq false-attempts (+ false-attempts 1))
                      (princ "Wrong.\n")
                      (if (equal false-attempts 1)
                          (princ "You have one false attempt.\n")
                        (princ-list "You have " false-attempts " false attempts.")
                        )
                      (if (> false-attempts MAXFALSEATTEMPTS)
                          (progn
                            (setq end-of-game t)
                            (princ "You lost!\n")
                            (princ-list "The secret word has been "
                                        (upcase word))
                            ))
                      )))
              )))
        ))))

(defun menu-loop ()
  (defvar keep-playing t)
  (while keep-playing
    (game-loop)
    (setq keep-playing (play-again)))
  (princ "Bye."))

(menu-loop)
