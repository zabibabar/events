import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventsModule } from './events/events.module'
import { GroupsModule } from './groups/groups.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    EventsModule,
    GroupsModule,
    MongooseModule.forRoot(
      'mongodb+srv://zabi:DIo54UzkuocYJes0@cluster0.hmw5o.mongodb.net/events?retryWrites=true&w=majority'
    ),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
