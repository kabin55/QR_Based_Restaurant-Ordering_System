import { order } from '../models/orderedModel.js'
import { getIO } from '../middleware/socket.js'

export const newOrder = async (req, res) => {
  const { restaurantId } = req.params
  const { tableno, items, subtotal } = req.body

  try {
    // console.log('Received order request:', req.body)

    if (!tableno || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Table number and at least one item are required',
      })
    }

    // Format items to match schema
    const formattedItems = items.map(({ name, item, price, quantity }) => ({
      item: item || name,
      price,
      quantity,
    }))

    // Check if restaurant document exists
    let restaurantOrders = await order.findOne({ restaurantId })
    if (!restaurantOrders) {
      // Create new restaurant document with the order
      restaurantOrders = new order({
        restaurantId,
        orders: [
          {
            tableno,
            items: formattedItems,
            subtotal:
              subtotal ??
              formattedItems.reduce(
                (sum, itm) => sum + itm.price * itm.quantity,
                0
              ),
          },
        ],
      })
    } else {
      // Push new order into existing restaurant document
      restaurantOrders.orders.push({
        tableno,
        items: formattedItems,
        subtotal:
          subtotal ??
          formattedItems.reduce(
            (sum, itm) => sum + itm.price * itm.quantity,
            0
          ),
      })
    }

    const savedOrder = await restaurantOrders.save()
    // console.log('Order saved:', savedOrder)

    // Emit orders for this restaurant
    const io = getIO()
    io.emit('ordersUpdated', savedOrder.orders)

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
    })
  } catch (error) {
    console.error('Error placing order:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

export const patchOrders = async (req, res) => {
  // try {
  //   const { orderId } = req.params
  //   const updatedOrder = await order.findByIdAndUpdate(
  //     orderId,
  //     { status: 'completed' },
  //     { new: true }
  //   )
  //   if (!updatedOrder) {
  //     return res.status(404).json({ message: 'Order not found' })
  //   }
  //   res.status(200).json({
  //     message: 'Order status updated to completed',
  //     order: updatedOrder,
  //   })
  //   // console.log('Order updated:', updatedOrder)
  // } catch (error) {
  //   console.error('Error updating order:', error)
  //   res.status(500).json({ message: 'Internal server error' })
  // }

  try {
    // const { restaurantId } = req.params
    const { orderId } = req.params
    const { status } = req.body

    if (
      !['pending', 'in-progress', 'completed', 'cancelled'].includes(status)
    ) {
      return res.status(400).json({ message: 'Invalid status value' })
    }
    // const restaurantOrders = await order.findOne({ restaurantId })
    // if (!restaurantOrders) {
    //   return res.status(404).json({ message: 'Restaurant not found' })
    // }

    const updatedOrder = await order.findOneAndUpdate(
      { 'orders._id': orderId },
      { 'orders.$.status': status },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Emit updated orders for this restaurant
    const io = getIO()
    io.emit('ordersUpdated', updatedOrder.orders)

    res.status(200).json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    })
    // console.log('Order updated:', updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params
    // const restaurantId = '101'
    // console.log('Fetching orders for restaurant ID:', restaurantId)
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }
    const restaurantOrders = await order
      .findOne({ restaurantId })
      .sort({ createdAt: -1 })

    // console.log('Fetched orders for restaurant:', restaurantOrders.orders)

    if (!restaurantOrders) {
      return res
        .status(404)
        .json({ message: 'No orders found for this restaurant' })
    }
    const io = getIO()
    io.emit('ordersUpdated', restaurantOrders.orders)

    res.status(200).json({
      message: 'All orders retrieved successfully',
      orders: restaurantOrders.orders,
    })
  } catch (error) {
    console.error('Error fetching all orders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
