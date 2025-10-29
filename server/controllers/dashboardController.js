import { order } from '../models/orderedModel.js'

// export const getEarningDetails = async (req, res) => {
//   try {
//     const { restaurantId } = req.params
//     if (!restaurantId) {
//       return res.status(400).json({ message: 'Restaurant ID is required' })
//     }

//     // Fetch all orders for the given restaurant

//     const allOrders = await order.find()

//     const getDayName = (date) =>
//       ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]

//     const today = new Date()

//     // ===== Daily (last 7 days, ascending Sunday → Saturday) =====
//     const daily = []
//     for (let i = 6; i >= 0; i--) {
//       const day = new Date()
//       day.setDate(today.getDate() - i)
//       const start = new Date(day)
//       start.setHours(0, 0, 0, 0)
//       const end = new Date(day)
//       end.setHours(23, 59, 59, 999)

//       const ordersOfDay = allOrders.filter(
//         (ord) =>
//           new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
//       )

//       daily.push({
//         name: getDayName(day),
//         earnings: ordersOfDay.reduce((sum, o) => sum + (o.subtotal || 0), 0),
//         orders: ordersOfDay.length,
//       })
//     }

//     // ===== Weekly (last 4 weeks, ascending Week 1 → Week 4) =====
//     const weekly = []
//     for (let i = 3; i >= 0; i--) {
//       const start = new Date()
//       start.setDate(today.getDate() - today.getDay() - i * 7)
//       start.setHours(0, 0, 0, 0)
//       const end = new Date(start)
//       end.setDate(start.getDate() + 6)
//       end.setHours(23, 59, 59, 999)

//       const ordersOfWeek = allOrders.filter(
//         (ord) =>
//           new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
//       )

//       weekly.push({
//         name: `Week ${4 - i}`, // ascending Week 1 → Week 4
//         earnings: ordersOfWeek.reduce((sum, o) => sum + (o.subtotal || 0), 0),
//         orders: ordersOfWeek.length,
//       })
//     }

//     // ===== Monthly (last 6 months, oldest → newest) =====
//     const monthly = []
//     for (let i = 5; i >= 0; i--) {
//       const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
//       const start = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0)
//       const end = new Date(
//         month.getFullYear(),
//         month.getMonth() + 1,
//         0,
//         23,
//         59,
//         59
//       )

//       const ordersOfMonth = allOrders.filter(
//         (ord) =>
//           new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
//       )

//       monthly.push({
//         name: month.toLocaleString('default', { month: 'short' }),
//         earnings: ordersOfMonth.reduce((sum, o) => sum + (o.subtotal || 0), 0),
//         orders: ordersOfMonth.length,
//       })
//     }

//     // ===== Total revenue & total orders =====
//     const totalRevenue = allOrders.reduce(
//       (sum, o) => sum + (o.subtotal || 0),
//       0
//     )
//     const totalOrders = allOrders.length

//     // ===== Top 5 Selling Items =====
//     const itemMap = {}
//     let totalItems = 0

//     allOrders.forEach((ord) => {
//       ord.items.forEach((i) => {
//         const quantity = i.quantity || 1
//         totalItems += quantity
//         if (!itemMap[i.item]) itemMap[i.item] = { sales: 0, revenue: 0 }
//         itemMap[i.item].sales += quantity
//         itemMap[i.item].revenue += i.price * quantity
//       })
//     })

//     const topProducts = Object.entries(itemMap)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.sales - a.sales)
//       .slice(0, 5)

//     res.status(200).json({
//       daily,
//       weekly,
//       monthly,
//       totalRevenue,
//       totalOrders,
//       topProducts,
//       totalItems,
//     })
//   } catch (error) {
//     console.error('Error fetching earning details:', error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

export const getEarningDetails = async (req, res) => {
  try {
    const { restaurantId } = req.params
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' })
    }

    // Fetch restaurant orders
    const restaurantOrders = await order.find({ restaurantId })

    // Flatten all sub-orders
    const allOrders = restaurantOrders.flatMap((doc) =>
      doc.orders.map((subOrder) => ({
        ...subOrder.toObject(),
        createdAt: subOrder.createdAt,
      }))
    )

    const today = new Date()
    const getDayName = (date) =>
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]

    // ===== Daily (last 7 days, fixed Sun → Sat order) =====
    const dailyMap = {}
    for (let i = 6; i >= 0; i--) {
      const day = new Date()
      day.setDate(today.getDate() - i)
      const start = new Date(day)
      start.setHours(0, 0, 0, 0)
      const end = new Date(day)
      end.setHours(23, 59, 59, 999)

      const ordersOfDay = allOrders.filter(
        (ord) =>
          new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
      )

      const dayName = getDayName(day)
      dailyMap[dayName] = {
        name: dayName,
        earnings: ordersOfDay.reduce((sum, o) => sum + (o.subtotal || 0), 0),
        orders: ordersOfDay.length,
      }
    }

    // Order Sunday → Saturday
    const daily = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
      (d) => dailyMap[d] || { name: d, earnings: 0, orders: 0 }
    )

    // ===== Weekly (last 4 weeks, fixed Week 1 → Week 4) =====
    const weekly = []
    for (let i = 3; i >= 0; i--) {
      const start = new Date()
      start.setDate(today.getDate() - today.getDay() - i * 7)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)

      const ordersOfWeek = allOrders.filter(
        (ord) =>
          new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
      )

      weekly.push({
        name: `Week ${4 - i}`, // Week 1 → oldest
        earnings: ordersOfWeek.reduce((sum, o) => sum + (o.subtotal || 0), 0),
        orders: ordersOfWeek.length,
      })
    }

    // ===== Monthly (last 6 months, oldest → newest) =====
    const monthly = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const start = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0)
      const end = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0,
        23,
        59,
        59
      )

      const ordersOfMonth = allOrders.filter(
        (ord) =>
          new Date(ord.createdAt) >= start && new Date(ord.createdAt) <= end
      )

      monthly.push({
        name: month.toLocaleString('default', { month: 'short' }),
        earnings: ordersOfMonth.reduce((sum, o) => sum + (o.subtotal || 0), 0),
        orders: ordersOfMonth.length,
      })
    }

    // ===== Total revenue & total orders =====
    const totalRevenue = allOrders.reduce(
      (sum, o) => sum + (o.subtotal || 0),
      0
    )
    const totalOrders = allOrders.length

    // ===== Top 5 Selling Items =====
    const itemMap = {}
    let totalItems = 0

    allOrders.forEach((ord) => {
      ord.items.forEach((i) => {
        const quantity = i.quantity || 1
        totalItems += quantity
        if (!itemMap[i.item]) itemMap[i.item] = { sales: 0, revenue: 0 }
        itemMap[i.item].sales += quantity
        itemMap[i.item].revenue += i.price * quantity
      })
    })

    const topProducts = Object.entries(itemMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    res.status(200).json({
      daily, // Sun → Sat
      weekly, // Week 1 → Week 4
      monthly, // Oldest → Newest
      totalRevenue,
      totalOrders,
      topProducts,
      totalItems,
    })
  } catch (error) {
    console.error('Error fetching earning details:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
