/**
 * 定义controller
 */
import { TestService } from '../services/test'

export class Test extends TestService {

  /**
   * 添加创作者
   */
  addAuthor = async (ctx) => {
    let data = ctx.request.body
    if (!data.name || !data.age) return ((ctx.status = 405) && (ctx.body = 'params error!'))
    let msg = await this.insertAuthor(data)
    ctx.body = {
      result: msg
    }
  }

  getAuthorList = async (ctx) => {
    let msg = await this.queryAuthores()
    ctx.body = {
      total: msg.length,
      result: msg
    }
  }

  editAuthor = async (ctx) => {
    let _id = ctx.params.id
    let _opt = ctx.request.body
    _opt.sdk = '100'
    let msg = await this.updateAuthor(_id, _opt)
    ctx.body = {
      result: msg
    }
  }

  /**
   * 添加故事
   */
  addStory = async (ctx) => {
    let query = ctx.query
    console.log('qstory:', query)
    let msg = await this.insertStory(null, query)
    ctx.body = {
      result: msg
    }
  }

  /**
   * test populate
   */
  testService = async (ctx) => {
    let record = await this.queryAuthorByCreater()
    ctx.body = {
      result: record
    }
  }
}

export const TestController = new Test()
