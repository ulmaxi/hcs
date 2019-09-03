import { Module } from '@nestjs/common';
import { PostService } from './services/posts.service';
import { CommentService } from './services/comment.service';
import { PostContoller } from './controllers/post.controller';
import { CommentController } from './controllers/comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { Comment } from './models/comment.entity';
import { SipController } from './controllers/sip.controller';
import { SipService } from './services/sip.service';
import { AuthorizedPipe, microServiceToken } from '@eagle/server-shared';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  providers: [CommentService, PostService, SipService, AuthorizedPipe],
  controllers: [PostContoller, CommentController, SipController],
  exports: [],
})
export class SipAdminModule {}
