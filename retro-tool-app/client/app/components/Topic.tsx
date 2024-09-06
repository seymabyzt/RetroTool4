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
    onSnapshot,
    setDoc,
    getDocs,
    updateDoc,
    query, where,
    getDoc,
    documentId,
    DocumentData,
    QuerySnapshot, 
} from "firebase/firestore";
import { db } from "../../firebaseConfig"

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
    // const moveItemOutOfGroup = async (item: any, parentCommentID: string) => {
    //     // Parent yorumunu bulup içerisinden belirli bir alt yorumu çıkartacağız
    //     const updatedCommentList = commentList.map(comment => {
    //         if (comment.commentID === parentCommentID) {
    //             const splitComments = comment.comment.split('\n');
    //             const remainingComments = splitComments.filter(c => c !== item.comment);

    //             return {
    //                 ...comment,
    //                 comment: remainingComments.join('\n')  // Yorumdan çıkardıktan sonra kalan yorumlar
    //             };
    //         }
    //         return comment;
    //     });

    //     dispatch(updateCommentList({ column, updatedComments: updatedCommentList }));

    //     await socket.emit("updateCommentContent", { roomID, column, updatedComments: updatedCommentList });

    //     const independentComment: Comment = {
    //         userID: item.userID,
    //         comment: item.comment,
    //         roomID: item.roomID,
    //         column: column,
    //         date: item.date,
    //         commentID: uuidv4(),
    //         likeCount: item.likeCount,
    //         likedByUsers: item.likedByUsers
    //     };

    //     dispatch(addComment(independentComment));

    //     await socket.emit("commentContent", independentComment);

    //     console.log("Yorum başarıyla gruptan çıkarıldı ve bağımsız olarak eklendi.");
    // };

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


        if(commentList == null || commentList.length == 0){
            let firebaseComments = [];
            const docRef = doc(db, roomID, commentListId);
            getDoc(docRef).then((myDoc) => {
                var commentss = myDoc.data();
             if (commentss!= undefined && commentss != null && Array.isArray(commentList))
             {
                commentss.comments.forEach((selectedComment:any) =>{
                    let myComment = selectedComment as Comment;
                    firebaseComments.push(myComment);
                })
                const objs={
                    column: column, comments: firebaseComments
                }
                dispatch(getComments(objs));
             }
            });
             
      
        }
  
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
    }, [socket, dispatch])

    // useEffect(() => {
    //     const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    //         event.preventDefault();
    //         event.returnValue = '';
    //         console.log("Sayfa kapatılıyor, buraya istediğiniz işlemi yapabilirsiniz.");
    //     };
    //     const handleUnload = () => {
    //         alert("Sayfa kapatılıyor, buraya istediğiniz işlemi yapabilirsiniz.");
    //         //Firebase den roomId sil
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     window.addEventListener('unload', handleUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //         window.removeEventListener('unload', handleUnload);
    //     };
    // }, []);

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
                            placeholder={column == 'one' ? 'It worked well that...' : column == 'two' ? 'We could improve...' : column == 'three' ? 'I want to ask about...' : 'Actions'}
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