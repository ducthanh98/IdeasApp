import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UserEntity } from './../user/user.entity';
import { IdeaRO } from './idea.ro';
import { CommentEntity } from './../comment/comment.entity';

@Entity('idea')
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid') id: string;
    @CreateDateColumn() created: Date;
    @Column('text') idea: string;
    @Column('text') description: string;
    @ManyToOne(type => UserEntity, author => author.ideas) author: UserEntity;

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    downvotes: UserEntity[];

    @UpdateDateColumn()
    updated: Date;

    @OneToMany(type => CommentEntity, comments => comments.idea)
    comments: CommentEntity[];

    toReponseObject(): IdeaRO {
        const { id, idea, description, created, updated, author, upvotes, downvotes } = this;
        const responseObject: IdeaRO = {
            id,
            idea,
            description,
            updated: updated.toLocaleString(),
            created: created.toLocaleString(),
            author: author.toResponseObject(false),
        };
        if (upvotes) {
            responseObject.upvotes = upvotes.length;
        }
        if (downvotes) {
            responseObject.downvotes = downvotes.length;
        }
        return responseObject;
    }
}
