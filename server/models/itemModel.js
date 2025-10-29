import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
      unique: true,
    },
    itemList: [
      {
        type: {
          type: String,
          required: true,
        },
        item: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        pic: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
)

export const item = mongoose.model('Item', itemSchema)
