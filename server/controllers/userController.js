import { item } from '../models/itemModel.js'

export const getItems = async (req, res) => {
  try {
    const items = await item.find()
    res.status(200).json(items)
    console.log('Items fetched successfully:', items)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching items', error: error.message })
  }
}
