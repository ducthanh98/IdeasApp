import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';
import { UserEntity } from './../user/user.entity';
import { IdeaRO } from './idea.ro';
import { UserRO } from './../user/user.ro';
import { Votes } from '../shared/votes.enum';

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }
    showAll(): Promise<IdeaEntity[]> {
        return this.ideaRepository.find({ relations: ['author', 'upvotes', 'downvotes'] });
    }
    async create(userId: string, data: IdeaDTO) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return idea.toReponseObject();
    }
    async read(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        if (idea) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return idea.toReponseObject();
    }
    async update(id: string, data: Partial<IdeaDTO>) {
        const idea = await this.ideaRepository.update({ id }, data);
        return idea;
    }
    async delete(id: string) {
        const quantity = await this.ideaRepository.delete({ id });
        return quantity;
    }
    async bookmark(id: string, userId: string): Promise<UserRO> {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(false);
    }
    async unbookmark(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
        }
    }
    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.UP : Votes.DOWN;
        if (idea[opposite].filter(voter => voter.id === user.id).length > 0
            || idea[vote].filter(voter => voter.id === user.id).length > 0) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
        } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
            idea[vote].push(user);
        } else {
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }
        await this.ideaRepository.save(idea);
        return idea;
    }
    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.UP);
        return idea.toReponseObject();
    }
    async downvotes(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.DOWN);
        return idea.toReponseObject();
    }

}
