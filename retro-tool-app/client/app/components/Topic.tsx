"use client"
import { useState, useEffect, ChangeEvent } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment, deleteComment, incrementLikeCount } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid'
import { LikeTwoTone, DeleteTwoTone, SmileTwoTone, FrownTwoTone, EditTwoTone
  } from '@ant-design/icons';
import HideInput from "./Atoms/HideInput"
import { Input, Flex } from "antd"

const Topic = ({ step, column, userID, roomID, socket }: TopicProps) => {
    const dispatch = useAppDispatch()

    const commentList1 = useAppSelector((state) => state.commentList.commentList1)
    const commentList2 = useAppSelector((state) => state.commentList.commentList2)
    const commentList3 = useAppSelector((state) => state.commentList.commentList3)

    const [comment1, setComment1] = useState("")
    const [comment2, setComment2] = useState("")
    const [comment3, setComment3] = useState("")

    // const [commentLikeCount, setCommentLikeCount] = useState(0)

    useEffect(() => {
        const handleNewComment = (data: Comment) => {
            dispatch(addComment(data))
        }

        const handleDeleteComment = (commentID: string) => {
            dispatch(deleteComment(commentID))
        }

        socket.on("commentReturn", handleNewComment)
        socket.on("commentDeleted", handleDeleteComment)

        return () => {
            socket.off("commentReturn", handleNewComment)
            socket.off("commentDeleted", handleDeleteComment)
        }
    }, [socket, dispatch])

    const sendComment = async () => {
        const currentComment = column === 'one' ? comment1 : column === 'two' ? comment2 : comment3

        const commentContent: Comment = {
            userID: userID,
            comment: currentComment,
            roomID: roomID,
            column: column,
            date: new Date().toLocaleTimeString(),
            commentID: uuidv4(),
            likeCount: 0 // initial likeCount is 0
        }

        await socket.emit("commentContent", commentContent)

        dispatch(addComment(commentContent))

        if (column === 'one') {
            setComment1("")
        } else if (column === 'two') {
            setComment2("")
        } else if (column === 'three') {
            setComment3("")
        }
    }

    const deleteCommentAndNotify = async (commentID: string) => {
        dispatch(deleteComment(commentID))
        await socket.emit("deleteComment", { commentID, roomID })
    }

    const handleKeyEnter = (e: any) => {
        if (e.key === 'Enter') {
            sendComment()
        }
    }

    const handleIncrementLike = (commentID: string) => {
        dispatch(incrementLikeCount({ commentID, column }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (column === 'one') {
            setComment1(e.target.value)
        } else if (column === 'two') {
            setComment2(e.target.value)
        } else {
            setComment3(e.target.value)
        }
    }

    // console.log("list1", commentList1)

    const commentList = column === 'one' ? commentList1 : column === 'two' ? commentList2 : commentList3

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex style={{gap: 5}}>
                    {column == 'one' ?  <SmileTwoTone /> : column === 'two' ? <FrownTwoTone />  :  <EditTwoTone />}
                    <Input style={{padding: '10px'}}
                        variant="filled" value={column === 'one' ? comment1 : column === 'two' ? comment2 : comment3}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyEnter}
                        placeholder={column == 'one' ? 'It worked well that...' : column == 'two' ? 'We could improve...' : 'I want to ask about...'}
                    />
                    </Flex>
                       
                </form>

                <div>
                    {commentList.map((comment, index) => (
                        <div key={index} style={{ display: "flex" }}>
                            {userID === comment.userID && (
                                <DeleteTwoTone onClick={() => deleteCommentAndNotify(comment.commentID)}/>
                              
                            )}
                            <div>
                                {
                                    step == 1 ?
                                        userID === comment.userID ? comment.comment + " " + comment.likeCount : <HideInput />
                                        :
                                        comment.comment + " " + comment.likeCount
                                }
                                {/* {userID === comment.userID ? comment.comment + " " + comment.likeCount : <HideInput />} */}
                            </div>
                            {step == 2 && <LikeTwoTone onClick={() => handleIncrementLike(comment.commentID)}/>}
                     
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Topic