import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  createComment(userId: string, payload: CreateCommentDto) {
    return this.commentRepository.save({
      ...payload,
      createdById: userId,
    });
  }

  getCommentById(id: string) {
    return this.commentRepository.findOne({ where: { id } });
  }

  async updateComment(id: string, payload: UpdateCommentDto): Promise<Comment> {
    await this.commentRepository.update(id, {
      description: payload.description,
    });

    return this.commentRepository.findOneByOrFail({ id });
  }

  async deleteComment(id: string) {
    return this.commentRepository.delete({ id });
  }
}
