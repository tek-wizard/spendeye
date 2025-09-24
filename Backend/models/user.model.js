import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber:{
      type:String,
    },
    password: {
      type: String,
      required: true,
    },
    budget:{
      type:Number,
      default:1000
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
        phoneNumber:{
          type:String,
        }
      }
    ],
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    }
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



