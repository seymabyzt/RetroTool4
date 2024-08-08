"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment, deleteComment, incrementLikeCount } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid'
import { SmileTwoTone, FrownTwoTone, EditTwoTone, CheckCircleOutlined } from '@ant-design/icons'
import { Input, Flex } from "antd"
import { toast } from "react-hot-toast"
import CommentItem from "./Atoms/CommentItem"
import {useDrop} from 'react-dnd'
import { useRef } from 'react'

const Topic = ({ step, column, userID, roomID, socket }: TopicProps) => {

  const ref= useRef<HTMLDivElement>(null);
    const[, dropRef] = useDrop({
        accept: 'COMMENT_ITEM',
        drop: (item) => {
            console.log("dropped item:", item);
            moveItemToNewLocation(item.comment);
        }
      });
      const dispatch= useAppDispatch();
      const  moveItemToNewLocation = async (item: any) => {
        console.log(item);
        const commentContent: Comment = {
            userID: item.userID,
            comment: item.comment,
            roomID: item.roomID,
            column: column,
            date: item.date,
            commentID: uuidv4(),
            likeCount: item.likeCount,
            likedByUsers: item.likedByUsers
        }

        await socket.emit("commentContent", commentContent)

        dispatch(addComment(commentContent))
        deleteCommentAndNotify(item.commentID,true)
      }

    const commentList1 = useAppSelector((state) => state.commentList.commentList1)
    const commentList2 = useAppSelector((state) => state.commentList.commentList2)
    const commentList3 = useAppSelector((state) => state.commentList.commentList3)
    const commentList4 = useAppSelector((state) => state.commentList.commentList4)

    const [comment1, setComment1] = useState("")
    const [comment2, setComment2] = useState("")
    const [comment3, setComment3] = useState("")
    const [comment4, setComment4] = useState("")
    const [isDisabledInput, setIsDisabledInput] = useState(true)

    useEffect(() => {
        const handleNewComment = (data: Comment) => {
            dispatch(addComment(data))
        }

        const handleDeleteComment = (commentID: string) => {
            dispatch(deleteComment(commentID))
        }

        const handleIncrementLikeCount = ({ commentID, column, userID }: { commentID: string, column: string, userID: string }) => {
            dispatch(incrementLikeCount({ commentID, column, userID }));
        }

        socket.on("commentReturn", handleNewComment)
        socket.on("commentDeleted", handleDeleteComment)
        socket.on("likeCountUpdated", handleIncrementLikeCount)

        return () => {
            socket.off("commentReturn", handleNewComment)
            socket.off("commentDeleted", handleDeleteComment)
            socket.off("likeCountUpdated", handleIncrementLikeCount)
        }
    }, [socket, dispatch])

    useEffect(() => {
        if (step === 3) {
            setIsDisabledInput(false)
        } else if (step === 4) {
            setIsDisabledInput(true)
        }
    }, [step, column])

    const sendComment = async () => {
        const currentComment = column === 'one' ? comment1 : column === 'two' ? comment2 : column === 'three' ? comment3 : comment4

        const commentContent: Comment = {
            userID: userID,
            comment: currentComment,
            roomID: roomID,
            column: column,
            date: new Date().toLocaleTimeString(),
            commentID: uuidv4(),
            likeCount: 0,
            likedByUsers: []
        }

        await socket.emit("commentContent", commentContent)

        dispatch(addComment(commentContent))

        if (column === 'one') {
            setComment1("")
        } else if (column === 'two') {
            setComment2("")
        } else if (column === 'three') {
            setComment3("")
        } else {
            setComment4("")
        }
    }

    const deleteCommentAndNotify = async (commentID: string, hideAlert: boolean) => {
        dispatch(deleteComment(commentID))
        await socket.emit("deleteComment", { commentID, roomID })
        if(!hideAlert)
            toast.success("Comment is deleted!")
    }

    const handleKeyEnter = (e: any) => {
        if (e.key === 'Enter') {
            sendComment()
        }
    }

    const handleIncrementLike = async (commentID: string) => {
        dispatch(incrementLikeCount({ commentID, column, userID }));
        await socket.emit("likeCount", { commentID, roomID, column, userID });
    };


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (column === 'one') {
            setComment1(e.target.value)
        } else if (column === 'two') {
            setComment2(e.target.value)
        } else if (column === 'three') {
            setComment3(e.target.value)
        } else {
            setComment4(e.target.value)
        }
    }

    const commentList = column === 'one' ? commentList1 : column === 'two' ? commentList2 : column === 'three' ? commentList3 : commentList4

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex style={{ gap: 5 }}>
                        {column == 'one' ? <SmileTwoTone /> : column === 'two' ? <FrownTwoTone /> : column === 'three' ? <EditTwoTone /> : <CheckCircleOutlined />}
                        <Input disabled={(column == 'four' && step != 3) || step == 4 && isDisabledInput} style={{ padding: '10px' }}
                            variant="filled" value={column === 'one' ? comment1 : column === 'two' ? comment2 : column === 'three' ? comment3 : comment4}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyEnter}
                            placeholder={column == 'one' ? 'It worked well that...' : column == 'two' ? 'We could improve...' : column == 'three' ? 'I want to ask about...' : 'Actions'}
                        />
                    </Flex>
                </form>

                <div ref={dropRef} key={Math.random() * 10000} style={{minHeight:"300px"}}>
                    {commentList.map((comment, index) => (

                        <CommentItem
                            key={index}
                            comment={comment}
                            userID={userID}
                            step={step}
                            column={column}
                            deleteCommentAndNotify={deleteCommentAndNotify}
                            handleIncrementLike={handleIncrementLike}
                        />

                    ))}
                </div>
            </div>
        </>
    )
}

export default Topic