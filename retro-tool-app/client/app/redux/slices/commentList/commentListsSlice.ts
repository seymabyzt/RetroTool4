import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, CommentListState } from '@/app/interfaces/interfaces'

const initialState: CommentListState = {
    commentList1: [],
    commentList2: [],
    commentList3: [],
    commentList4: []
}

export const commentListsSlice = createSlice({
    name: "commentLists",
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<Comment>) => {
            const { column } = action.payload

            const listMap: Record<string, keyof CommentListState> = {
                one: 'commentList1',
                two: 'commentList2',
                three: 'commentList3',
                four: 'commentList4'
            }

            const listKey = listMap[column]
            const exists = state[listKey].some(comment => comment.commentID === action.payload.commentID)
            if (listKey && !exists) {
                state[listKey].push(action.payload)
            }
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            state.commentList1 = state.commentList1.filter((comment) => comment.commentID !== action.payload)
            state.commentList2 = state.commentList2.filter((comment) => comment.commentID !== action.payload)
            state.commentList3 = state.commentList3.filter((comment) => comment.commentID !== action.payload)
            state.commentList4 = state.commentList4.filter((comment) => comment.commentID !== action.payload)
        },
        incrementLikeCount(state, action: PayloadAction<{ commentID: string, column: string, userID: string }>) {
            const { commentID, column, userID } = action.payload;

            let commentList: any;
            if (column === 'one') {
                commentList = state.commentList1;
            } else if (column === 'two') {
                commentList = state.commentList2;
            } else if (column === 'three') {
                commentList = state.commentList3;
            }
            else if (column === 'four') {
                commentList = state.commentList4;
            }

            const comment = commentList?.find((comment: any) => comment.commentID === commentID);
            if (comment) {
                if (!comment.likedByUsers?.includes(userID)) {
                    comment.likeCount += 1;
                    comment.likedByUsers?.push(userID);
                }
            }
        },
        updateCommentList: (state, action: PayloadAction<{ column: string, updatedComments: Comment[] }>) => {
            const { column, updatedComments } = action.payload;
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
        }
    }
})

export default commentListsSlice.reducer
export const { addComment, deleteComment, incrementLikeCount, updateCommentList } = commentListsSlice.actions