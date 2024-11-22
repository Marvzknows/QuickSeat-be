import db from '../../database/db.js';
import dotenv from "dotenv";

dotenv.config();

class MoviesModel {

    static addUpcomingMovies = async (payload) => {
        const { image, mtrcb_rating, genre, duration } = payload
        const query = `INSERT INTO upcoming_show (image, mtrcb_rating, genre, duration)
                VALUES ( ? , ? , ?, ? )`;
        try {
          // Add upload to cloudinary then sent its uploaded link to the database as the image for its name
          const response = await db.query(query, [image, mtrcb_rating, genre, duration]);
          
          return response;
        } catch (error) {
          throw new Error('Failed to fetch upcoming movies. Please try again later.' + error.message);
        }
      };
}

export default MoviesModel;