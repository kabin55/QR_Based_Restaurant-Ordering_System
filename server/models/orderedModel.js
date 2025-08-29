import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    tableno: {
      type: String,
      required: true,
    },

    items: [
      {
        item: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'completed', 'cancelled'],
    },
  },
  { timestamps: true }
)

export const order = mongoose.model('Order', orderSchema)
