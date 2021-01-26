import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventModule } from './events/event.module'
import { GroupModule } from './groups/group.module'

@Module({
  imports: [
    EventModule,
    GroupModule,
    MongooseModule.forRoot(
      'mongodb+srv://zabi:DIo54UzkuocYJes0@cluster0.hmw5o.mongodb.net/events?retryWrites=true&w=majority'
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
