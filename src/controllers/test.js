import { Story, Author } from '../models/test'
import mongoose from 'mongoose'
let ObjectId = mongoose.Types.ObjectId
export let AddAuthor = async (ctx) => {
  let author = new Author({ _id: new ObjectId(), name: Math.random().toString(24).substr(2), age: Math.floor(Math.random() * 10 + 100) })
  let msg = await author.save()
  console.log(msg)
  ctx.body = {
    result: 'ok'
  }
}

export let AddStory = async (ctx) => {
  let query = ctx.query
  console.log('qstory:', query)
  let story = new Story({
    title: query.title || Math.random().toString(24).substr(2),
    _creator: '5bf269e9071e4d2be8c8753d'
  })
  await story.save()
  // 关联查询
  Story.find({ title: /meng/ig })
    .populate('_creator', 'name').exec((err, s) => {
      if (err) return
      console.log(s)
    })
  ctx.body = {
    result: 'ok'
  }
}
