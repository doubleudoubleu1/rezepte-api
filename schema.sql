-- =====================================================================
--  schema.sql — Rezepte-API, Woche 2 (Aufgabe 2.1)
--  PostgreSQL: Datenmodell für Rezepte und Zutaten
--
--  n:m-Beziehung  rezepte -> rezept_zutaten -> zutaten
--  über die Zwischentabelle rezept_zutaten gelöst:
--    - eine Zutat (z. B. "Mehl") existiert nur EINMAL in zutaten
--    - dieselbe Zutat darf in vielen Rezepten vorkommen
--    - die Menge hängt an der VERKNÜPFUNG (rezept_zutaten.menge),
--      NICHT an der Zutat: "Mehl" hat keine Menge,
--      "Mehl in diesem Rezept" schon ("200 g")
--
--  Alle CREATE TABLE tragen IF NOT EXISTS => Datei mehrfach ausführbar.
--  Reihenfolge: erst rezepte + zutaten, dann rezept_zutaten
--  (die Foreign Keys brauchen ihre Zieltabellen).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) rezepte — das Rezept-Modell aus Woche 1
--    + eigene Spalten: vegetarisch und erstellt_am
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rezepte (
    id          SERIAL       PRIMARY KEY,                -- wird automatisch vergeben
    titel       VARCHAR(255) NOT NULL,
    minuten     INT,
    portionen   INT,
    vegetarisch BOOLEAN      NOT NULL DEFAULT FALSE,
    erstellt_am TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2) zutaten — jede Zutat genau einmal, wird in vielen Rezepten genutzt
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zutaten (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE                    -- "Mehl" gibt es nie doppelt
);

-- ---------------------------------------------------------------------
-- 3) rezept_zutaten — Zwischentabelle, löst die n:m-Beziehung auf
--    Primärschlüssel aus BEIDEN Spalten: dieselbe Zutat kann im
--    selben Rezept nicht zweimal landen.
--    ON DELETE CASCADE: Rezept gelöscht => seine Verknüpfungen
--    verschwinden automatisch, die Zutaten selbst bleiben bestehen.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rezept_zutaten (
    rezept_id INT NOT NULL REFERENCES rezepte (id) ON DELETE CASCADE,
    zutat_id  INT NOT NULL REFERENCES zutaten (id),
    menge     VARCHAR(100),
    PRIMARY KEY (rezept_id, zutat_id)
);

-- =====================================================================
--  Beispieldaten
--  Reihenfolge: erst rezepte + zutaten, DANN die Verknüpfungen
--  (sonst zeigen die Foreign Keys ins Leere).
--  Die ids bei rezepte/zutaten nicht mitgeben — SERIAL vergibt sie.
-- =====================================================================

-- 1) Rezepte: die zwei aus Woche 1 + ein eigenes
INSERT INTO rezepte (titel, minuten, portionen, vegetarisch) VALUES
    ('Spaghetti Carbonara',   20, 2, FALSE),
    ('Linsen-Curry',          35, 4, TRUE),
    ('Omelette mit Zwiebeln', 10, 1, TRUE);              -- eigenes Rezept

-- 2) Zutaten: jede nur einmal!
INSERT INTO zutaten (name) VALUES
    ('Spaghetti'),
    ('Ei'),
    ('Speck'),
    ('Linsen'),
    ('Kokosmilch'),
    ('Zwiebel'),
    ('Milch');

-- 3) Verknüpfungen: welche Zutat (mit welcher Menge) gehört in welches Rezept?
--    ids:  rezepte 1 = Carbonara, 2 = Curry, 3 = Omelette
--          zutaten 1..7 in der Reihenfolge von oben
--    Ei (2) und Zwiebel (6) werden im Omelette WIEDERVERWENDET —
--    genau dafür ist die Zwischentabelle da.
INSERT INTO rezept_zutaten (rezept_id, zutat_id, menge) VALUES
    (1, 1, '200 g'),    -- Carbonara: Spaghetti
    (1, 2, '2 Stück'),  -- Carbonara: Ei
    (1, 3, '100 g'),    -- Carbonara: Speck
    (2, 4, '250 g'),    -- Curry: Linsen
    (2, 5, '400 ml'),   -- Curry: Kokosmilch
    (2, 6, '1 Stück'),  -- Curry: Zwiebel
    (3, 2, '2 Stück'),  -- Omelette: Ei (wiederverwendet)
    (3, 6, '1 Stück'),  -- Omelette: Zwiebel (wiederverwendet)
    (3, 7, '50 ml');    -- Omelette: Milch
