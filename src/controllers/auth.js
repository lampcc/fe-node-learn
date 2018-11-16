import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import User from '../models/user'

const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))

export let Login = async (ctx) => {
  let userInfo = ctx.request.body
  // 校验用户名和密码,通过后生成token
  let user = await User.findByName(userInfo.name)
  if (user && user.password === userInfo.password) {
    // 用户登录的时候返回token
    let token = jwt.sign({
      userInfo: userInfo.name // 保存到token的数据
    }, publicKey, { expiresIn: '7d' })
    ctx.body = {
      token: token
    }
  } else {
    ctx.body = {
      status: 412,
      err: 'User error',
      errInfo: 'UserName or password wrong!'
    }
  }
}

/**
 * 检查授权是否合法
 */
export let CheckAuth = (ctx) => {
  let token = ctx.request.header.authorization
  try {
    let decoded = jwt.verify(token.substr(7), publicKey)
    if (decoded.userInfo) {
      return {
        status: 1,
        result: decoded.userInfo
      }
    } else {
      return {
        status: 403,
        result: {
          errInfo: '没有授权'
        }
      }
    }
  } catch (err) {
    return {
      status: 503,
      result: {
        errInfo: '解密错误'
      }
    }
  }
}

export let Post = (ctx) => {
  switch (ctx.params.action) {
    case 'check':
      return CheckAuth(ctx).then(result => { ctx.body = result })
    default:
      return CheckAuth(ctx).then(result => { ctx.body = result })
  }
}
