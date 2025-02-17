'use client'
import { DeleteTwoTone, LikeTwoTone } from '@ant-design/icons'
import HideInput from './HideInput'
import { CommentItemProps } from '@/app/interfaces/interfaces'
import { Flex, Card, Button } from 'antd'
import { useDrag, useDrop } from 'react-dnd'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/app/redux/store/store'
import { ungroupComment } from '@/app/redux/slices/commentList/commentListsSlice'

const CommentItem = ({ isAdmin, comment, userID, step, column, socket, deleteCommentAndNotify, handleIncrementLike }: CommentItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleUngroup = () => {
    dispatch(ungroupComment({
      commentID: comment.commentID,
      column: comment.column,
      roomID: comment.roomID
    }));
    socket.emit("ungroupComment", {
      commentID: comment.commentID,
      column: comment.column,
      roomID: comment.roomID
    });
  }
  const [, dragRef] = useDrag({
    type: 'COMMENT_ITEM',
    canDrag: () => (step === 2 || step === 3) && isAdmin,
    item: { comment, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'COMMENT_ITEM',
    drop: (droppedItem: any) => {

      if (droppedItem.comment.commentID !== comment.commentID) {
        return {
          commentID: comment.commentID,
        };
      }
      return null;
    },
  });

  dragRef(dropRef(ref));

  return (
    <div ref={ref} style={{ cursor: ((step === 2 || step === 3) && isAdmin) ? "grabbing" : "default" }}>
      <Card>
        <Flex justify="space-between" align="center">
          <Flex gap={5} style={{ width: "80%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {userID === comment.userID && step === 1 && (
              <DeleteTwoTone twoToneColor="#eb2f96" onClick={() => deleteCommentAndNotify(comment, false)} />
            )}
            {step > 1 ? (
              <>
                {step === 1
                  ? userID === comment.userID ? comment.comment : <HideInput />
                  : comment.comment
                }
              </>
            )
              : (
                <>
                  {step === 1
                    ? userID === comment.userID ? comment.comment : <HideInput />
                    : comment.comment
                  }
                </>
              )
            }
            {/* {comment.groupId && (
        <Button size="small" onClick={handleUngroup}>
          Ungroup
        </Button>
      )} */}
          </Flex>
          <Flex gap={5}>
            <span style={{ fontWeight: "bold" }}>{((step === 2 || step === 3) && column !== 'four') && comment.likeCount}</span>
            {step === 2 && column !== 'four' && (
              <LikeTwoTone twoToneColor="#eb2f96" onClick={() => handleIncrementLike(comment.commentID)} />
            )}
          </Flex>
        </Flex>
      </Card>
    </div>
  )
}

export default CommentItem
