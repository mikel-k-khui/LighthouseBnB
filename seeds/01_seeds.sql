INSERT INTO users (name, email, password) 
VALUES ('Bart Simpson', 'bart@simpson.s', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Stever Rogers', 'captain@avengers.org', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Doctor Stephen Strange', 'sanctum@sancto.rum', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedroom,
  street,
  country,
  city,
  province,
  post_code,
  active) 
VALUES
(1, 'home', 'description', 'https://imgur.com/gallery/7zG5pn6', 'https://imgur.com/gallery/7zG5pn6','101000',2, 2, 5, '744 Evergreen Terrace', 'United States', 'Springfield','Oregon', '49007', false),
(3, 'Apartment', 'description', 'https://imgur.com/gallery/7zG5pn6', 'https://imgur.com/gallery/7zG5pn6','1000',1, 2, 2, '1614 Connecticut Avenue NW', 'United States', 'Washington','District of Columbia', '20009', true),
(3, 'Sanctum Sanctorum', 'description', 'https://imgur.com/gallery/7zG5pn6', 'https://imgur.com/gallery/7zG5pn6','1000000',2, 10.5, 20, '177A Bleecker Street', 'United States', 'New York City','New York', '10012-1406', true);

INSERT INTO reservations (guest_id, property_id,start_date, end_date) 
VALUES (1, 2, '2018-09-11', '2018-09-26'),
(3, 3, '2019-01-04', '2019-02-01'),
(2, 3, '2023-01-01', '2023-12-31');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 100, 'Eat My Shorts!'),
(3, 3, 2, 14000605, 'One.'),
(2, 3, 3, 5, 'I CAN DO THIS ALL DAY.');