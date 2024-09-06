import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, CommentListState } from '@/app/interfaces/interfaces'
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
    getDoc,
    query, where,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig"



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
            state.commentList1 = state.commentList1.filter((comment) => comment.commentID !== action.payload.commentID)
            state.commentList2 = state.commentList2.filter((comment) => comment.commentID !== action.payload.commentID)
            state.commentList3 = state.commentList3.filter((comment) => comment.commentID !== action.payload.commentID)
            state.commentList4 = state.commentList4.filter((comment) => comment.commentID !== action.payload.commentID)

            const listKey = listMap[action.payload.column]

            var docRef = doc(db, action.payload.roomID, listKey);
            setDoc(docRef,
                { comments: state[listKey] }
            );


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

            var docRef = doc(db, roomID, listKey);
            setDoc(docRef,
                { comments: state[listKey] }
            );


        }
    }
})

export default commentListsSlice.reducer
export const { addComment, deleteComment, incrementLikeCount, getComments, updateCommentList } = commentListsSlice.actions