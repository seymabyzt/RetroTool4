import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, CommentListState } from '@/app/interfaces/interfaces'
import {
    doc,
    setDoc
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig"
import { v4 as uuidv4 } from 'uuid'

const initialState: CommentListState = {
    commentList1: [],
    commentList2: [],
    commentList3: [],
    commentList4: []
}
const listMap: Record<string, keyof CommentListState> = {
    one: 'commentList1',
    two: 'commentList2',
    three: 'commentList3',
    four: 'commentList4'
}
export const commentListsSlice = createSlice({
    name: "commentLists",
    initialState,
    reducers: {
        getComments: (state, action: PayloadAction<{
            column: string, comments: Comment[]
        }>) => {
            const listKey = listMap[action.payload.column]
            state[listKey] = action.payload.comments;
        },
        addComment: (state, action: PayloadAction<Comment>) => {
            const { column, roomID } = action.payload
            const listKey = listMap[column]
            const exists = state[listKey].some(comment => comment.commentID === action.payload.commentID)
            if (listKey && !exists) {
                state[listKey].push(action.payload)
            }
            var docRef = doc(db, roomID, listKey);
            setDoc(docRef,
                { comments: state[listKey] }
            );
        },
        deleteComment: (state, action: PayloadAction<Comment>) => {
            console.log("deleteComment Payload:", action.payload.roomID);
            const { roomID, column, commentID } = action.payload;
            state.commentList1 = state.commentList1.filter((c) => c.commentID !== commentID)
            state.commentList2 = state.commentList2.filter((c) => c.commentID !== commentID)
            state.commentList3 = state.commentList3.filter((c) => c.commentID !== commentID)
            state.commentList4 = state.commentList4.filter((c) => c.commentID !== commentID)
           
            const listKey = listMap[column]
            if (!roomID) {
                console.warn("RoomID is empty, skipping Firestore doc update.");
                return;
              }
              if (!listKey) {
                console.warn("listKey is empty, skipping Firestore doc update.");
                return;
              }
              
              var docRef = doc(db, roomID, listKey);
              setDoc(docRef, { comments: state[listKey] });
        },
        incrementLikeCount(state, action: PayloadAction<{
            [x: string]: any; commentID: string, column: string, userID: string, roomID: string
        }>) {
            const { commentID, column, userID, roomID } = action.payload;

            let commentList: any;
            if (column === 'one') {
                commentList = state.commentList1;
            } else if (column === 'two') {
                commentList = state.commentList2;
            } else if (column === 'three') {
                commentList = state.commentList3;
            } else if (column === 'four') {
                commentList = state.commentList4;
            }
            const comment = commentList?.find((commentt: any) => commentt.commentID === commentID);
            if (comment) {
                if (!comment.likedByUsers?.includes(userID)) {
                    comment.likeCount += 1;
                    comment.likedByUsers?.push(userID);
                }
            }
            const listKey = listMap[action.payload.column]

            var docRef = doc(db, action.payload.roomID, listKey);
            setDoc(docRef,
                { comments: state[listKey] }
            );

        },

        updateCommentList: (state, action: PayloadAction<{ roomID: string, column: string, updatedComments: Comment[] }>) => {
            const { column, roomID, updatedComments } = action.payload;
            const listMap: Record<string, keyof CommentListState> = {
                one: 'commentList1',
                two: 'commentList2',
                three: 'commentList3',
                four: 'commentList4'
            };
           
            const listKey = listMap[column];
            if (listKey) {
                state[listKey] = updatedComments;
            }
            if (!roomID) {
                console.warn("RoomID is empty, skipping Firestore doc update.");
                return;
              }
            if (!listKey) {
                console.warn("listKey is empty, skipping Firestore doc update.");
                return;
              }
              state[listKey] = updatedComments.filter(comment => comment !== undefined && comment.comment.trim() !== '');

              const docRef = doc(db, roomID, listKey);
              setDoc(docRef, { comments: state[listKey] }).catch(error => {
                console.error("Firestore update failed:", error);
              });
        },
        groupComments: (state, action: PayloadAction<{
            draggedCommentID: string;
            targetCommentID: string;
            column: string;
            roomID?: string; 
        }>) => {
            const { draggedCommentID, targetCommentID, column, roomID } = action.payload;
            const listKey = listMap[column];

            if (!listKey) return;
            const commentList = state[listKey];

            const targetIndex = commentList.findIndex((c) => c.commentID === targetCommentID);
            const draggedIndex = commentList.findIndex((c) => c.commentID === draggedCommentID);

            if (targetIndex === -1 || draggedIndex === -1) return;

            const targetComment = commentList[targetIndex];
            const draggedComment = commentList[draggedIndex];

            const groupId = targetComment.groupId || uuidv4();

            targetComment.groupId = groupId;
            draggedComment.groupId = groupId;

            if (roomID) {
                const docRef = doc(db, roomID, listKey);
                setDoc(docRef, { comments: commentList });
            }
        },

        ungroupComment: (state, action: PayloadAction<{
            commentID: string;
            column: string;
            roomID?: string;
        }>) => {
            const { commentID, column, roomID } = action.payload;
            const listKey = listMap[column];

            if (!listKey) return;

            const commentList = state[listKey];
            const idx = commentList.findIndex((c) => c.commentID === commentID);
            if (idx !== -1) {
                commentList[idx].groupId = null;
            }

            if (roomID) {
                const docRef = doc(db, roomID, listKey);
                setDoc(docRef, { comments: commentList });
            }
        },
    }
})

export default commentListsSlice.reducer
export const { addComment, deleteComment, incrementLikeCount, getComments, updateCommentList,
    groupComments, 
    ungroupComment 
 } = commentListsSlice.actions