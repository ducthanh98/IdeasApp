import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, Res, Logger, UsePipes, UseGuards } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from './../shared/validation.pipe';
import { AuthGuard } from './../shared/auth.guard';
import { User } from './../user/user.decorator';
import { IdeaRO } from './idea.ro';

@Controller('api/ideas')
@UseGuards(new AuthGuard())
export class IdeasController {
    constructor(private ideaService: IdeasService) {

    }
    @Get()
    async showAllIdeas(): Promise<IdeaRO[]> {
        const ideas = await this.ideaService.showAll();
        return ideas.map(idea => idea.toReponseObject());
    }
    @Post()
    @UsePipes(new ValidationPipe())
    async createIdea(@Body() data: IdeaDTO, @User('id') id: string) {
        return this.ideaService.create(id, data);
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
    @Get('upvote/:id')
    upvoteIdea(@Param('id') id: string, @User('id') userId: string) {
        return this.ideaService.upvote(id, userId);
    }

    @Get('downvote/:id')
    downvoteIdea(@Param('id') id: string, @User('id') userId: string) {
        return this.ideaService.downvotes(id, userId);
    }
}
