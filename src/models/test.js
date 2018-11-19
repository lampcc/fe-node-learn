let mongoose = require('mongoose')
let Schema = mongoose.Schema

let authorSchema = Schema({
  _id: String,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
})
let storySchema = Schema({
  _creator: { type: String, ref: 'Author' },
  title: String,
  fans: [{ type: String, ref: 'Author' }]
})
let Story = mongoose.model('Story', storySchema, 'story')
let Author = mongoose.model('Author', authorSchema, 'author')

export {
  Story, Author
}
