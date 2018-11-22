import Koa2 from 'koa'
import KoaBody from 'koa-body'
// import KoaStatic from 'koa-static2'
import {
  System as SystemConfig
} from './config'
// import path from 'path'
import MainRoutes from './routes/main-routes'
// import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './middleware/error-routes'
// import jwt from 'koa-jwt'
// import websockify from 'koa-websocket'
// import IO from 'koa-socket'
// import fs from 'fs'
// import PluginLoader from './lib/PluginLoader'
import mongo from './services/mongo'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

// const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

mongo()

app
  // .use(ErrorRoutesCatch())
  // .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  // .use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user\/login|\/assets|\/report/] }))
  .use(KoaBody({
    // multipart: true,
    // strict: false,
    // formidable: {
    //   uploadDir: path.join(__dirname, '../assets/uploads/tmp')
    // },
    // jsonLimit: '10mb',
    // formLimit: '10mb',
    // textLimit: '10mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(ErrorRoutes())


if (env === 'development') { // logger
  // app.use()
}

app.listen(SystemConfig.API_server_port)

console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

export default app
