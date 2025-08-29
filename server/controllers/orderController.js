import { order } from '../models/orderedModel.js'

export const newOrder = async (req, res) => {
  try {
    console.log('Received order request:', req.body)

    const { tableno, items, subtotal } = req.body

    // Validation
    if (!tableno || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Table number and at least one item are required',
      })
    }

    // Map name -> item for schema compatibility
    const formattedItems = items.map(({ name, item, price, quantity }) => ({
      item: item || name, // Use `item` if present, otherwise use `name`
      price,
      quantity,
    }))

    const newOrderData = new order({
      tableno,
      items: formattedItems,
      subtotal:
        subtotal ??
        formattedItems.reduce((sum, itm) => sum + itm.price * itm.quantity, 0),
    })

    console.log('New order created:', newOrderData)

    const savedOrder = await newOrderData.save()

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
      subtotal: savedOrder.subtotal,
    })
  } catch (error) {
    console.error('Error placing order:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const patchOrders = async (req, res) => {
  try {
    const { orderId } = req.params
    const updatedOrder = await order.findByIdAndUpdate(
      orderId,
      { status: 'completed' },
      { new: true }
    )
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.status(200).json({
      message: 'Order status updated to completed',
      order: updatedOrder,
    })
    console.log('Order updated:', updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await order.find().sort({ createdAt: -1 })

    res.status(200).json({
      message: 'All orders retrieved successfully',
      orders: allOrders,
    })
  } catch (error) {
    console.error('Error fetching all orders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
