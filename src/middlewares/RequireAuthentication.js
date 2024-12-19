import jwt from "jsonwebtoken";

const RequireAuthentication = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({
      error: "Access denied, Invalid Authorization",
    });
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).json({
      isToken: false,
      error: "Invalid or Expired Token",
    });
  }
};

export default RequireAuthentication;
