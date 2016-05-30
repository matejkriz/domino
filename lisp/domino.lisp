(defparameter *input-file* (open "../input.txt"))

;;; get first/left value of tile
(defun get-i (tile)
  (car tile)
)

;;; get second/right value of tile
(defun get-j (tile)
  (cadr tile)
)

(defun flip-tile (tile)
  (reverse tile)
)

(defun could-follow (previous-tile next-tile)
  (or (equalp (get-j previous-tile) (get-i next-tile))
      (equalp (get-j previous-tile) (get-j next-tile))
      )
  )

(defun append-next (partial next-tile)
  (if (equalp (get-j (car (last partial))) (get-i next-tile))
    (append partial (list next-tile))
    (append partial (list (flip-tile next-tile)))
  )
)

(defun check-length (solution distance)
  (let ((deviation (- (length solution) distance)))
    (and (>= deviation 0) (= (rem deviation 2) 0))
  )
)

(defun print-tile-series (series)
  (if (= (length series) 1)
    (format nil "(~D,~D)"
            (caar series)
            (cadar series)
    )
    (format nil "(~D,~D) ~D"
            (caar series)
            (caadr series)
            (print-tile-series (cdr series))
    )
  )
)

(defun print-series (series)
  (if (listp series)
    (print-tile-series series)
    series
  )
)

(defun print-solution (game-name solution)
  (format t "Řešení ~D: ~D ~%" game-name (print-series solution))
)

(defun find-next (params partial end name attempt)
  ;;;(format t "find-next ~D ~D ~D ~D ~D~%" params partial end name attempt)
  (if (and (equalp (get-j (car (last partial))) (get-i end))
           (check-length (cdr partial) (car params)))
    (print-solution name (append partial (list end)))
    (if (equalp attempt (cadr params))
      (print-solution name "neexistuje")
      (let ((next-tile (list-from-line)))
        (if (could-follow (car (last partial)) next-tile)
          (find-next params (append-next partial next-tile) end name (+ attempt 1))
          (find-next params partial end name (+ attempt 1))
        )
      )
    )
  )
)

;; get list of two values on one line of input file
(defun list-from-line ()
  (with-input-from-string (stream (read-line *input-file* nil nil))
    (list (read stream) (read stream))
  )
)

(defun process-game (name)
  (find-next (list-from-line) (list (list-from-line)) (list-from-line) name 0)
)

(dotimes (game-name (values (parse-integer (read-line *input-file*))))
         (process-game (+ game-name 1)) ;name of the game by index from 1
         (read-line *input-file* nil nil) ;remove blank line

)
