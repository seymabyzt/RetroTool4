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
        },
        incrementLikeCount(state, action: PayloadAction<{ commentID: string, column: string }>) {
            const { commentID, column } = action.payload
            
            let commentList: any
            if (column === 'one') {
                commentList = state.commentList1;
            } else if (column === 'two') {
                commentList = state.commentList2;
            } else if (column === 'three') {
                commentList = state.commentList3;
            }

            const comment = commentList.find((comment: any) => comment.commentID === commentID);
            if (comment) {
                comment.likeCount += 1;
            }
        }
    }
})

export default commentListsSlice.reducer
export const { addComment, deleteComment, incrementLikeCount } = commentListsSlice.actions