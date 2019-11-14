import { Controller, Get, Param, Post, UseGuards, UsePipes, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from './../shared/auth.guard';
import { ValidationPipe } from './../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { CommentDTO } from './comment.dto';

@Controller('api/comment')
@UseGuards(new AuthGuard())
export class CommentController {
    constructor(private commentService: CommentService) { }
    @Get('getByidea/:id')
    findByIdea(@Param('id') id: string) {
        return this.commentService.showByIdea(id);
    }

    @Get('getByUser/:id')
    findByUser(@Param('id') id: string) {
        return this.commentService.showByUser(id);
    }

    @Post('create/:id')
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') id: string, @User('id') userId: string, @Body() data: CommentDTO) {
        return this.commentService.create(id, userId, data);
    }

    @Delete(':id')
    deleteComment(@Param('id') id: string, @User('id') userId: string) {
        return this.commentService.delete(id, userId);
    }
}
