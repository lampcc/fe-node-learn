/**
 * 定义controller
 */
import { TestService } from '../services/test'

export class Test extends TestService {

  addAuthor = async (ctx) => {
    let msg = await this.insertAuthor()
    ctx.body = {
      result: msg
    }
  }

  addStory = async (ctx) => {
    let query = ctx.query
    console.log('qstory:', query)
    let msg = await this.insertStory(null, query)
    ctx.body = {
      result: msg
    }
  }
}

export const TestController = new Test()
