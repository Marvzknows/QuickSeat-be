import db from "../../database/db.js";
import { v4 as uuidv4 } from 'uuid';

class NowShowingMoviesModel {

    static addUpcomingMovies = async (payload) => {
        const { movie_id , movie_name, image, mtrcb_rating, genre, duration } = payload;
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

}

export default NowShowingMoviesModel;