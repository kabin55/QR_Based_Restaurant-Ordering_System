import { Detail } from '../models/detailModel.js'

export const createDetail = async (req, res) => {
  try {
    const { restaurantID, restaurantName, address, description, image } =
      req.body

    console.log(req.body)

    if (!restaurantName || !address) {
      return res
        .status(400)
        .json({ message: 'Restaurant name and address are required.' })
    }

    const newDetail = new Detail({
      restaurantId: restaurantID,
      restaurantName,
      address,
      description,
      image,
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
    console.log(req.body)
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
    res.status(200).json({ success: true, detail })
  } catch (error) {
    console.error('Error fetching detail:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
export const updateDetail = async (req, res) => {
  try {
    const { resturentId } = req.params
    console.log(req.params)
    const { restaurantName, address, description, image } = req.body

    if (!resturentId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }

    const updatedDetail = await Detail.findOneAndUpdate(
      { restaurantId: resturentId },
      { restaurantName, address, description, image },
      { new: true }
    )

    if (!updatedDetail) {
      return res.status(404).json({ message: 'Detail not found' })
    }

    res.status(200).json({ success: true, detail: updatedDetail })
  } catch (error) {
    console.error('Error updating detail:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
