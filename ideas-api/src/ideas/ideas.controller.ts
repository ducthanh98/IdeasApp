import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, Res, Logger } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeaDTO } from './idea.dto';
import { Response } from 'express';
import { ResponseData } from '../shared/ResponseData';
import { IdeaEntity } from './idea.entity';
import { throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('ideas')
export class IdeasController {
    constructor(private ideaService: IdeasService) {

    }
    @Get()
    showAllIdeas(): Observable<IdeaEntity[]> {
        return this.ideaService.showAll();
    }
    @Post()
    createIdea(@Body() data: IdeaDTO) {
        return this.ideaService.create(data);
    }
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.ideaService.read(id);
    }
    @Put(':id')
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.update(id, data);
    }
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.ideaService.delete(id);
    }

}
