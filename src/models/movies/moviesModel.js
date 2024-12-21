import db from '../../database/db.js';
import { v4 as uuidv4 } from 'uuid';

class MoviesModel {
  static addUpcomingMovies = async (payload) => {
    const { movie_name, image, mtrcb_rating, genre, duration } = payload;
    const movie_id = uuidv4();
    const query = `INSERT INTO upcoming_show (id, movie_name, image, mtrcb_rating, genre, duration)
                VALUES ( ?, ?, ? , ?, ?, ? )`;
    try {
      // Add upload to cloudinary then sent its uploaded link to the database as the image for its name
      const response = await db.query(query, [
        movie_id,
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
      ]);

      return response;
    } catch (error) {
      throw new Error(`Adding upcoming movie failed:  ${error}`);
    }
  };

  static viewAllUpcomingMovies = async (page, limit, search) => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM upcoming_show`;
    const queryParams = [];

    // Add search condition if provided
    if (search) {
      query += ` WHERE movie_name LIKE ?`;
      queryParams.push(`%${search}%`);
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const response = await db.query(query, queryParams);
      return response;
    } catch (error) {
      throw new Error(
        "Failed to fetch upcoming movies. Please try again later." +
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
    const { id, movie_name, image, mtrcb_rating, genre, duration } = payload;
    try {
      const query = `UPDATE upcoming_show SET movie_name = ?, image = ?, mtrcb_rating = ?, genre = ?, duration = ? 
          WHERE id = ? `;
      const response = await db.query(query, [
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
        id,
      ]);
      return response;
    } catch (error) {
      throw new Error(`Query failed, ${error}`);
    }
  };

  static getCount = async (tableName, search) => {
    let query = `SELECT COUNT(*) AS count FROM ${tableName}`; 
    const queryParams = [];

    try {
      // Validate table name to prevent SQL injection
      if (!tableName) {
        throw new Error("Invalid table name");
      }

      if (search) {
        query += ` WHERE movie_name LIKE ?`;
        queryParams.push(`%${search}%`);
      } 

      const response = await db.query(query, queryParams);
      return response;
    } catch (error) {
      throw new Error(`Count Query failed, ${error}`);
    }
  };
}

export default MoviesModel;