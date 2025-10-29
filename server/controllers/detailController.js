import { Detail } from '../models/detailModel.js'
import bcrypt from 'bcrypt'

export const createDetail = async (req, res) => {
  try {
    const { restaurantID, restaurantName, address, description, image } =
      req.body

    // console.log(req.body)

    if (!restaurantName || !address) {
      return res
        .status(400)
        .json({ message: 'Restaurant name and address are required.' })
    }
    const defaultPassword = 'password'
    const newDetail = new Detail({
      restaurantId: restaurantID,
      restaurantName,
      address,
      description,
      image,
      loginCredentials: {
        username: 'admin',
        password: await bcrypt.hash(defaultPassword, 10),
      },
    })

    const savedDetail = await newDetail.save()
    res.status(201).json(savedDetail)
  } catch (error) {
    console.error('Error creating detail:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getDetail = async (req, res) => {
  try {
    const { restaurantId } = req.body
    // console.log(req.body)
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }

    const detail = await Detail.findOne(
      { restaurantId },
      { loginCredentials: 0 }
    )
    if (!detail) {
      return res.status(404).json({ message: 'Detail not found' })
    }
    // console.log(detail)
    res.status(200).json({ success: true, detail })
  } catch (error) {
    console.error('Error fetching detail:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateDetail = async (req, res) => {
  try {
    const { restaurantId } = req.params
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }

    const { restaurantName, address, description, image, username, password } =
      req.body

    // Build update object dynamically
    const updateFields = {}
    if (restaurantName) updateFields.restaurantName = restaurantName
    if (address) updateFields.address = address
    if (description) updateFields.description = description
    if (image) updateFields.image = image

    if (username || password) {
      updateFields.loginCredentials = {}
      if (username) updateFields.loginCredentials.username = username
      if (password) {
        updateFields.loginCredentials.password = await bcrypt.hash(password, 10)
      }
    }

    const updatedDetail = await Detail.findOneAndUpdate(
      { restaurantId }, // match by restaurantId field in DB
      { $set: updateFields },
      { new: true }
    )

    if (!updatedDetail) {
      return res.status(404).json({ message: 'Detail not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Detail updated successfully',
      detail: updatedDetail,
    })
  } catch (error) {
    console.error('Error updating detail:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
