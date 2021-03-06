import { IdeaEntity } from './../ideas/idea.entity';

export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
    bookmarks: IdeaEntity[];
}
