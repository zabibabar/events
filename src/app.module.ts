import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'

import { AuthModule } from './auth/auth.module'
import { EventsModule } from './events/event.module'
import { GroupModule } from './groups/group.module'
import { UsersModule } from './users/user.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): MongooseModuleOptions => ({
        uri: config.get<string>('MONGODB_URI')
      })
    }),
    EventsModule,
    GroupModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ]
})
export class AppModule {}
