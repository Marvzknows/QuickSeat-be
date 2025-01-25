import db from "../../database/db.js";
import { v4 as uuidv4 } from 'uuid';

class NowShowingMoviesModel {
  static addNowShowingMovies = async (payload) => {
    const { movie_id, movie_name, image, mtrcb_rating, genre, duration } =
      payload;
    const uuid = uuidv4();
    const query = `INSERT INTO now_showing (id, movie_id, movie_name, image, mtrcb_rating, genre, duration)
                    VALUES ( ?, ?, ? , ?, ?, ?, ? )`;
    try {
      // Add upload to cloudinary then sent its uploaded link to the database as the image for its name
      const response = await db.query(query, [
        uuid,
        movie_id,
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
      ]);

      return response;
    } catch (error) {
      throw new Error(`Adding now showing movie failed:  ${error}`);
    }
  };

  static deleteNowShowingMovie = async (movie_id) => {
    try {
      const query = `DELETE FROM now_showing WHERE id = ?`;
      const response = await db.query(query, [movie_id]);
      return response;
    } catch (error) {
      throw new Error(`Adding now showing movie failed:  ${error}`);
    }
  };

  static getAllNowShowingMovies = async (page, limit) => {
    let query = `SELECT * FROM now_showing`;
    const queryParams = [];

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
        "Failed to fetch now showing movies. Please try again later. " +
          error.message
      );
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

  static getNowShowingMovie = async (movie_id) => {
    try {
      const query = `SELECT * FROM now_showing WHERE id = ?`;
      const response = await db.query(query, [movie_id]);
      return response;
    } catch (error) {
      throw new Error(
        "Failed to fetch now showing movies. Please try again later." +
          error.message
      );
    }
  };

  static updateNowShowingMovie = async (payload) => {
    const { id, movie_name, image, mtrcb_rating, genre, duration, price } = payload;
    try {
      const query = `UPDATE now_showing SET movie_name = ?, image = ?, mtrcb_rating = ?, genre = ?, duration = ?, ticket_price = ? 
        WHERE id = ? `;
      const response = await db.query(query, [
        movie_name,
        image,
        mtrcb_rating,
        genre,
        duration,
        price,
        id,
      ]);

      return response;
    } catch (error) {
      throw new Error(`Update failed, ${error}`);
    }
  };

  static viewShowingMovieById = async (movie_id) => {
    try {
      const query = `SELECT * FROM now_showing WHERE id = ?`;
      const response = await db.query(query, [movie_id]);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch upcoming movie." + error.message);
    }
  };
}

export default NowShowingMoviesModel;