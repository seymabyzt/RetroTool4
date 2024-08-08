import { DeleteTwoTone, LikeTwoTone } from '@ant-design/icons'
import HideInput from './HideInput'
import { CommentItemProps } from '@/app/interfaces/interfaces'
import { Flex } from 'antd'
import {useDrag} from 'react-dnd'
import { useRef } from 'react'

const CommentItem = ({ comment, userID, step, column, deleteCommentAndNotify, handleIncrementLike }: CommentItemProps) => {
  const ref= useRef<HTMLDivElement>(null);
  const[, dragRef] = useDrag({
    type: 'COMMENT_ITEM',
    item: {comment, column},
  });
  return (
    <div ref={dragRef} style={{ borderBottom: "1px solid #9BB0C1", padding: "10px", margin: "10px 0" }}>
      <Flex justify="space-between" align="center">
        <div style={{ width: "100%", whiteSpace: "wrap", wordBreak: "break-word" }}>
          {userID === comment.userID && step == 1 && (
            <DeleteTwoTone onClick={() => deleteCommentAndNotify(comment.commentID,false)} />
          )}
          {step === 1
            ? userID === comment.userID
              ? comment.comment
              : <HideInput />
            : step === 2
              ? comment.comment + " "
              : comment.comment
          }
        </div>
        <div>
          {((step === 2 || step === 3) && column !== 'four') && comment.likeCount}
          {step === 2 && column !== 'four' && (
            <LikeTwoTone onClick={() => handleIncrementLike(comment.commentID)} />
          )}
        </div>
      </Flex>
    </div>
  )
}

export default CommentItem