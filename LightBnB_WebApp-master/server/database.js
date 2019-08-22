// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

// setting node-Postgres SQL to vagrant VM database: default port 5432 is overridden in server.js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users
// test: user cadencerollins@live.com or id=2
//test db: user allisonjackson@mail.com
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryStr = `
  SELECT name, email, password, id
  FROM users
  WHERE email = $1;
  `;

  return pool.query(queryStr, [email])
    .then(res => {
      return res.rows[0] === undefined ? null : res.rows[0];
    })
    .catch(err => {
      return Promise.reject(null);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryStr = `
  SELECT name, email, password, id
  FROM users
  WHERE email = $1;
  `;
  return pool.query(queryStr, [id])
    .then(res => {
      return res.rows[0] === undefined ? null : res.rows[0];
    })
    .catch(err => {
      return Promise.reject(null);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryStr = `
  INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3) RETURNING *;
  `;
  return pool.query(queryStr, [user.name, user.email, user.password])
    .then(res => {
      return res.rows[0] === undefined ? null : res.rows;
    })
    .catch(err => {
      return Promise.reject(null);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  //test users.id=28, evelynaustin@ymail.com
  const queryStr = `
  SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON (properties.id=reservations.property_id)
  JOIN property_reviews ON (reservations.id=property_reviews.reservation_id)
  WHERE reservations.end_date > NOW()::date AND property_reviews.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date DESC
  LIMIT $2
  `;

  return pool.query(queryStr, [guest_id, limit])
    .then(res => {
      return res.rows[0] === undefined ? null : res.rows;
    })
    .catch(err => {
      return Promise.reject(null);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const queryParams = [];
  let queryStr = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // check WHERE statement, e.g. WHERE city LIKE '%couv%' AND cost_per_night > 10527 AND cost_per_night < 75000 AND owner_id=222

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryStr += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    (queryParams.length === 0) ? queryStr += `WHERE ` : queryStr += `AND `;
    queryParams.push(`${options.owner_id}`);
    queryStr += `ownerid = $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    (queryParams.length === 0) ? queryStr += `WHERE ` : queryStr += `AND `;
    queryParams.push(`${options.minimum_price_per_night}`);
    queryStr += `cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    (queryParams.length === 0) ? queryStr += `WHERE ` : queryStr += `AND `;
    queryParams.push(`${options.maximum_price_per_night}`);
    queryStr += `cost_per_night <= $${queryParams.length} `;
  }

  //add GROUP BY statement
  queryStr += `
  GROUP BY properties.id
  `;

  //check HAVING statement, e.g. HAVING avg(property_reviews.rating) >= 4
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryStr += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  //add ORDER BY statement, e.g. ORDER BY cost_per_night ASC
  queryStr += `
  ORDER BY cost_per_night`;

  // add LIMIT statement, e.g. LIMIT 10;
  queryParams.push(limit);
  queryStr += `
  LIMIT $${queryParams.length};`;

  // console.log(queryStr, queryParams, " and ", limit);

  return pool.query(queryStr, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let queryParams = [];
  let insertStr = 'INSERT INTO properties (';
  let valuesStr = 'VALUES (';

  for (const param in property) {
    insertStr += `${param}, `;
    console.log(`${param}=${property[param]}`);
    queryParams.push(`${property[param]}`);
    valuesStr += `$${queryParams.length}, `;
  }

  if (insertStr.endsWith(', ')) {
    insertStr = insertStr.substring(0, insertStr.length - 2) + `)
    `;
  }
  if (valuesStr.endsWith(', ')) {
    valuesStr = valuesStr.substring(0, valuesStr.length - 2) + ') RETURNING *;';
  }

  console.log(insertStr + valuesStr);
  return pool.query(insertStr + valuesStr, queryParams)
    .then(res => res.row);
};
exports.addProperty = addProperty;
