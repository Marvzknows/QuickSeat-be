import imageUploadtoCloud from "../../utils/upcomingImageUpload.js";
import MoviesModel from "../../models/movies/moviesModel.js";

export const addUpcomingMoviesController = async (req, res) => {
  const { file, body } = req;

  if (!file) return res.status(400).json({ message: "No file uploaded." });
  // Check if the file is too large (1MB limit)
  if (file.size > 1 * 1024 * 1024) {
    return res
      .status(400)
      .json({ message: "Image is too large. Maximum size is 1MB." });
  }

  try {
    const uploadedImageUrl = await imageUploadtoCloud(file, "upcoming_show");

    if (!uploadedImageUrl) {
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary" });
    }

    const response = await MoviesModel.addUpcomingMovies({
      ...body,
      image: uploadedImageUrl,
    });

    // Check if the movie was added successfully
    if (response[0]?.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Upcoming movie successfully added",
        image: uploadedImageUrl,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Adding upcoming movie failed",
        image: null,
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: `Image upload failed, ${error}`,
    });
  }
};

export const viewAllUpcomingMoviesController = async (req, res) => {

  const { page = 1, limit = 10 } = req.query;
  // Convert page and limit to integers for use in the model function
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    const [data] = await MoviesModel.viewAllUpcomingMovies(pageNumber, limitNumber);

    if (data) {
      return res.status(200).json({
        status: true,
        data: data,
      });
    }
    res.status(200).json({
      status: false,
      message: "No data Found",
      data: data,
    });
  } catch (error) {
    return res.status(401).json({
      message: `Error: ${error}`,
    });
  }
};

export const viewUpcomingMovieController = async (req, res) => {
  try {
    const movie_id = req.params.id

    if (!movie_id) {
      return res.status(400).json({
        status: false,
        message: "Movie ID is required",
      });
    }

    const [data] = await MoviesModel.viewUpcomingMovieById(movie_id);

    if (data.length) {
      return res.status(200).json({
        status: true,
        data: data,
      });
    }
    res.status(200).json({
      status: false,
      message: "No data Found",
      data: null,
    });
  } catch (error) {
    return res.status(401).json({
      message: `Error: ${error}`,
    });
  }
};

export const deleteUpcomingMovieController = async (req, res) => {
  const movie_id = req.params.id;

  if (!movie_id) return res.status(400).json({ message: "Invalid Movie ID." });
  
  try {
    
    const [data] = await MoviesModel.deleteUpcomingMovie(movie_id);

    if (data.affectedRows > 0) {
      res.status(201).json({
        statu: true,
        message: "Deleted Successfuly",
      });
    } else {
      res.status(201).json({
        statu: false,
        message: "Movie not found",
      });
    }

  } catch (error) {
    return res.status(401).json({
      message: `Deleting Upcoming Movie failed: ${error}`,
    });
  }

};

export const updateUpcomingMovieController = async (req, res) => {
  const { file, body } = req;
  const { id, movie_name, mtrcb_rating, genre, duration } = body;

  if (!file) return res.status(400).json({ message: "No Image uploaded." });

  if (!id || !movie_name || !mtrcb_rating || !genre || !duration) {
    return res.status(400).json({ message: "Update Failed, Missing required fields in payload." });
  } 

  try {
    // Check if the file is too large (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "Image is too large. Maximum size is 1MB." });
    }

    const uploadedImageUrl = await imageUploadtoCloud(file, "upcoming_show");

    const response = await MoviesModel.updateUpcomingMovie({
      ...body,
      image: uploadedImageUrl,
    });

    // Check if the movie was updated successfully
    if (response[0]?.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Upcoming movie successfully update",
        image: uploadedImageUrl,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Updating upcoming movie failed",
      });
    }

  } catch (error) {
    return res.status(401).json({
      error: `Updating upcoming movie failed, ${error}`,
    });
  }

}