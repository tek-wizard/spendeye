import jwt from "jsonwebtoken";

export const jwtSetUser=(user)=>{
    const {_id,username,email}=user
    const secret=process.env.JWT_SECRET
    return jwt.sign({
        _id,
        username,
        email
    },secret,{ expiresIn: "7d" })
}

export const jwtGetUser=(token)=>{
    if (!token) {
        return null
      }
      try {
        return jwt.verify(token, process.env.JWT_SECRET)
      } catch (error) {
        return null
      }
}