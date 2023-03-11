import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  )
  app.useGlobalGuards(new (AuthGuard('jwt'))())
  app.setGlobalPrefix('api')

  await app.listen(9000)
}
bootstrap()
