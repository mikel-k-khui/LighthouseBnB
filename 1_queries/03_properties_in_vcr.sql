-- Show all details about properties located in Vancouver including their average rating.

-- Select all columns from the properties table for properties located in Vancouver, and the average rating for each property.
-- Order the results from lowest cost_per_night to highest cost_per_night.
-- Limit the number of results to 10.
-- Only show listings that have a rating >= 4 stars.
-- To build this incrementally, you can start by getting all properties without the average rating first.

SELECT title, cost_per_night, owner_id, avg(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON (properties.id=property_reviews.property_id)
WHERE city LIKE '%couv%' AND cost_per_night > 10527 AND cost_per_night < 75000 AND owner_id=222
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;