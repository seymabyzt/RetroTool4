"use client"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid'

// Atoms
import HideInput from "./Atoms/HideInput"

const Topic = ({ column, userID, roomID, socket }: TopicProps) => {

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

    // console.log(commentList1, "list1")

    const sendComment = async () => {
        const currentComment = column === 'one' ? comment1 : column === 'two' ? comment2 : comment3

        const commentContent: Comment = {
            userID: userID,
            comment: currentComment,
            roomID: roomID,
            column: column,
            date: new Date().toLocaleTimeString(),
            commentID: uuidv4()
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

    const handleKeyEnter = (e: any) => {
        if (e.key === 'Enter') {
            sendComment()
        }
    }

    const deleteComment = (ID: string) => {
        if (column === 'one') {
            setCommentList1(commentList1.filter((comment) => comment.commentID != ID))

        } else if (column === 'two') {
            setCommentList2(commentList1.filter((comment) => comment.commentID != ID))

        } else if (column === 'three') {
            setCommentList3(commentList1.filter((comment) => comment.commentID != ID))
        }
    }

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        value={column === 'one' ? comment1 : column === 'two' ? comment2 : comment3}
                        onChange={(e) => {
                            if (column === 'one') {
                                setComment1(e.target.value)
                            } else if (column === 'two') {
                                setComment2(e.target.value)
                            } else {
                                setComment3(e.target.value)
                            }
                        }}
                        onKeyDown={handleKeyEnter}
                        placeholder="Write a comment"
                    />
                </form>

                <div>
                    {(column === 'one' ? commentList1 : column === 'two' ? commentList2 : commentList3).map((comment, index) => (
                        <div key={index} style={{ display: "flex" }}>
                            {userID == comment.userID && <button onClick={() => deleteComment(comment.commentID)}>X</button>}
                            <div>{userID == comment.userID ? comment.comment : <HideInput />}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Topic