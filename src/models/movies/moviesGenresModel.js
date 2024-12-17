import db from "../../database/db.js";

class MoviesGenreModel {

    static getAllMoviesGenre() {

        try {
            const query = `SELECT * FROM movie_genres`;
            const result = db.query(query);
            
            return result;
        } catch (error) {
            throw new Error(`Update failed, ${error}`)
        }
    }

}

export default MoviesGenreModel;