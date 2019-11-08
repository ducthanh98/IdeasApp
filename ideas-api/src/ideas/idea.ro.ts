import { UserRO } from '../user/user.ro';

export class IdeaRO {
    id: string;
    updated: string;
    created: string;
    idea: string;
    description: string;
    author: UserRO;
    upvotes?: number;
    downvotes?: number;
}
