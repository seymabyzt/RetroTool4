export interface TopicProps {
    username: string,
    roomID: string,
    socket: any,
    column: string
}

export interface Comment {
    username: string,
    comment: string,
    roomID: string,
    column: string,
    date: string
}