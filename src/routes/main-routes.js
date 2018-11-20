import KoaRouter from 'koa-router'
import controllers from '../controllers/index'

const router = new KoaRouter()

router
  .get('/public/get', function (ctx, next) {
    ctx.body = 'public api!'
  })
  .get('/public/pa', controllers.test.TestController.addAuthor)
  .get('/public/ps', controllers.test.TestController.addStory)
// .get('/project/list', controllers.monitor.project.projectApi.list)
// .post('/project/save', controllers.monitor.project.projectApi.save)
// .delete('/project/delete/:id', controllers.monitor.project.projectApi.deleteById)
// .get('/project/search', controllers.monitor.project.projectApi.searchByName)
// .get('/error/list/:appkey', controllers.monitor.error.errorsApi.list)
// .put('/error/handler/:id', controllers.monitor.error.errorsApi.handler)
// .get('/error/filter/:appkey', controllers.monitor.error.errorsApi.filter)
// .get('/report/error', controllers.monitor.error.errorsApi.report)
// .get('/performance/list/:appkey', controllers.monitor.performance.performanceApi.list)
// .get('/report/performance', controllers.monitor.performance.performanceApi.report)
// .get('/api/test', controllers.monitor.test.Test)
// .all('/upload', controllers.upload.default)
// .post('/auth/:action', controllers.auth.Post)
// .post('/user/login', controllers.auth.Login)

module.exports = router
