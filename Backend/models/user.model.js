import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
      }
    ],
  },
  { timestamps: true }
)

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }

    try {
        const saltRounds=12
        this.password=await bcrypt.hash(this.password,saltRounds)
    } catch (error) {
        console.log("Error while hashing the password")
    }

    return next()
})

const User=mongoose.model("User",UserSchema)

export default User



