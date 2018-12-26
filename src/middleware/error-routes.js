module.exports = function () {
  return function (ctx, next) {
    switch (ctx.status) {
      case 401:
        ctx.status = 403
        ctx.body = '403-Authentication Error'
        break
      case 404:
        ctx.status = 404
        ctx.body = 'No - 404'
        break

      case 500:
        ctx.status = 500
        ctx.body = 'Params errors'
    }
    return next()
  }
}
