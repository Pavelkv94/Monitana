import { Router } from "express";

export const viewRouter = Router();

// const blogController = container.resolve(BlogController);

// blogsRouter.get(
//   "/",
//   paginationQueryMiddleware,
//   sortQueryMiddleware,
//   blogQueryMiddleware,
//   inputCheckErrorsMiddleware,
//   blogController.getBlogs.bind(blogController)
// );

viewRouter.post("/", (req, res) => {
	res.sendStatus(200);
});
