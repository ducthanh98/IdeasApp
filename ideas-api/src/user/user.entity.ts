import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from './../ideas/idea.entity';

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

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    toResponseObject(showToken: boolean) {
        const { id, created, username, ideas, token } = this;
        if (showToken) {
            return { id, username, token, ideas };
        }
        return { id, created, username, ideas };
    }
    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }
    private get token() {
        const { id, username } = this;
        return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '1d' });
    }
}
