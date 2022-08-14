import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const setUpSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Nest JS Application')
    .setDescription('The Nest JS API description')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}

export { setUpSwagger }
