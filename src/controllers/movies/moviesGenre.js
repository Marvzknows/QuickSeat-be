import MoviesGenreModel from '../../models/movies/moviesGenresModel.js';

export const getMoviesGenre = async(req, res) => {

    try {
      const [data] = await MoviesGenreModel.getAllMoviesGenre();
      if (data) {
        return res.status(200).json({
          status: true,
          data: data,
        });
      }
      res.status(200).json({
        status: false,
        message: "No Genres Found",
        data: data,
      });
      
    } catch (error) {
      return res.status(401).json({
        error: `Error fetching Movie Genres, ${error}`,
      });
    }
}