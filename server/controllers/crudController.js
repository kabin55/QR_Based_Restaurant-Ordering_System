import { item } from '../models/itemModel.js'

export const addItem = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const { type, item: itemName, price, pic } = req.body
    // console.log('Received addItem request:', req.body)
    if (!restaurantId || !type || !itemName || !price) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (typeof price !== 'number') {
      return res.status(400).json({ message: 'Price must be a number' })
    }

    let restaurant = await item.findOne({ restaurantId })
    if (!restaurant) {
      restaurant = new item({ restaurantId, itemList: [] })
    }

    restaurant.itemList.push({ type, item: itemName, price, pic })
    const savedItem = await restaurant.save()

    res.status(201).json(savedItem)
    // console.log('Item added successfully:', savedItem)
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error: error.message })
  }
}

// export const updateItem = async (req, res) => {
//   try {
//     // console.log('Updating item with ID:', req.params.id, req.body)
//     const updatedItem = await item.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     })
//     if (!updatedItem) {
//       return res.status(404).json({ message: 'Item not found' })
//     }
//     res.status(200).json(updatedItem)
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'Error updating item', error: error.message })
//   }
// }
// export const deleteItem = async (req, res) => {
//   try {
//     // console.log('Deleting item with ID:', req.params.id)
//     const deletedItem = await item.findByIdAndDelete(req.params.id)
//     // console.log('Deleted item:', deletedItem)
//     if (!deletedItem) {
//       return res.status(404).json({ message: 'Item not found' })
//     }
//     res.status(200).json({ message: 'Item deleted successfully' })
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'Error deleting item', error: error.message })
//   }
// }
export const updateItem = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params
    const { type, item: itemName, price, pic } = req.body
    // console.log('Updating item:', { restaurantId, itemId, ...req.body })

    if (!restaurantId || !itemId) {
      return res
        .status(400)
        .json({ message: 'Restaurant ID and Item ID are required' })
    }

    const restaurant = await item.findOne({ restaurantId })
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' })

    // Find the item in itemList
    const index = restaurant.itemList.findIndex(
      (i) => i._id.toString() === itemId
    )
    if (index === -1) return res.status(404).json({ message: 'Item not found' })

    // Update the fields
    if (type) restaurant.itemList[index].type = type
    if (itemName) restaurant.itemList[index].item = itemName
    if (price !== undefined) restaurant.itemList[index].price = Number(price)
    if (pic !== undefined) restaurant.itemList[index].pic = pic

    await restaurant.save()
    res.status(200).json(restaurant.itemList[index])
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating item', error: error.message })
  }
}

// DELETE single item from itemList
export const deleteItemFromList = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.params

    if (!restaurantId || !itemId) {
      return res
        .status(400)
        .json({ message: 'Restaurant ID and Item ID are required' })
    }

    const restaurant = await item.findOne({ restaurantId })
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' })

    // Filter out the item to delete
    const newItemList = restaurant.itemList.filter(
      (i) => i._id.toString() !== itemId
    )

    if (newItemList.length === restaurant.itemList.length) {
      return res.status(404).json({ message: 'Item not found' })
    }

    restaurant.itemList = newItemList
    await restaurant.save()

    res.status(200).json({ message: 'Item deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting item', error: error.message })
  }
}

export const getItems = async (req, res) => {
  try {
    const { restaurantId } = req.params
    // console.log('Params:', { restaurantId })

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }

    // Find the restaurant by restaurantId
    const restaurant = await item.findOne({ restaurantId })
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    // console.log('Fetched items:', restaurant.itemList)

    res.status(200).json(restaurant.itemList)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error fetching items', error: error.message })
  }
}
