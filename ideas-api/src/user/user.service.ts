import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { UserDTO } from './user.dto';
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

    showAll(): Observable<UserEntity[]> {
        return from(this.userRepository.find());
    }

    async login(data: UserDTO) {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username } });
        console.log(await user.comparePassword(password))
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(true);
    }
    async register(data: UserDTO) {
        const { username } = data;
        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject(false);
    }

}
