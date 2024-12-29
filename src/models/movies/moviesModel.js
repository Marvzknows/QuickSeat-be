import db from '../../database/db.js';
import { v4 as uuidv4 } from 'uuid';

class MoviesModel {
  static addUpcomingMovies = async (payload) => {
    const { movie_name, image, mtrcb_rating, genre, duration, ticket_price } = payload;
    const movie_id = uuidv4();
    const query = `INSERT INTO upcoming_show (id, movie_name, image, mtrcb_rating, genre, duration, ticket_price)
                VALUES ( ?, ?, ? , ?, ?, ?, ? )`;
    try {
      // Add upload to cloudinary then sent its uploaded link to the database as the image for its name
      const response = await db.query(query, [
        movie_id,
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
        ticket_price
      ]);

      return response;
    } catch (error) {
      throw new Error(`Adding upcoming movie failed:  ${error}`);
    }
  };

  static viewAllUpcomingMovies = async (page, limit, search) => {
    let query = `SELECT * FROM upcoming_show WHERE is_now_showing IS NULL`;
    const queryParams = [];

    // Add search condition if provided
    if (search) {
      query += ` AND movie_name LIKE ?`;
      queryParams.push(`%${search}%`);
    }

    // Apply LIMIT and OFFSET only if limit is provided
    if (limit) {
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(limit, offset);
    }

    try {
      const response = await db.query(query, queryParams);
      return response;
    } catch (error) {
      throw new Error(
        "Failed to fetch upcoming movies. Please try again later. " +
          error.message
      );
    }
  };

  static viewUpcomingMovieById = async (movie_id) => {
    try {
      const query = `SELECT * FROM upcoming_show WHERE id = ?`;
      const response = await db.query(query, [movie_id]);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch upcoming movie." + error.message);
    }
  };

  static deleteUpcomingMovie = async (movie_id) => {
    try {
      const query = `DELETE FROM upcoming_show WHERE id = ?`;
      const response = await db.query(query, [movie_id]);
      return response;
    } catch (error) {
      throw new Error(`Query failed, ${error}`);
    }
  };

  static updateUpcomingMovie = async (payload) => {
    const { id, movie_name, image, mtrcb_rating, genre, duration, ticket_price } = payload;
    try {
      const query = `UPDATE upcoming_show SET movie_name = ?, image = ?, mtrcb_rating = ?, genre = ?, duration = ?, ticket_price = ? 
          WHERE id = ? `;
      const response = await db.query(query, [
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
        ticket_price,
        id,
      ]);
      return response;
    } catch (error) {
      throw new Error(`Query failed, ${error}`);
    }
  };

  static getCount = async (tableName, search) => {
    let query = `SELECT COUNT(*) AS count FROM ${tableName} WHERE is_now_showing IS NULL`;
    const queryParams = [];

    try {
      // Validate table name to prevent SQL injection
      if (!tableName) {
        throw new Error("Invalid table name");
      }

      if (search) {
        query += ` AND movie_name LIKE ?`;
        queryParams.push(`%${search}%`);
      }

      const response = await db.query(query, queryParams);
      return response;
    } catch (error) {
      throw new Error(`Count Query failed, ${error}`);
    }
  };

  static addMoviesToNowShowing = async (moviesIds) => {
    try {
      // Get all movie data from upcoming_show for the given IDs
      const selectQuery = `SELECT * FROM upcoming_show WHERE id IN (?)`;
      const [getMoviesResponse] = await db.query(selectQuery, [moviesIds]);

      // console.log("getMoviesResponse:", getMoviesResponse);

      if (getMoviesResponse && getMoviesResponse.length > 0) {
        // Prepare data for bulk insert
        const values = getMoviesResponse.map((data) => [
          uuidv4(), // New unique ID for now_showing
          data.id, // Movie ID from upcoming_show
          data.movie_name,
          data.image,
          data.mtrcb_rating,
          data.genre,
          data.duration,
          data.created_at,
        ]);

        // console.log("Values for bulk insert:", values);
        // Update is_now_showing from NULL to 1 (or any non-null value)
        const updateQuery = `
          UPDATE upcoming_show 
          SET is_now_showing = 1 
          WHERE id IN (?)
        `;
        await db.query(updateQuery, [moviesIds]);

        // Perform bulk insert
        const bulkInsertQuery = `
          INSERT INTO now_showing 
          (id, movie_id, movie_name, image, mtrcb_rating, genre, duration, created_at) 
          VALUES ?
        `;

        const [insertResponse] = await db.query(bulkInsertQuery, [values]);

        return insertResponse;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Failed to move to now showing: ${error}`);
    }
  };
}

export default MoviesModel;