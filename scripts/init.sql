/*
Ryan Test:

docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=secret -p 3307:3306 -d mysql
docker exec -i mysql-test mysql -u root -psecret < init.sql
*/

CREATE DATABASE IF NOT EXISTS restaurant_planner_app;

USE restaurant_planner_app;

CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(128),
    email VARCHAR(255),
    firstname VARCHAR(35),
    lastname VARCHAR(35),
    PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS events (
    event_id BIGINT AUTO_INCREMENT, 
    event_name VARCHAR(50) NOT NULL, 
    event_description VARCHAR(500) NOT NULL, 
    host_id VARCHAR(128),  
    duration INT DEFAULT 60,
    -- datetime_created VARCHAR(50),
    PRIMARY KEY(event_id),
    FOREIGN KEY (host_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
    place_id VARCHAR(128),
    name VARCHAR(50),
    address VARCHAR(100),
    rating FLOAT,
    position VARCHAR(100),
    -- opening_hours VARCHAR(100),
    PRIMARY KEY(place_id)
);

CREATE TABLE IF NOT EXISTS participants (
    event_id BIGINT,
    uid VARCHAR(128),
    PRIMARY KEY(event_id, uid),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS time_candidates (
    time_candidates_id BIGINT AUTO_INCREMENT,
    event_id BIGINT,
    -- timeslot VARCHAR(128),
    date VARCHAR(50),
    time VARCHAR(50),
    proposer_uid VARCHAR(128),
    PRIMARY KEY(time_candidates_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (proposer_uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT unique_time_candidates UNIQUE (event_id, date, time)
);

CREATE TABLE IF NOT EXISTS time_votes (
    time_candidates_id BIGINT, uid VARCHAR(128),
    PRIMARY KEY(time_candidates_id, uid),
    FOREIGN KEY (time_candidates_id) REFERENCES time_candidates(time_candidates_id) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS place_candidates (
    place_candidates_id BIGINT AUTO_INCREMENT,
    event_id BIGINT, 
    place_id VARCHAR(128),
    proposer_uid VARCHAR(128),
    PRIMARY KEY(place_candidates_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES restaurants(place_id) ON DELETE CASCADE,
    FOREIGN KEY (proposer_uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT unique_place_candidates UNIQUE (event_id, place_id)
);

CREATE TABLE IF NOT EXISTS place_votes (
    place_candidates_id BIGINT,
    uid VARCHAR(128),
    PRIMARY KEY(place_candidates_id, uid),
    FOREIGN KEY (place_candidates_id) REFERENCES place_candidates(place_candidates_id) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
); 




/* test data */
-- INSERT INTO users (uid, email, firstname, lastname) VALUES ("uid1", "test1@test.com", "test_first_name", "test_last_name");
-- INSERT INTO users (uid, email, firstname, lastname) VALUES ("uid2", "test2@test.com", "test_first_name2", "test_last_name2");

-- INSERT INTO restaurants (place_id, name, address, rating) VALUES ("place_id1", "test_restaurant_name", "test_restaurant_address", 4.5 );
-- INSERT INTO restaurants (place_id, name, address, rating) VALUES ("place_id2", "test_restaurant_name2", "test_restaurant_address2", 4.0);
-- INSERT INTO participants (event_id, uid) VALUES (1, "uid1");
-- INSERT INTO time_candidates (time_candidates_id, event_id, timeslot) VALUES (1, 1, "7PM to 8PM");
-- INSERT INTO place_candidates (place_candidates_id, event_id, place_id) VALUES (1, 1, "place_id1");
-- INSERT INTO place_candidates (place_candidates_id, event_id, place_id) VALUES (2, 1, "place_id2");


-- users
INSERT INTO users (uid, email, firstname, lastname) VALUES ("mqxs32thwFct3Mf62RdjqqJHgs32", "test@niback.com", "Kade", "Fulton");
INSERT INTO users (uid, email, firstname, lastname) VALUES ("oAxwJgo0I0PA8oSMJzOYh811Ek32", "kivinej210@niback.com", "Kivine", "Johnson");

INSERT INTO users (uid, email, firstname, lastname) VALUES ("Cyo2ejbZlDM8kr1KzZ1apL3HWhF3", "test2@niback.com", "Keith", "Curry");
INSERT INTO users (uid, email, firstname, lastname) VALUES ("VqQt4hTjGzUFF1IDL51FWe75YW13", "test3@niback.com", "Lucas", "Vincent");
INSERT INTO users (uid, email, firstname, lastname) VALUES ("RBgWbQ5QxINWK6Zb3zfAluoMpbM2", "test4@niback.com", "Katerina", "Finley");


-- event #1
INSERT INTO events (event_name, event_description, host_id) VALUES ("Mike's birthday party", "Come celebrate with us for Mike's 30th birthday!", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO participants (event_id, uid) VALUES (1, "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO participants (event_id, uid) VALUES (1, "VqQt4hTjGzUFF1IDL51FWe75YW13");

-- event #2
INSERT INTO events (event_name, event_description, host_id) VALUES ("Family dinner", "Christmas dinner", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO participants (event_id, uid) VALUES (2, "oAxwJgo0I0PA8oSMJzOYh811Ek32");

-- event #3
INSERT INTO events (event_name, event_description, host_id) VALUES ("School reunion lunch", "Let's meet up and reminisce our time back in university!", "mqxs32thwFct3Mf62RdjqqJHgs32");
INSERT INTO participants (event_id, uid) VALUES (3, "mqxs32thwFct3Mf62RdjqqJHgs32");

-- invitation to event #3
INSERT INTO participants (event_id, uid) VALUES (3, "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO participants (event_id, uid) VALUES (3, "Cyo2ejbZlDM8kr1KzZ1apL3HWhF3");
INSERT INTO participants (event_id, uid) VALUES (3, "VqQt4hTjGzUFF1IDL51FWe75YW13");
INSERT INTO participants (event_id, uid) VALUES (3, "RBgWbQ5QxINWK6Zb3zfAluoMpbM2");






-- votes for Event #3
INSERT INTO time_candidates (event_id, date, time, proposer_uid) VALUES (3, "AUGUST 10, 2023", "6:00PM", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO time_candidates (event_id, date, time, proposer_uid) VALUES (3, "AUGUST 10, 2023", "6:30PM", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO time_candidates (event_id, date, time, proposer_uid) VALUES (3, "AUGUST 11, 2023", "6:00PM", "mqxs32thwFct3Mf62RdjqqJHgs32");

INSERT INTO time_votes (time_candidates_id, uid) VALUES (1, "mqxs32thwFct3Mf62RdjqqJHgs32");
INSERT INTO time_votes (time_candidates_id, uid) VALUES (1, "oAxwJgo0I0PA8oSMJzOYh811Ek32");

INSERT INTO time_votes (time_candidates_id, uid) VALUES (2, "mqxs32thwFct3Mf62RdjqqJHgs32");

INSERT INTO time_votes (time_candidates_id, uid) VALUES (3, "mqxs32thwFct3Mf62RdjqqJHgs32");

INSERT INTO restaurants (place_id, name, address, rating, position) VALUES ("ChIJVYCScjxxhlQR5l5L231taMA", "Saku", "1588 Robson Street, Vancouver", 4.4, '{lat: 49.2892453, lng: -123.1323169}');
INSERT INTO restaurants (place_id, name, address, rating, position) VALUES ("ChIJi8p8o755hlQRh6K4U6oMJ9c", "Uncle Fatih's Pizza - SFU", "9055 University High Street Unit 108, Burnaby", 4.1, '{lat: 49.27810449999999, lng: -122.9099774}');
INSERT INTO restaurants (place_id, name, address, rating, position) VALUES ("ChIJf-jSlfFzhlQRTOfOah418is", "Burger Crush", "755 Nelson Street, Vancouver", 4.4, '{lat: 49.2797631, lng: -123.1234938}');

INSERT INTO place_candidates (event_id, place_id, proposer_uid) VALUES (3, "ChIJVYCScjxxhlQR5l5L231taMA", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO place_candidates (event_id, place_id, proposer_uid) VALUES (3, "ChIJi8p8o755hlQRh6K4U6oMJ9c", "oAxwJgo0I0PA8oSMJzOYh811Ek32");
INSERT INTO place_candidates (event_id, place_id, proposer_uid) VALUES (3, "ChIJf-jSlfFzhlQRTOfOah418is", "mqxs32thwFct3Mf62RdjqqJHgs32");

INSERT INTO place_votes (place_candidates_id, uid) VALUES (1, "mqxs32thwFct3Mf62RdjqqJHgs32");
INSERT INTO place_votes (place_candidates_id, uid) VALUES (1, "oAxwJgo0I0PA8oSMJzOYh811Ek32");

INSERT INTO place_votes (place_candidates_id, uid) VALUES (2, "mqxs32thwFct3Mf62RdjqqJHgs32");
INSERT INTO place_votes (place_candidates_id, uid) VALUES (3, "mqxs32thwFct3Mf62RdjqqJHgs32");
