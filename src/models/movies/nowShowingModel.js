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
  }

  static getAllNowShowingMovies = async (page, limit) => {
    const offset = (page - 1) * limit;
    try {
      const query = `SELECT * FROM now_showing LIMIT ? OFFSET ?`;
      const response = await db.query(query, [limit, offset]);
      return response;
    } catch (error) {
      throw new Error(
        "Failed to fetch now showing movies. Please try again later." +
          error.message
      );
    }
  }

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
  }

  static updateNowShowingMovie = async (payload) => {
    const { id, movie_name, image, mtrcb_rating, genre, duration } = payload;
    try {
      
      const query = `UPDATE now_showing SET movie_name = ?, image = ?, mtrcb_rating = ?, genre = ?, duration = ? 
        WHERE id = ? `;
      const response = await db.query(query, [
        movie_name,
        image, 
        mtrcb_rating, 
        genre, 
        duration,
        id
      ]);

      return response;

    } catch (error) {
      throw new Error(`Update failed, ${error}`)
    }
  }

}

export default NowShowingMoviesModel;