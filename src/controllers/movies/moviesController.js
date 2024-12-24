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
  const { page = 1, limit = 10, search = ''} = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // Fetch paginated data
    const [data] = await MoviesModel.viewAllUpcomingMovies(pageNumber, limitNumber, search);
    // Fetch total count
    const [totalCountResult] = await MoviesModel.getCount('upcoming_show', search);

    const count = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(count / limitNumber);

    if (data.length > 0) {
      return res.status(200).json({
        status: true,
        currentPage: pageNumber,
        totalPages,
        count,
        data,
      });
    }
    return res.status(201).json({
      status: false,
      message: "No data found.",
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error.message}`,
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
    res.status(201).json({
      status: false,
      message: "No data Found",
      data: [],
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
        status: true,
        message: "Deleted Successfuly",
      });
    } else {
      res.status(201).json({
        status: false,
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

  if (!id || !movie_name || !mtrcb_rating || !genre || !duration) {
    return res.status(400).json({ message: "Update Failed, Missing required fields in payload." });
  }

  try {
    let uploadedImageUrl;

    // If a file is uploaded, check size and upload to Cloudinary
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        return res.status(400).json({ message: "Image is too large. Maximum size is 1MB." });
      }
      uploadedImageUrl = await imageUploadtoCloud(file, "upcoming_show");
    } else {
      // No new file, retain the existing image by querying the current record
      const [existingMovie] = await MoviesModel.viewUpcomingMovieById(id);
      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found." });
      }
      uploadedImageUrl = existingMovie[0].image;  // Use existing image
    }

    const response = await MoviesModel.updateUpcomingMovie({
      ...body,
      image: uploadedImageUrl,
    });

    if (response[0]?.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Upcoming movie successfully updated",
        image: uploadedImageUrl,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Updating upcoming movie failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: `Updating upcoming movie failed, ${error.message}`,
    });
  }
};
