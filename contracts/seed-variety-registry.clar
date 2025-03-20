;; Seed Variety Registry Contract
;; Records details of available plant varieties

(define-data-var next-seed-id uint u0)

(define-map seed-varieties
  { seed-id: uint }
  {
    name: (string-utf8 100),
    species: (string-utf8 100),
    family: (string-utf8 100),
    description: (string-utf8 500),
    days-to-maturity: uint,
    planting-season: (string-utf8 50),
    registered-by: principal,
    registration-time: uint
  }
)

(define-public (register-seed-variety
    (name (string-utf8 100))
    (species (string-utf8 100))
    (family (string-utf8 100))
    (description (string-utf8 500))
    (days-to-maturity uint)
    (planting-season (string-utf8 50)))
  (let ((seed-id (var-get next-seed-id)))
    (map-set seed-varieties
      { seed-id: seed-id }
      {
        name: name,
        species: species,
        family: family,
        description: description,
        days-to-maturity: days-to-maturity,
        planting-season: planting-season,
        registered-by: tx-sender,
        registration-time: block-height
      }
    )
    (var-set next-seed-id (+ seed-id u1))
    (ok seed-id)
  )
)

(define-read-only (get-seed-variety (seed-id uint))
  (map-get? seed-varieties { seed-id: seed-id })
)

(define-read-only (get-next-seed-id)
  (var-get next-seed-id)
)

