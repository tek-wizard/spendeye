import jwt from "jsonwebtoken";

export const jwtSetUser=(user)=>{
    const {_id,username,email}=user
    // console.log(_id,username,email)
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
        return jwt.verify(token, process.env.SECRET_KEY)
      } catch (error) {
        return null
      }
}