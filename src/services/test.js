/**
 * 数据库查询及业务处理
 */
import { Story, Author } from '../models/test'
import mongoose from 'mongoose'
import BaseService from './base'
let ObjectId = mongoose.Types.ObjectId

export class TestService extends BaseService {
  async insertAuthor(data) {
    let au = {
      _id: new ObjectId(),
      name: data.name || Math.random().toString(24).substr(2),
      age: data.age || Math.floor(Math.random() * 10 + 100),
      stories: [
        '5bf51cb46864d187a35ae7b6', '5bf51cb96864d187a35ae7b7'
      ]
    }
    let author = new Author(au)
    let _author = await author.save()
    return _author
  }

  async queryAuthores(query) {
    return Author.find().sort({ _id: -1 }).exec()
  }

  async undateAuthor(id, opt) {
    return Author.updateOne({ _id: id }, { $set: opt })
  }

  async insertStory(data, query) {
    let story = new Story({
      title: query.title || Math.random().toString(24).substr(2),
      _creator: '5bf269e9071e4d2be8c8753d'
    })
    let _story = await story.save()
    return _story
  }
  /**
   * 根据ref关联查询创建者信息
   */
  async queryAuthorByCreater(data) {
    // Field selection
    let record = await Story.find({ title: /tes/ig })
      .populate('_creator', 'name').exec()

    // Query conditions and other options
    // let record = Story
    //   .find({ title: /tes/ig })
    //   .populate({
    //     path: 'fans',
    //     match: { age: { $gte: 60 } },
    //     select: 'name age -_id',
    //     options: { limit: 5 }
    //   })
    //   .exec()

    // let record = Author
    //   .find({})
    //   .populate({
    //     path: 'stories',
    //     select: 'title -_id',
    //     options: { limit: 5 }
    //   })
    //   .exec()

    return record
  }

}
