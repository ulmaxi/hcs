import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPipe } from '@ulmax/authentication';
import { microServiceToken } from '@ulmax/server-shared';
import { SipController } from './controllers/sip.controller';
import { Comment } from './models/comment.entity';
import { Post } from './models/posts.entity';
import { CommentService } from './services/comment.service';
import { PostService } from './services/posts.service';
import { SipService } from './services/sip.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    ClientsModule.register([
      {
        name: microServiceToken,
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [SipService, CommentService, PostService, AuthorizedPipe],
  controllers: [SipController],
})
export class SipModule {}
