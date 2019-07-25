import { Activity, Comment } from "./Activity";
import { User } from "./User";
import { Space } from "./Space";
export declare type ApiResponseList<T extends {}> = {
    offset: number;
    limit: number;
} & T;
export declare type ApiSpacesList = ApiResponseList<{
    spaces: Space[];
}>;
export declare type ApiActivitiesList = ApiResponseList<{
    activities: Activity[];
}>;
export declare type ApiCommentsList = ApiResponseList<{
    comments: Comment[];
}>;
export declare type ApiLikesList = ApiResponseList<{
    likes: User[];
}>;
export declare type ApiUsersList = ApiResponseList<{
    users: User[];
}>;
//# sourceMappingURL=ApiResponse.d.ts.map