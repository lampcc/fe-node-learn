/**
 * 数据库查询及业务处理
 */
import { Story, Author } from '../models/test'
import mongoose from 'mongoose'
import BaseService from './base'
let ObjectId = mongoose.Types.ObjectId

export class TestService extends BaseService {
  async insertAuthor(data) {
    let author = new Author({ _id: new ObjectId(), name: Math.random().toString(24).substr(2), age: Math.floor(Math.random() * 10 + 100) })
    let _author = await author.save()
    return _author
  }

  async insertStory(data, query) {
    let story = new Story({
      title: query.title || Math.random().toString(24).substr(2),
      _creator: '5bf269e9071e4d2be8c8753d'
    })
    let _story = await story.save()
    return _story
  }

  async queryStoryByCreater() {
    // 关联查询
    let record = await Story.find({ title: /meng/ig })
      .populate('_creator', 'name').exec()
    return record
  }

}
