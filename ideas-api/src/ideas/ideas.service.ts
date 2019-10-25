import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';
import { throwError, from, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class IdeasService {
    constructor(@InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>) { }
    showAll() {
        return from(this.ideaRepository.find());
    }
    async create(data: IdeaDTO) {
        const idea = this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    }
    async read(id: string) {
        return await this.ideaRepository.find({ where: { id } });
    }
    async update(id: string, data: Partial<IdeaDTO>) {
        const idea = await this.ideaRepository.update({ id }, data);
        return idea;
    }
    async delete(id: string) {
        const quantity = await this.ideaRepository.delete({ id });
        return quantity;
    }
}
