import mongoose from 'mongoose'

const detailSchema = new mongoose.Schema({
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
  // loginCredentials: {
  //   username: {
  //     type: String,
  //     required: true,
  //   },
  //   password: {
  //     type: String,
  //     required: true,
  //   },
  // },
})

export const Detail = mongoose.model('Detail', detailSchema)
