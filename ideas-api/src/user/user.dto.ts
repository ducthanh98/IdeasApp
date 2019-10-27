import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MoreThanOrEqual } from 'typeorm';

export class UserDTO {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}
