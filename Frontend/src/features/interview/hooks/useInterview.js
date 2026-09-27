import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useState } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [ error, setError ] = useState(null)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile, title }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
                title
            })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to generate interview report."
            setError(errMsg)
            console.error("generateReport error:", err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const errMsg = err.response?.data?.message || "Interview report not found."
            setError(errMsg)
            console.error("getReportById error:", err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports || [])
            return response.interviewReports
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to fetch interview reports."
            setError(errMsg)
            console.error("getReports error:", err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            return true
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to generate resume PDF."
            setError(errMsg)
            console.error("getResumePdf error:", err)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, setError, report, setReport, reports, setReports, generateReport, getReportById, getReports, getResumePdf }
}