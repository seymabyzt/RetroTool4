import React from 'react'
import { Comment } from '@/app/interfaces/interfaces'

const ListMap = ({ list }: { list: Comment[] }) => {

    return (
        <div style={{ margin: "15px 0" }}>
            {list.map((comment, index) => (
                <span key={index}>- {comment.comment}</span>
            ))}
        </div>
    )
}

export default ListMap