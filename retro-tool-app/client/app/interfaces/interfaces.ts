export interface TopicProps {
    userID: string,
    roomID: string,
    socket: any,
    column: string
}

export interface Comment {
    userID: string,
    comment: string,
    roomID: string,
    column: string,
    date: string,
    commentID: string
}

export interface CommentListState {
    commentList1: Comment[],
    commentList2: Comment[],
    commentList3: Comment[]
}