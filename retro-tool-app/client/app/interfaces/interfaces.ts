export interface TopicProps {
    step: number,
    userID: string,
    roomID: string,
    socket: any,
    column: string,
    isAdmin: boolean
}

export interface Comment {
    userID: string,
    comment: string,
    roomID: string,
    column: string,
    date: string,
    commentID: string,
    likeCount: number,
    likedByUsers?: string[]
}

export interface CommentListState {
    commentList1: Comment[],
    commentList2: Comment[],
    commentList3: Comment[],
    commentList4: Comment[]
}

export interface CommentItemProps {
    comment: Comment,
    userID: string,
    step: number,
    column: string,
    deleteCommentAndNotify: (commentID: string, hideAlert: boolean) => void
    handleIncrementLike: (commentID: string) => void,
    isAdmin: boolean
}