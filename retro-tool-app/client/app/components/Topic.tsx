"use client"

import { useState, useEffect, ChangeEvent, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment, deleteComment, incrementLikeCount, updateCommentList } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid'
import { SmileTwoTone, FrownTwoTone, EditTwoTone, CheckCircleOutlined } from '@ant-design/icons'
import { Input, Flex } from "antd"
import { toast } from "react-hot-toast"
import CommentItem from "./Atoms/CommentItem"
import { useDrop } from 'react-dnd'

const Topic = ({ isAdmin, step, column, userID, roomID, socket }: TopicProps) => {

    const topicStyle = {
        borderRadius: '10px',
        border: "1px solid #9BB0C1",
        padding: "20px",
        minHeight: '90vh',
        backgroundColor: '#f0f5ff'
    }
  
    const dispatch = useAppDispatch();

    const moveItemToNewLocation = async (item: any, targetCommentID?: string) => {
        if (targetCommentID) {
            const updatedCommentList = commentList.map(comment => {
                if (comment.commentID === targetCommentID) {
                    return {
                        ...comment,
                        comment: comment.comment + '\n' + item.comment
                    };
                }
                return comment;
            });

            dispatch(updateCommentList({ column, updatedComments: updatedCommentList }));

            await socket.emit("updateCommentContent", { roomID, column, updatedComments: updatedCommentList });

        } else {
            const commentContent: Comment = {
                userID: item.userID,
                comment: item.comment,
                roomID: item.roomID,
                column: column,
                date: item.date,
                commentID: uuidv4(),
                likeCount: item.likeCount,
                likedByUsers: item.likedByUsers
            };

            await socket.emit("commentContent", commentContent);
            dispatch(addComment(commentContent));
        }

        deleteCommentAndNotify(item.commentID, true);
    }

    const [, dropRef] = useDrop({
        accept: 'COMMENT_ITEM',
        drop: (item: any, monitor: any) => {
            const targetComment = monitor.getDropResult();
            if (targetComment && targetComment.commentID) {
                moveItemToNewLocation(item.comment, targetComment.commentID);
            } else {
                moveItemToNewLocation(item.comment);
            }
        },
    });
    const commentList1 = useAppSelector((state) => state.commentList.commentList1)
    const commentList2 = useAppSelector((state) => state.commentList.commentList2)
    const commentList3 = useAppSelector((state) => state.commentList.commentList3)
    const commentList4 = useAppSelector((state) => state.commentList.commentList4)

    const commentList = column === 'one' ? commentList1 : column === 'two' ? commentList2 : column === 'three' ? commentList3 : commentList4

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

        const handleUpdatedCommentList = (data: { column: string; updatedComments: Comment[] }) => {
            if (data.column === column) {
                dispatch(updateCommentList({ column, updatedComments: data.updatedComments }));
            }
        };

        socket.on("commentReturn", handleNewComment)
        socket.on("commentDeleted", handleDeleteComment)
        socket.on("likeCountUpdated", handleIncrementLikeCount)
        socket.on("commentListUpdated", handleUpdatedCommentList)

        return () => {
            socket.off("commentReturn", handleNewComment)
            socket.off("commentDeleted", handleDeleteComment)
            socket.off("likeCountUpdated", handleIncrementLikeCount)
            socket.off("commentListUpdated", handleUpdatedCommentList);
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
        if (!hideAlert)
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
    }

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
    const iconStyle = { fontSize: '25px' }
    const ref = (node: HTMLDivElement | null) => {
        if (node) {
          dropRef(node); 
        }
      };
    return (
        <div style={topicStyle}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex style={{ gap: 5 }}>
                        {column == 'one' ? <SmileTwoTone style={iconStyle} twoToneColor="#eb2f96" /> : column === 'two' ? <FrownTwoTone twoToneColor="#eb2f96" style={iconStyle} /> : column === 'three' ? <EditTwoTone style={iconStyle} twoToneColor="#eb2f96" /> : <CheckCircleOutlined style={iconStyle} />}
                        <Input disabled={(column == 'four' && step != 3) || step == 4 && isDisabledInput} style={{ padding: '10px' }}
                            variant="filled" value={column === 'one' ? comment1 : column === 'two' ? comment2 : column === 'three' ? comment3 : comment4}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyEnter}
                            placeholder={column == 'one' ? 'It worked well that...' : column == 'two' ? 'We could improve...' : column == 'three' ? 'I want to ask about...' : 'Actions'}
                        />
                    </Flex>
                </form>
                <div ref={ref} key={Math.random() * 10000} style={{ minHeight: "400px" }}>
                    {commentList.map((comment, index) => (
                        <CommentItem
                            key={index}
                            isAdmin={isAdmin}
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
        </div>
    )
}

export default Topic