"use client"

import { useEffect, useState } from "react"
import { Button } from "antd"
import { useAppSelector } from "@/app/redux/store/store"
import { DownloadOutlined } from "@ant-design/icons"

const StepButton = ({ step, setStep, exportPdfFunc, isAdmin }: { step: number, setStep: any, exportPdfFunc: any, isAdmin: boolean }) => {

    const [isDisabledButton, setIsDisabledButton] = useState(true)

    const btnStyle: React.CSSProperties = {
        color: '#fff',
        fontWeight: "bold",
        backgroundColor: isDisabledButton ? '#d9d9d9' : '#eb2f96',
    }

    const commentList1 = useAppSelector((state) => state.commentList.commentList1)
    const commentList2 = useAppSelector((state) => state.commentList.commentList2)
    const commentList3 = useAppSelector((state) => state.commentList.commentList3)
    const commentList4 = useAppSelector((state) => state.commentList.commentList4)

    useEffect(() => {
        if ((commentList1.length > 0 || commentList2.length > 0 || commentList3.length > 0 || commentList4.length > 0) && isAdmin) {
            setIsDisabledButton(false)
        } else {
            setIsDisabledButton(true)
        }
    }, [commentList1, commentList2, commentList3])

    const handleStepIncrement = () => {
        if (step < 4) {
            setStep(step + 1)
        }
        else {
            exportPdfFunc()
        }
    }

    return (
        <Button disabled={isDisabledButton} onClick={handleStepIncrement} style={btnStyle}>
            {step > 3 && <DownloadOutlined />}
            {step == 1 ? "Pass To Step #2" : step == 2 ? "Pass To Step #3" : step == 3 ? 'Finish Retro' : 'Export'}
        </Button>
    )
}

export default StepButton