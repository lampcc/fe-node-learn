module.exports = function () {
  return function (ctx, next) {
    switch (ctx.status) {
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
