import { DeleteTwoTone, LikeTwoTone } from '@ant-design/icons'
import HideInput from './HideInput'
import { Comment, CommentItemProps } from '@/app/interfaces/interfaces'

const CommentItem = ({ comment, userID, step, column, deleteCommentAndNotify, handleIncrementLike }: CommentItemProps) => {
  return (
    <div style={{ display: "flex" }}>
      {userID === comment.userID && step !== 4 && (
        <DeleteTwoTone onClick={() => deleteCommentAndNotify(comment.commentID)} />
      )}
      <div>
        {step === 1
          ? userID === comment.userID
            ? comment.comment
            : <HideInput />
          : step === 2
            ? comment.comment + " " + comment.likeCount
            : comment.comment}
      </div>
      {step === 2 && column !== 'four' && (
        <LikeTwoTone onClick={() => handleIncrementLike(comment.commentID)} />
      )}
    </div>
  )
}

export default CommentItem