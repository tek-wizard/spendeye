import mongoose from "mongoose"

export default async function connectDB(){
  const url = process.env.MONGO_URI
  try {
    await mongoose.connect(url).then(() => {
      console.log("Mongo DB connected")
    })
  } catch (error) {
    console.log("Error while Connecting Mongo DB",error)
  }
}
