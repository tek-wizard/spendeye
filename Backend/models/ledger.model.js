import mongoose from "mongoose";

const LedgerSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    person:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum:[
            "Lent",
            "Borrowed",
            "Got Back",
            "Paid Back"
        ],
        required:true
    },
    notes:{
        type:String,
    },
    date:{
        type: Date,
        required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    }
  },{ timestamps: true })

const Ledger=mongoose.model("Ledger",LedgerSchema)

export default Ledger