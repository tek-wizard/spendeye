import User from "../models/user.model.js"
import { differenceInDays } from "date-fns"

export const handleGetContacts = async (req, res) => {
  try {
    const { _id } = req.user

    const user = await User.findById(_id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
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
      return res.status(404).json({
        success: false,
        message: "No user found",
      })
    }

    if (
      user.contacts.find(
        (contact) => contact.name.toLowerCase() === contactName.toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "A contact with this name already exists",
      })
    }

    if (
      phoneNumber &&
      user.contacts.find((contact) => contact.phoneNumber === phoneNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "A contact with this phone number already exists",
      })
    }

    const newContact = { name: contactName, phoneNumber }
    user.contacts.push(newContact)
    await user.save()

    const addedContact = user.contacts.find((c) => c.name === contactName)

    return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      addedContact,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while adding contact",
      error: error.message,
    })
  }
}

export const handleUpdateBudget = async (req, res) => {
  try {
    const { budget } = req.body
    const { _id } = req.user

    if (budget === undefined || isNaN(budget) || budget < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid budget amount provided." })
    }

    const user = await User.findById(_id)

    // Rule Enforcement: Check if budget was updated in the last 7 days.
    if (user.budgetLastUpdated) {
      const daysSinceLastUpdate = differenceInDays(
        new Date(),
        user.budgetLastUpdated
      )
      if (daysSinceLastUpdate < 7) {
        return res.status(403).json({
          // 403 Forbidden
          success: false,
          message: `Budget can only be updated once per week. You can update it again in ${
            7 - daysSinceLastUpdate
          } days.`,
        })
      }
    }

    user.budget = budget
    user.budgetLastUpdated = new Date() // Update the timestamp
    await user.save()

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      user: { budget: user.budget, budgetLastUpdated: user.budgetLastUpdated },
    })
  } catch (error) {
    console.error("Error updating budget:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating budget",
      error: error.message,
    })
  }
}

export const handleUpdateProfile = async (req, res) => {
  try {
    const { username } = req.body
    const { _id } = req.user

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { username } },
      { new: true, runValidators: true }
    ).select("-password")

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." })
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating profile.",
      error: error.message,
    })
  }
}
