import { DeleteTwoTone, LikeTwoTone } from '@ant-design/icons'
import HideInput from './HideInput'
import { CommentItemProps } from '@/app/interfaces/interfaces'
import { Flex, Card } from 'antd'
import { useDrag } from 'react-dnd'
import { useRef } from 'react'

const CommentItem = ({ comment, userID, step, column, deleteCommentAndNotify, handleIncrementLike }: CommentItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, dragRef] = useDrag({
    type: 'COMMENT_ITEM',
    item: { comment, column },
  });
  return (
    <div ref={step === 2 ? dragRef : null} style={{ margin: "10px 0", cursor: step === 2 ? "grabbing" : "default" }}>
      <Card>
        <Flex justify="space-between" align="center">
          <Flex gap={5} style={{ width: "80%", whiteSpace: "wrap", wordBreak: "break-word" }}>
            {userID === comment.userID && step == 1 && (
              <DeleteTwoTone onClick={() => deleteCommentAndNotify(comment.commentID, false)} />
            )}
            {step === 1
              ? userID === comment.userID
                ? comment.comment
                : <HideInput />
              : step === 2
                ? comment.comment + " "
                : comment.comment
            }
          </Flex>
          <Flex gap={5}>
            <span style={{ fontWeight: "bold" }}>{((step === 2 || step === 3) && column !== 'four') && comment.likeCount}</span>
            {step === 2 && column !== 'four' && (
              <LikeTwoTone onClick={() => handleIncrementLike(comment.commentID)} />
            )}
          </Flex>
        </Flex>
      </Card>
    </div>
  )
}

export default CommentItem