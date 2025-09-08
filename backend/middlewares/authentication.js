import jwt from "jsonwebtoken";
export const authenticateJWT = (req, res, next) => {

  let token = req.cookies.jwt;
  
  
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.teamName = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export const authenticatedAdmin = (req, res, next) => {
  if (req.teamName && req.teamName.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "You are not an admin , Access Denied" });
  }
}