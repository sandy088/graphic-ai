import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import images from './images'

export const runtime = 'node'

const app = new Hono().basePath('/api')

const routes = app.route("/images", images)

export type AppType = typeof routes