import React from 'react'
import { Comment } from '@/app/interfaces/interfaces'

const ListMap = ({ list }: { list: Comment[] }) => {

    return (
        <div style={{ margin: "15px 0" }}>
            {list.map((comment, index) => (
                <li key={index}>- {comment.comment}</li>
            ))}
        </div>
    )
}

export default ListMap