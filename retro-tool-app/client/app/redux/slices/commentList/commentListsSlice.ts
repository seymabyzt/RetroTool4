import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, CommentListState } from '@/app/interfaces/interfaces'

const initialState: CommentListState = {
    commentList1: [],
    commentList2: [],
    commentList3: []
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
                three: 'commentList3'
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
        }
    }
})

export default commentListsSlice.reducer
export const { addComment, deleteComment } = commentListsSlice.actions