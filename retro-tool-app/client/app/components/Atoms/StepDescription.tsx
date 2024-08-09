const StepDescription = ({ step }: { step: number }) => {

    const pStyle: any = {
        fontSize: "12px",
        textAlign: "center",
        backgroundColor: '#f0f5ff',
        margin: "5px 23px",
        borderRadius: 5,
        padding: 3
    }

    const step1Description = "At this step, only you can see what you write. You can delete it here before proceeding to the next step."
    const step2Description = "At this step, you can vote on what is written. Please wait for the admin to group the discussion."
    const step3Description = "At this step, you can add the results of the discussion to the actions."
    const step4Description = "At this step, you can export the results of the discussion."

    const stepDescription = step == 1 ? step1Description : step == 2 ? step2Description : step == 3 ? step3Description : step == 4 &&  step4Description

    return (
        <p style={pStyle}>{stepDescription}</p>
    )
}

export default StepDescription