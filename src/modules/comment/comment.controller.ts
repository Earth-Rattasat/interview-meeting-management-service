import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import UserGuard from '../auth/guards/user.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfoDecorator } from '../auth/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SingleResponseDto } from 'src/utils/base-response-dto';
import { Comment } from 'src/entities/comment.entity';
import { OwnerCommentGuard } from './guards/owner-comment.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(UserGuard)
@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @UserInfoDecorator() user,
    @Body() payload: CreateCommentDto,
  ): Promise<SingleResponseDto<Comment>> {
    const data = await this.commentService.createComment(user.id, payload);
    return { data };
  }

  @UseGuards(OwnerCommentGuard)
  @Patch(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() payload: UpdateCommentDto,
  ): Promise<SingleResponseDto<Comment>> {
    const data = await this.commentService.updateComment(id, payload);
    return { data };
  }

  @UseGuards(OwnerCommentGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    const data = await this.commentService.deleteComment(id);
    return { data };
  }
}
