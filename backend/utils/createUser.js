import jwt from "jsonwebtoken";

export const generateToken = (res, userId, isAdmin) => {
  try {
    const token = jwt.sign({ userId, isAdmin }, process.env.SECRET_KEY, {
      expiresIn: "12h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });

    return token;
  } catch (error) {
    console.error("JWT generation error:", error);

    res.status(400).json({ error: error.message });
  }
};

export default generateToken;
