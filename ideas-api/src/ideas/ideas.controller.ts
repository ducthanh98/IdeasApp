import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, Res, Logger, UsePipes, UseGuards } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeaDTO } from './idea.dto';
import { ResponseData } from '../shared/ResponseData';
import { IdeaEntity } from './idea.entity';
import { Observable } from 'rxjs';
import { ValidationPipe } from './../shared/validation.pipe';
import { AuthGuard } from './../shared/auth.guard';

@Controller('api/ideas')
@UseGuards(new AuthGuard())

export class IdeasController {
    constructor(private ideaService: IdeasService) {

    }
    @Get()
    showAllIdeas(): Observable<IdeaEntity[]> {
        return this.ideaService.showAll();
    }
    @Post()
    @UsePipes(new ValidationPipe())
    createIdea(@Body() data: IdeaDTO) {
        return this.ideaService.create(data);
    }
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.ideaService.read(id);
    }
    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.update(id, data);
    }
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.ideaService.delete(id);
    }

}
