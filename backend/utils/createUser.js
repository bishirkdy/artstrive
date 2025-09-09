import jwt from "jsonwebtoken";

export const generateToken = (res, userId , isAdmin ) => {
  try {
    
    const token = jwt.sign(
      { userId , isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    console.log("token", token);
    
    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000 * 24 * 30), 
      secure: process.env.NODE_ENV === 'deployment',
      sameSite: "none", 
    });

    

    return token; 
  } catch (error) {
        console.error("JWT generation error:", error); 

    res.status(400).json({ error: error.message });
  }
};

export default generateToken;
