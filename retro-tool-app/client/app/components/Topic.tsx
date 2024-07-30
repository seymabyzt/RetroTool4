"use client"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"

const Topic = ({ column, username, roomID, socket }: TopicProps) => {

    const dispatch = useAppDispatch()

    const [comment1, setComment1] = useState("")
    const [comment2, setComment2] = useState("")
    const [comment3, setComment3] = useState("")

    const [commentList1, setCommentList1] = useState<Comment[]>(useAppSelector((state) => state.commentList.commentList1))
    const [commentList2, setCommentList2] = useState<Comment[]>(useAppSelector((state) => state.commentList.commentList2))
    const [commentList3, setCommentList3] = useState<Comment[]>(useAppSelector((state) => state.commentList.commentList3))

    useEffect(() => {
        const handleNewComment = (data: Comment) => {
            if (data.column === 'one') {
                setCommentList1((prev) => [...prev, data])
            } else if (data.column === 'two') {
                setCommentList2((prev) => [...prev, data])
            } else if (data.column === 'three') {
                setCommentList3((prev) => [...prev, data])
            }
        }
        socket.on("commentReturn", handleNewComment)

        return () => socket.off("commentReturn", handleNewComment)
    }, [socket])

    const sendComment = async () => {
        const currentComment = column === 'one' ? comment1 : column === 'two' ? comment2 : comment3

        const commentContent: Comment = {
            username: username,
            comment: currentComment,
            roomID: roomID,
            column: column,
            date: new Date().toLocaleTimeString()
        }

        await socket.emit("commentContent", commentContent)

        dispatch(addComment(commentContent))

        if (column === 'one') {
            setCommentList1((prev) => [...prev, commentContent])
            setComment1("")
        } else if (column === 'two') {
            setCommentList2((prev) => [...prev, commentContent])
            setComment2("")
        } else if (column === 'three') {
            setCommentList3((prev) => [...prev, commentContent])
            setComment3("")
        }
    }

    return (
        <>
            <div>
                {(column === 'one' ? commentList1 : column === 'two' ? commentList2 : commentList3).map((comment, index) => (
                    <div key={index}>
                        <div>{comment.comment}</div>
                        <div>{comment.username} - {comment.date}</div>
                    </div>
                ))}
            </div>

            <div>
                <input
                    value={column === 'one' ? comment1 : column === 'two' ? comment2 : comment3}
                    onChange={(e) => {
                        if (column === 'one') {
                            setComment1(e.target.value);
                        } else if (column === 'two') {
                            setComment2(e.target.value);
                        } else {
                            setComment3(e.target.value);
                        }
                    }}
                    placeholder="Write a comment"
                />
                <button onClick={sendComment}>Send</button>
            </div>
        </>
    )
}

export default Topic