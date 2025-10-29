import mongoose from 'mongoose'

const detailSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
    unique: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  loginCredentials: {
    username: {
      default: 'admin',
      type: String,
      required: true,
    },
    password: {
      default: 'password',
      type: String,
      required: true,
    },
  },
  offer: {
    type: String,
    default: '',
  },
  itemsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Items' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
})

export const Detail = mongoose.model('Detail', detailSchema)
