import express from 'express';
import { addUpcomingMoviesController, viewAllUpcomingMoviesController, viewUpcomingMovieController } from '../../controllers/movies/moviesController.js';
import RequireAuthentication from '../../middlewares/RequireAuthentication.js';
import upload from '../../middlewares/multer.js';


const moviesRouter = express.Router();

// Upcoming Movie
moviesRouter.post('/addupcoming', RequireAuthentication, upload.single('image'), addUpcomingMoviesController);
moviesRouter.get('/getupcoming', RequireAuthentication, viewAllUpcomingMoviesController);
moviesRouter.get('/getupcomingmoviebyid/:id', RequireAuthentication, viewUpcomingMovieController);

export default moviesRouter;