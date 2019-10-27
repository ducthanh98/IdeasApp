import { Controller, Get, Post, UsePipes, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserDTO } from './user.dto';

@Controller('api/')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('/users')
    showAllUsers() {
        return this.userService.showAll();
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDTO) {
        return this.userService.register(data);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDTO) {
        return this.userService.login(data);
    }



}
