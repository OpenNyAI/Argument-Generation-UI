/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCase, postCaseDetails } from '../utilities/Api'
import { type CaseArguments, type CaseDetailsProp } from '../prop-types/labelingProps'
import { Button } from '@mui/material'
import Header from './header'
import './ArgumentsPage.css'
import ArgumentContainer1 from './ArgumentsContainer'
import { ToastContainer } from 'react-toastify'
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
      style={{ overflowY: 'auto', height: '90%' }}
    >
      {value === index && (
        <Box sx={{ p: 3, overflowY: 'auto' }}>
          <Typography style={{ height: '100%' }}>{children}</Typography>
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

const ArgumentsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const contextValue = React.useContext(CustomContext)

  const { details } = location.state
  const [value, setValue] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [caseData, setCaseData] = React.useState<CaseDetailsProp>()
  const [sectionList, setSectionList] = React.useState<Array<{ section_number: string, act_title: string, reason: string, is_applicable: boolean, description: string }>>(
    []
  )
  const [precedentList, setPrecedentList] = React.useState<Array<{ precedent_name: string, precedent_url: string, paragraphs: string[] }>>([])
  const [petitionerArguments, setPetitionerArguments] = React.useState<string[]>(details.caseData?.petitioner_arguments ?? [])
  const [respondedntArguments, setRespondentArguments] = React.useState<string[]>(details.caseData?.respondent_arguments ?? [])

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

  const handleNextClick = async () => {
    if (caseData !== undefined) {
      if (startTime != null) {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime
        setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
        const cumulativeTime = elapsedTime / 1000
        caseData.respondent_arguments_cumulative_time = cumulativeTime / 2
        caseData.petitioner_arguments_cumulative_time = cumulativeTime / 2
        console.log('time spent', timeSpent)
      }

      if (petitionerArguments.length !== 0) {
        caseData.petitioner_arguments = petitionerArguments
        caseData.petitioner_arguments_edited = true
        caseData.petitioner_arguments_last_updated_at = [new Date()]
      } else {
        caseData.petitioner_arguments_edited = false
        caseData.petitioner_arguments_last_updated_at = [new Date()]
      }

      if (respondedntArguments.length !== 0) {
        caseData.respondent_arguments = respondedntArguments
        caseData.respondent_arguments_edited = true
        caseData.respondent_arguments_last_updated_at = [new Date()]
      } else {
        caseData.respondent_arguments_edited = false
        caseData.respondent_arguments_last_updated_at = [new Date()]
      }
    }

    const response = await postCaseDetails(caseData as CaseDetailsProp, 'arguments', contextValue?.accessToken as string).catch((error) => { console.log(error) })
    console.log('post response:', response)

    if (response === false) {
      alert('Failed to submit, Please review more carefully')
    }

    if (response === '200') {
      navigate('/homepage')
    }
  }

  const getCaseDetails = React.useCallback(async () => {
    const result = await getCase(contextValue?.case_id as string, contextValue?.accessToken as string)
    setCaseData(result)
    setLoading(false)
    setSectionList(result.sections)
    setPrecedentList(result.precedents)
  }, [contextValue?.case_id])

  React.useEffect(() => {
    getCaseDetails().catch((error) => { console.log(error) })
  }, [value])

  const facts = caseData?.facts
  const issues = caseData?.issues

  const goBack = () => {
    window.history.back()
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const getArguments = (update: CaseArguments) => {
    setPetitionerArguments(update.petitionerArgument)
    setRespondentArguments(update.respondentArgument)
    if (caseData !== undefined) {
      caseData.petitioner_arguments = update.petitionerArgument
      caseData.petitioner_arguments_edited = true
      caseData.petitioner_arguments_last_updated_at = [new Date()]

      caseData.respondent_arguments = update.respondentArgument
      caseData.respondent_arguments_edited = true
      caseData.respondent_arguments_last_updated_at = [new Date()]

      caseData.respondent_arguments_cumulative_time = 0
      caseData.petitioner_arguments_cumulative_time = 0
      console.log('cumulative time seconds', caseData.respondent_arguments_cumulative_time)
    }
    postCaseDetails(caseData as CaseDetailsProp, 'arguments', contextValue?.accessToken as string).catch((error) => { console.log(error) })
  }

  return (
    <div>
        <Header isLoginPage={true}/>
        <div style={{ }}>
                <div style={{ display: 'flex', marginLeft: '8%', marginTop: '1%' }}>
                  <div style={{ width: '50%' }}>
                    <strong>Case Name: </strong>{caseData?.case_name}
                  </div>
                  <a style={{ position: 'fixed', right: '9%' }} href={caseData?.doc_url} target='_blank' rel="noreferrer">
                  Source: {caseData?.doc_url}
                  </a>
                </div>
        </div>
        <div className='arguments-layout'>
        {loading
          ? (
          <p> Case details Loading...</p>)
          : (
            <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Arguments" {...a11yProps(0)} />
                    <Tab label="Precedents" {...a11yProps(1)} />
                    <Tab label="Statutes" {...a11yProps(2)} />
                    <Tab label="Issues" {...a11yProps(3)} />
                    <Tab label="Facts" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ArgumentContainer1 caseData={caseData as CaseDetailsProp} getArguments={getArguments} accessToken={contextValue?.accessToken as string}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div style={{ marginBottom: '10px' }}>
                  <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                  <div className='sectionList'>
                    { precedentList.map((item, index) =>
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '5%', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>
                          Precedent Name:
                        </label>
                        <div>{item.precedent_name}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>
                          Precedent Link:
                        </label>
                        <div>{item.precedent_url}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '9.4%', marginBottom: '7px' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>
                        Paragraphs:
                        </label>
                        <div>{item.paragraphs}</div>
                      </div>
                      <div>
                        <hr style={{ color: 'black' }}/>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                <div className='sectionList'>
                  {sectionList.map((item, index) =>
                    (item.is_applicable &&
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '5%', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                          <label style={{ fontWeight: 'bold', width: '150px' }}>
                            Section No:
                          </label>
                          <div>{item.section_number}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                          <label style={{ fontWeight: 'bold', width: '150px' }}>
                            Act:
                          </label>
                          <div>{item.act_title}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                          <label style={{ fontWeight: 'bold', width: '150px' }}>
                            Section Definition:
                          </label>
                          <div>{item.description}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '5%', marginBottom: '7px' }}>
                          <label style={{ fontWeight: 'bold', width: '150px' }}>
                            Reason:
                          </label>
                          <div>{item.reason}</div>
                        </div>
                        <div>
                        <hr style={{ color: 'black' }}/>
                        </div>
                      </div>
                    )
                  )}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <div>
                <ul style={{ listStyleType: 'none' }}>
                  {issues?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <div style={{ whiteSpace: 'pre-wrap', height: '60vh', fontSize: '17.2px' }}>
                      {facts}
              </div>
            </CustomTabPanel>
            </Box>
            )}
          <Button onClick={goBack}
            style={{
              backgroundColor: '#DD81F6',
              color: 'white',
              position: 'fixed',
              left: '12%',
              bottom: '5%',
              borderRadius: '12px'
            }}>
            Back
          </Button>
          <Button onClick={() => { handleNextClick().catch((error) => { console.log(error) }) }}
          style={{
            backgroundColor: '#DD81F6',
            color: 'white',
            position: 'fixed',
            right: '12%',
            bottom: '5%',
            borderRadius: '12px'
          }}>
            Finish
          </Button>
        </div>
        <ToastContainer />
    </div>
  )
}

export default ArgumentsPage
