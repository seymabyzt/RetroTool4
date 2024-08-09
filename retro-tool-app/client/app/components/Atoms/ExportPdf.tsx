import { usePDF } from 'react-to-pdf'
import { Comment } from '@/app/interfaces/interfaces'
import { useAppSelector } from '@/app/redux/store/store'
import ListMap from './ListMap'
import StepButton from './StepButton'

const ExportPdf = ({ step, setStep, isAdmin }: { step: number, setStep: any, isAdmin: boolean }) => {

    const { toPDF, targetRef } = usePDF({ filename: 'RetroTool.pdf' })

    const commentList1: Comment[] = useAppSelector((state) => state.commentList.commentList1)
    const commentList2: Comment[] = useAppSelector((state) => state.commentList.commentList2)
    const commentList3: Comment[] = useAppSelector((state) => state.commentList.commentList3)
    const commentList4: Comment[] = useAppSelector((state) => state.commentList.commentList4)

    const handleExportPdf = () => {
        toPDF()
    }

    return (
        <div>
            <StepButton step={step} setStep={setStep} exportPdfFunc={handleExportPdf} isAdmin={isAdmin} />
            <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
                <h1 style={{ marginBottom: "20px", textAlign: "center" }}>RetroTool</h1>
                <ListMap list={commentList1} />
                <ListMap list={commentList2} />
                <ListMap list={commentList3} />
                <ListMap list={commentList4} />
            </div>
        </div>
    )
}

export default ExportPdf