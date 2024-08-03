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