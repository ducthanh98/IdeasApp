import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { IdeaEntity } from './../ideas/idea.entity';
import { UserEntity } from './../user/user.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async getById(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
        return comment;
    }
    async create(ideaId: string, userId: string, data: CommentDTO) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const author = await this.userRepository.findOne({ where: { id: userId } });

        const comment = await this.commentRepository.create({
            ...data,
            author,
            idea,
        });
        await this.commentRepository.save(comment);
        return comment;
    }

    async delete(id: string, userId: string) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
        if (comment.author.id !== userId) {
            throw new HttpException(`You don't own this comment`, HttpStatus.UNAUTHORIZED);
        }
        await this.commentRepository.remove(comment);
    }
    async showByIdea(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['comments', 'comments.author', 'comments.idea'] });
        return idea.comments;
    }
    async showByUser(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { author: id }, relations: ['author'] });
        return idea.comments;
    }

}
