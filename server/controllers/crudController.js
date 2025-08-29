import { item } from '../models/itemModel.js'

export const addItem = async (req, res) => {
  try {
    const newItem = new item(req.body)
    if (!newItem.type || !newItem.item || !newItem.price) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (typeof newItem.price !== 'number') {
      return res.status(400).json({ message: 'Price must be a number' })
    }
    console.log('Adding item:', newItem)
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
    console.log('Item added successfully:', savedItem)
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error: error.message })
  }
}
export const updateItem = async (req, res) => {
  try {
    console.log('Updating item with ID:', req.params.id, req.body)
    const updatedItem = await item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json(updatedItem)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating item', error: error.message })
  }
}
export const deleteItem = async (req, res) => {
  try {
    console.log('Deleting item with ID:', req.params.id)
    const deletedItem = await item.findByIdAndDelete(req.params.id)
    console.log('Deleted item:', deletedItem)
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json({ message: 'Item deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting item', error: error.message })
  }
}
