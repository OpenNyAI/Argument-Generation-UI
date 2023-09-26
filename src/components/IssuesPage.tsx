/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import './Layout.css'
import IssuesPage from './Issues'
import { Button } from '@mui/material'
import { getCase, postCaseDetails } from '../utilities/Api'
import { type ApiProps, type CaseDetailsProp } from '../prop-types/labelingProps'
import { ToastContainer } from 'react-toastify'
import Header from './header'
import './Issues.css'
import { CustomContext } from '../utilities/CustomContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel (props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ overflowY: 'auto', height: '89%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps (index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const Issues = () => {
  const navigate = useNavigate()
  const contextValue = React.useContext(CustomContext)

  const [loading, setLoading] = React.useState(true)
  const [caseData, setCaseData] = React.useState<CaseDetailsProp>()
  const [issues, setIssues] = React.useState<string[]>([])
  const [value, setValue] = React.useState(0)

  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [timeSpent, setTimeSpent] = React.useState<number>(0)

  // Start the timer when the component mounts
  React.useEffect(() => {
    setStartTime(Date.now())
    return () => {
      // Calculate and update the time spent when the component unmounts
      if (startTime != null) {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime
        setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
      }
    }
  }, [])

  const getIssues: (issue: string[]) => void = (issue: string[]) => {
    setIssues(issue)
    caseDetails.issues = issue
    caseDetails.issues_edited = true
    caseDetails.issues_last_updated_at = [new Date()]

    const response = postCaseDetails(caseDetails as CaseDetailsProp, 'issues', contextValue?.accessToken as string).catch((error) => { console.log(error) })
  }

  const getCaseDetails = React.useCallback(async () => {
    const result = await getCase(contextValue?.case_id as string, contextValue?.accessToken as string)
    setCaseData(result)
    // setCaseResultsLoaded(true)
    setLoading(false)
    // }
  }, [contextValue?.case_id])

  React.useEffect(() => {
    getCaseDetails().catch((error) => { console.log(error) })
  }, [value])

  const caseDetails = { ...caseData }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const goBack = () => {
    window.history.back()
  }

  // const notify = () => toast('Wow so easy!')

  const handleNextClick = async () => {
    if (startTime != null) {
      const endTime = Date.now()
      const elapsedTime = endTime - startTime
      setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
      const cumulativeTime = elapsedTime / 1000
      caseDetails.issues_cumulative_time = cumulativeTime
    }

    if (issues.length !== 0) {
      caseDetails.issues = issues
      caseDetails.issues_edited = true
      caseDetails.issues_last_updated_at = [new Date()]
    } else {
      if (caseDetails.issues_edited !== true) {
        caseDetails.issues_edited = false
      }
      caseDetails.issues_last_updated_at = [new Date()]
    }

    const response = await postCaseDetails(caseDetails as CaseDetailsProp, 'issues', contextValue?.accessToken as string).catch((error) => { console.log(error) })

    if (response !== '422') {
      // showToast('The content in is too long. Please go back and summarise the content.....')
      // return response
      // details.caseData = caseDetails
      const details = {
        caseData: caseDetails
      }
      navigate('/statutes', {
        state: { details }
      })
    }
  }

  return (
    <div>
      <Header isLoginPage={true}/>
      <div style={{ }}>
                <div style={{ display: 'flex', marginLeft: '7%', marginTop: '3%' }}>
                    <div style={{ width: '50%' }}>
                    <strong>Case Name: </strong> {caseData?.case_name}
                    </div>
                    <a style={{ position: 'fixed', right: '5%' }} href={caseData?.doc_url} target='_blank' rel="noreferrer">
                    Source: {caseData?.doc_url}
                    </a>
                </div>
      </div>
      <div className='issues-layout'>
          {loading
            ? (
          <p> Case details Loading</p>)
            : (<div>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                      <Tab label="Issues" {...a11yProps(0)} />
                      <Tab label="Facts" {...a11yProps(1)} />
                      <Tab label="Statutes" {...a11yProps(2)} disabled />
                      <Tab label="Precedents" {...a11yProps(3)} disabled />
                      <Tab label="Arguments" {...a11yProps(4)} disabled />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} >
                    <div>
                      <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Click to edit</h5>
                      <IssuesPage case={caseDetails as CaseDetailsProp} getIssues={getIssues} accessToken={contextValue?.accessToken as string}/>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                    <div style={{ whiteSpace: 'pre-wrap', height: '55vh', fontSize: '17.2px' }}>
                      {caseData?.facts}
                    </div>
                </CustomTabPanel>
              </Box>
              <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: '0' }}>
              <Button style={{
                backgroundColor: '#DD81F6',
                color: 'white',
                position: 'fixed',
                left: '7%',
                bottom: '7%',
                borderRadius: '12px'
              }}
            onClick={goBack}
            >
              Back
            </Button>
            <Button style={{
              backgroundColor: '#DD81F6',
              color: 'white',
              position: 'fixed',
              right: '5%',
              bottom: '7%',
              borderRadius: '12px'
            }}
            onClick={ () => { handleNextClick().catch((error) => { console.log(error) }) }}
            >
              Next
            </Button>
            <div>
          <ToastContainer />
        </div>

          </div>
          </div>) }
      </div>

    </div>
  )
}

export default Issues
