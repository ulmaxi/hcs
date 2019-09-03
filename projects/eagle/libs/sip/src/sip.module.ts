import { Module } from '@nestjs/common';
import { SipService } from './services/sip.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentService } from './services/comment.service';
import { PostService } from './services/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { Comment } from './models/comment.entity';
import { SipController } from './controllers/sip.controller';
import { AuthorizedPipe, microServiceToken } from '@eagle/server-shared';

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
