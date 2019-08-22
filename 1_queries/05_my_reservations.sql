-- Show all reservations for a user.
-- 
-- -- -- Select all columns from the reservations table, all columns from the properties table, and the average rating of the property.
-- -- Order the results from most recent start_date to least recent start_date.
-- -- -- -- These will end up being filtered by either "Upcoming Reservations" or "Past Reservations", so only get reservations where the end_date is in the past.
-- Use now()::date to get today's date.
-- -- This will only be for a single user, so use 1 for the user_id.
-- Limit the results to 10.

SELECT reservations.*, properties.title, avg(property_reviews.rating) AS average_rating
FROM reservations
JOIN properties ON (properties.id=reservations.property_id)
JOIN property_reviews ON (reservations.id=property_reviews.reservation_id)
WHERE reservations.end_date > NOW()::date AND property_reviews.guest_id = 2
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date DESC
LIMIT 10
;