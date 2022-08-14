import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app/app.module'
import { setUpSwagger, setupSecurity } from './utils'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['warn', 'log', 'error', 'debug', 'verbose'],
  })
  app.useGlobalPipes(new ValidationPipe())
  setupSecurity(app)
  setUpSwagger(app)
  await app.listen(3000)
}
bootstrap()
