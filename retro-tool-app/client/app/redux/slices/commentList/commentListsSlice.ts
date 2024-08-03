import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CommentListProps {
    userID: string,
    comment: string;
    roomID: string;
    column: string;
    date: string;
    commentID: string
}

interface CommentListState {
    commentList1: CommentListProps[];
    commentList2: CommentListProps[];
    commentList3: CommentListProps[];
}

const initialState: CommentListState = {
    commentList1: [],
    commentList2: [],
    commentList3: []
}

export const commentListsSlice = createSlice({
    name: "commentLists",
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<CommentListProps>) => {
            const { column, ...comment } = action.payload;

            // Map column names to state keys
            const listMap: Record<string, keyof CommentListState> = {
                one: 'commentList1',
                two: 'commentList2',
                three: 'commentList3'
            };

            const listKey = listMap[column];
            if (listKey) {
                state[listKey].push(action.payload);
            }
        }
    }
})

export default commentListsSlice.reducer
export const { addComment } = commentListsSlice.actions
