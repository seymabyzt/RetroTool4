"use client"

import { useEffect, useState } from "react"
import { Button } from "antd"
import { useAppSelector } from "@/app/redux/store/store"

const StepButton = ({ step, setStep }: { step: number, setStep: any }) => {

    const [isDisabledButton, setIsDisabledButton] = useState(true)

    const btnStyle: React.CSSProperties = {
        color: '#fff',
        fontWeight: "bold",
        backgroundColor: isDisabledButton ? '#d9d9d9' : '#364d79',
    }

    const commentList1 = useAppSelector((state) => state.commentList.commentList1)
    const commentList2 = useAppSelector((state) => state.commentList.commentList2)
    const commentList3 = useAppSelector((state) => state.commentList.commentList3)

    useEffect(() => {
        if (commentList1.length > 0 || commentList2.length > 0 || commentList3.length > 0) {
            setIsDisabledButton(false)
        } else {
            setIsDisabledButton(true)
        }
    }, [commentList1, commentList2, commentList3])

    return (
        <Button disabled={isDisabledButton} onClick={() => setStep(step + 1)} style={btnStyle}>
            {step == 1 ? "Group & vote comments" : step == 2 ? "Discuss and add action items" : step == 3 ? 'Finish Retro': 'Export'}
        </Button>
    )
}

export default StepButton