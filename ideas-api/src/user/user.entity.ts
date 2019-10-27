import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'varchar',
        unique: true,
    })
    username: string;
    @Column('text')
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    toResponseObject(showToken: boolean) {
        const { id, created, username, token } = this;
        if (showToken) {
            return { id, username, token };
        }
        return { id, created, username };
    }
    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }
    private get token() {
        const { id, username } = this;
        return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '1d' });
    }
}
