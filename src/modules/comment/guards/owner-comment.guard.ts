import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { CommentService } from '../comment.service';

@Injectable()
export class OwnerCommentGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const commentId = request.params.id;

    const comment = await this.commentService.getCommentById(commentId);
    if (!comment) throw new ForbiddenException('Comment not found');

    if (comment.createdById !== user.id) {
      throw new ForbiddenException('You are not the owner of this comment');
    }

    return true;
  }
}
