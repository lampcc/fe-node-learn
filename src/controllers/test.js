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
