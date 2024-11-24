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

      const response = await NowShowingMoviesModel.addUpcomingMovies({
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