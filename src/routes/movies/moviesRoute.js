import express from 'express';
import {
  addUpcomingMoviesController,
  viewAllUpcomingMoviesController,
  viewUpcomingMovieController,
  deleteUpcomingMovieController,
  updateUpcomingMovieController,
} from "../../controllers/movies/moviesController.js";
import RequireAuthentication from '../../middlewares/RequireAuthentication.js';
import upload from '../../middlewares/multer.js';
import {
  addNowShowingController,
  deleteNowShowingController,
  getNowShowingController,
  getNowShowingByIdController,
  updateNowShowingController
} from "../../controllers/movies/nowShowingController.js";


const moviesRouter = express.Router();

// Upcoming Movie
moviesRouter.post('/addupcoming', RequireAuthentication, upload.single('image'), addUpcomingMoviesController);
moviesRouter.get('/getupcoming', RequireAuthentication, viewAllUpcomingMoviesController);
moviesRouter.get('/getupcomingmoviebyid/:id', RequireAuthentication, viewUpcomingMovieController);
moviesRouter.delete('/deleteupcoming/:id', RequireAuthentication, deleteUpcomingMovieController);
moviesRouter.put('/updateupcoming', RequireAuthentication, upload.single('image'), updateUpcomingMovieController);

// Now Showing Movie
moviesRouter.post('/nowshowing/addmovie', RequireAuthentication, upload.single('image'), addNowShowingController)
moviesRouter.delete('/nowshowing/deletemovie/:id', RequireAuthentication, deleteNowShowingController);
moviesRouter.get('/nowshowing/getmovies', RequireAuthentication, getNowShowingController);
moviesRouter.get('/nowshowing/getmovies/:id', RequireAuthentication, getNowShowingByIdController);
moviesRouter.put('/nowshowing/updatenowshowing', RequireAuthentication, upload.single('image'), updateNowShowingController);

export default moviesRouter;