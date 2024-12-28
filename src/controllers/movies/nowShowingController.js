import imageUploadtoCloud from "../../utils/upcomingImageUpload.js";
import NowShowingMoviesModel from "../../models/movies/nowShowingModel.js";

export const addNowShowingController = async(req, res) => {
    const { file, body } = req;

    if (!file) return res.status(400).json({ message: "No file uploaded." });
    // Check if the file is too large (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "Image is too large. Maximum size is 1MB." });
    }
    
    try {
      const uploadedImageUrl = await imageUploadtoCloud(file, "now_showing");

      if (!uploadedImageUrl) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to cloud storage" });
      }

      const response = await NowShowingMoviesModel.addNowShowingMovies({
        ...body,
        image: uploadedImageUrl,
      });

      // Check if the movie was added successfully
      if (response[0]?.affectedRows > 0) {
        return res.status(200).json({
          status: true,
          message: "Now showing movie successfully added",
          image: uploadedImageUrl,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Adding Now showing movie failed",
          image: null,
        });
      }
    } catch (error) {
      return res.status(401).json({
        error: `Adding now showing movie failed, ${error}`,
      });
    }
}

export const deleteNowShowingController = async (req, res) => {
  const movie_id = req.params.id;


  if(!movie_id) {
    return res.status(400).json ({
      status: false,
      message: "Delete Failed, Invalid Movie ID"
    })
  }

  try {

    const [response] = await NowShowingMoviesModel.deleteNowShowingMovie(
      movie_id
    );

    if (response.affectedRows > 0) {
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
      message: `Deleting now showing movie failed, ${error}`,
    });
  }
}

export const getNowShowingController = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // Fetch paginated data
    const [data] = await NowShowingMoviesModel.getAllNowShowingMovies(
      pageNumber,
      limitNumber
    );
    // Fetch total count
    const [totalCountResult] = await NowShowingMoviesModel.getCount(
      "now_showing",
      search
    );

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
    return res.status(200).json({
      status: false,
      message: "No data found.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching Now Showing Movies: ${error.message}`,
    });
  }
};


export const getNowShowingByIdController = async (req, res) => {
  const { id } = req.params;

  if(!id) {
    return res.status(400).json({
      status: false,
      message: "Invalid Movie Id",
    })
  }

  const [data] = await NowShowingMoviesModel.getNowShowingMovie(id);
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

  try {
    
  } catch (error) {
    return res.status(401).json({
      message: `Error: ${error}`,
    });
  }

}

export const updateNowShowingController = async (req, res) => {
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

    const uploadedImageUrl = await imageUploadtoCloud(file, "now_showing");
    console.log("Payload: ", body)
    const response = await NowShowingMoviesModel.updateNowShowingMovie({
      ...body,
      image: uploadedImageUrl,
    });

    // Check if the movie was updated successfully
    if (response[0]?.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Now showing movie successfully update",
        image: uploadedImageUrl,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Updating Now showing movie failed",
      });
    }

  } catch (error) {
    return res.status(401).json({
      error: `Updating Now showing movie failed, ${error}`,
    });
  }

}