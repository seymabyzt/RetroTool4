"use client"

import { useState, useEffect, ChangeEvent, useRef, Key } from "react"
import { useAppDispatch, useAppSelector } from "../redux/store/store"
import { addComment, getComments, deleteComment, incrementLikeCount, updateCommentList } from "../redux/slices/commentList/commentListsSlice"
import { Comment, TopicProps } from "../interfaces/interfaces"
import { v4 as uuidv4 } from 'uuid'
import { SmileTwoTone, FrownTwoTone, EditTwoTone, CheckCircleOutlined } from '@ant-design/icons'
import { Input, Flex } from "antd"
import { toast } from "react-hot-toast"
import CommentItem from "./Atoms/CommentItem"
import { useDrop } from 'react-dnd'
import {
    addDoc,
    collection,
    deleteDoc,
    deleteField,
    doc,
    getFirestore,
    getDoc,
    QuerySnapshot,
    onSnapshot, 
} from "firebase/firestore";
import { db } from "../../firebaseConfig"
import { setcolumnsName } from "../redux/slices/modalSlice/modalSlice"

const Topic = ({ isAdmin, step, column, roomID, socket}: TopicProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const docRef = doc(db, roomID, "columns");
        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setcolumnsName({
                roomID: roomID,
                columns: data.columns
              }));
          } else {
            console.log("No such document!");
          }
        });
      }, [dispatch]);
    
    const firstColumn1 = useAppSelector((state) => state.modal.columns.firstColumn);
    const secondColumn2 =  useAppSelector((state) => state.modal.columns.secondColumn);
    const thirdColumn3 =  useAppSelector((state) => state.modal.columns.thirdColumn);

    const userID: string = localStorage.getItem(roomID + "user")

    const topicStyle = {
        borderRadius: '10px',
        border: "1px solid #9BB0C1",
        padding: "20px",
        minHeight: '90vh',
        backgroundColor: '#f0f5ff'
    }


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
            const updateObj ={ roomID:roomID, column: column, updatedComments: updatedCommentList }
            dispatch(updateCommentList(updateObj));
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

        deleteCommentAndNotify(item, true);
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
    
    let commentList1 = useAppSelector((state) => state.commentList.commentList1)
    let commentList2 = useAppSelector((state) => state.commentList.commentList2)
    let commentList3 = useAppSelector((state) => state.commentList.commentList3)
    let commentList4 = useAppSelector((state) => state.commentList.commentList4)

    let commentList = column === 'one' ? commentList1 : column === 'two' ? commentList2 : column === 'three' ? commentList3 : commentList4

   
      async function getSubCollection() {

        const commentListId = column === 'one' ? "commentList1" : column === 'two' ? "commentList2" : column === 'three' ? "commentList3" : "commentList4"

        useEffect(() => {
            if (commentList == null || commentList.length === 0) {
                const fetchComments = async () => {
                    let firebaseComments: Comment[] = [];
                    const docRef = doc(db, roomID, commentListId);
                    const myDoc = await getDoc(docRef);
                    const commentss = myDoc.data();
                    if (commentss && commentss.comments) {
                        commentss.comments.forEach((selectedComment: any) => {
                            let myComment = selectedComment as Comment;
                            firebaseComments.push(myComment);
                        });
                        const objs = {
                            column: column,
                            comments: firebaseComments,
                        };
                        dispatch(getComments(objs));
                    }
                };
    
                fetchComments().catch((error) =>
                    console.error("Error fetching comments:", error)
                );
            }
        }, [commentListId, column, commentList, db, dispatch]);
  
      }
      
      getSubCollection();

    const [comment1, setComment1] = useState("")
    const [comment2, setComment2] = useState("")
    const [comment3, setComment3] = useState("")
    const [comment4, setComment4] = useState("")
    const [isDisabledInput, setIsDisabledInput] = useState(true)

    useEffect(() => {

        const handleNewComment = (data: Comment) => {
            dispatch(addComment(data))
        }

        const handleDeleteComment = (commentID: Comment) => {
            dispatch(deleteComment(commentID))
        }

        const handleIncrementLikeCount = ({ commentID, column, userID }: {
             commentID: string, column: string, userID: string }) => {
                console.log("here222");
            dispatch(incrementLikeCount({ commentID, column, userID, roomID }));

        }

        const handleUpdatedCommentList = (data: { column: string; updatedComments: Comment[] }) => {
            if (data.column === column) {
                console.log('aaa')
                dispatch(updateCommentList({ roomID: roomID, column, updatedComments: data.updatedComments }));
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
    }, [dispatch])

  

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


        await socket.emit("commentContent", commentContent);
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
    function capitalizeWords(sentence: string) {
        return sentence
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
    const deleteCommentAndNotify = async (comment: Comment, hideAlert: boolean) => {
        let deletedCommentId = comment.commentID;
        let deletedCommentRoomId = comment.roomID
        dispatch(deleteComment(comment))
        await socket.emit("deleteComment", { deletedCommentId, deletedCommentRoomId })

        if (!hideAlert)
            toast.success("Comment is deleted!")
    }

    const handleKeyEnter = (e: any) => {
        if (e.key === 'Enter') {
            sendComment()
        }
    }
    const handleIncrementLike = async (commentID: string) => {

        dispatch(incrementLikeCount({ commentID, column, userID, roomID }));
        console.log('sa')
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
        <>
        <div style={topicStyle}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex style={{ gap: 5 }}>
                        {column == 'one' ? <SmileTwoTone style={iconStyle} twoToneColor="#eb2f96" /> : column === 'two' ? <FrownTwoTone twoToneColor="#eb2f96" style={iconStyle} /> : column === 'three' ? <EditTwoTone style={iconStyle} twoToneColor="#eb2f96" /> : <CheckCircleOutlined style={iconStyle} />}
                        <Input disabled={(column == 'four' && step != 3) || step == 4 && isDisabledInput} style={{ padding: '10px' }}
                            variant="filled" value={column === 'one' ? comment1 : column === 'two' ? comment2 : column === 'three' ? comment3 : comment4}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyEnter}
                            placeholder={column == 'one' ? firstColumn1 : column == 'two' ? secondColumn2 : column == 'three' ? thirdColumn3 : 'Actions'}
                        />
                    </Flex>
                </form>
                <div ref={ref} key={Math.random() * 10000} style={{ minHeight: "400px" }}>
                    {commentList.map((comment: Comment, index: Key | null | undefined) => (
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
        </>
    )
}

export default Topic