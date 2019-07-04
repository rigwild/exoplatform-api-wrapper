import { Activity, Comment } from "./Activity";
import { User } from "./User";
export declare type ApiResponseList<T extends {}> = {
    offset: number;
    limit: number;
} & T;
export declare type ApiActivitiesList = ApiResponseList<{
    activities: Activity[];
}>;
export declare type ApiCommentsList = ApiResponseList<{
    comments: Comment[];
}>;
export declare type ApiLikesList = ApiResponseList<{
    likes: User[];
}>;
//# sourceMappingURL=ApiResponse.d.ts.map