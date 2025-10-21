import User from "../models/user.model.js"

export const handleGetContacts = async (req, res) => {
  try {
    const { _id } = req.user

    const user = await User.findById(_id)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      })
    }

    return res.status(201).json({
      success: true,
      message: "Contact fetched succesfully",
      contacts: user.contacts
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching contacts",
      error,
    })
  }
}

export const handleAddContact = async (req, res) => {
  try {
    const { contactName, phoneNumber } = req.body
    const { _id } = req.user

    const user = await User.findById(_id)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      })
    }

    if (user.contacts.find((contact) => contact.name.toLowerCase() === contactName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Contact name already present",
        contacts: user.contacts.map((contact) => contact.name),
      })
    }

    if (
      user.contacts.find(
        (contact) => contact.phoneNumber === phoneNumber && phoneNumber != ""
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone number already present",
        contacts: user.contacts.map((contact) => contact.name),
      })
    }

    user.contacts.push({ name: contactName, phoneNumber })
    await user.save()

    return res.status(201).json({
      success: true,
      message: "Contact added succesfully",
      user,
      addedContact: user.contacts.find(
        (contact) => contact.name === contactName
      ),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while adding contact",
      error,
    })
  }
}

export const handleUpdateBudget=async(req,res)=>{
  try {
    const budget=req.body.budget

    const user=await User.findById(req.user._id)

    user.budget=budget
    await user.save()

    res.status(200).json({
      success:true,
      message:"Budget Updated"
    })
  } catch (error) {
    res.status(200).json({
      success:true,
      message:"Budget Updated"
    })
  }
}