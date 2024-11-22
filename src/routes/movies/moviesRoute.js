import express from 'express';
import { addUpcomingMoviesController } from '../../controllers/movies/moviesController.js';
import RequireAuthentication from '../../middlewares/RequireAuthentication.js';
import upload from '../../middlewares/multer.js';


const moviesRouter = express.Router();

// Upcoming Movie
moviesRouter.post('/addupcoming', RequireAuthentication, upload.single('image'), addUpcomingMoviesController)

export default moviesRouter;