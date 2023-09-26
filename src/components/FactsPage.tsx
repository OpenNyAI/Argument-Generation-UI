/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Header from './header'
import './FactsPage.css'
import Facts from './Facts'
import { type CaseDetailsProp } from '../prop-types/labelingProps'
import { getCase, postCaseDetails } from '../utilities/Api'
import { Button } from '@mui/material'
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

const FactsPage = () => {
  // const location = useLocation()
  const navigate = useNavigate()
  const contextValue = useContext(CustomContext)
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [caseResultsLoaded, setCaseResultsLoaded] = useState(false)
  const [facts, setFacts] = React.useState<string>('')
  //   const [content, setContent] = useState(caseData?.facts ?? '')

  // const { element } = location.state
  const [caseData, setCaseData] = useState<CaseDetailsProp | null>(null)

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const goBack = () => {
    window.history.back()
  }

  const getCaseDetails = React.useCallback(async () => {
    if (!caseResultsLoaded) {
      const result = await getCase(contextValue?.case_id as string, contextValue?.accessToken as string)
      setCaseData(result)
      setCaseResultsLoaded(true)
      //   setContent(result.facts)
      setLoading(false)
    }
  }, [contextValue?.case_id])

  const getFacts = (fact: string) => {
    setFacts(fact)
    if (caseData !== null) {
      caseData.facts = fact
      caseData.facts_edited = true
      caseData.facts_last_updated_at = [new Date()]
    }
    const response = postCaseDetails(caseData as CaseDetailsProp, 'facts', contextValue?.accessToken as string).catch((error) => { console.log(error) })
    console.log('post response:', response)
  }

  const handleNextClick = async () => {
    if (startTime != null) {
      const endTime = Date.now()
      const elapsedTime = endTime - startTime
      setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
      const cumulativeTime = elapsedTime / 1000
      if (caseData !== null) {
        caseData.facts_cumulative_time = cumulativeTime
      }
    }
    if (caseData !== null) {
      if (facts.length !== 0) {
        caseData.facts = facts
        caseData.facts_edited = true
        caseData.facts_last_updated_at = [new Date()]
      } else {
        if (!caseData.facts_edited) {
          caseData.facts_edited = false
        }
        caseData.facts_last_updated_at = [new Date()]
      }
    }

    const response = await postCaseDetails(caseData as CaseDetailsProp, 'facts', contextValue?.accessToken as string).catch((error) => { console.log(error) })

    if (response !== '422') {
      const details = {
        caseData
      }
      navigate('/issues', {
        state: { details }
      })
    }
  }

  React.useEffect(() => {
    if (loading) {
      getCaseDetails().catch((error) => { console.log(error) })
    }
  }, [])

  return (
    <div>
        <Header isLoginPage={true}/>
        <div style={{ }}>
                <div style={{ display: 'flex', marginLeft: '7%', marginTop: '3%' }}>
                  <div style={{ width: '50%' }}>
                    <strong>Case Name: </strong>{caseData?.case_name}
                  </div>
                  <a style={{ position: 'fixed', right: '5%' }} href={caseData?.doc_url} target='_blank' rel="noreferrer">
                  Source: {caseData?.doc_url}
                  </a>
                </div>
        </div>
        <div className='facts-layout'>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Facts" {...a11yProps(0)} />
                    <Tab label="Issues" {...a11yProps(1)} disabled />
                    <Tab label="Statutes" {...a11yProps(2)} disabled />
                    <Tab label="Precedents" {...a11yProps(3)} disabled />
                    <Tab label="Arguments" {...a11yProps(4)} disabled />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {loading
                      ? (<p style={{ color: 'white' }}> Case details Loading</p>
                        )
                      : (
                        <div>
                          <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Click to edit</h5>
                          <Facts caseData={caseData as CaseDetailsProp} getFacts={getFacts}/>
                        </div>
                        )
                        }
                </CustomTabPanel>
            </Box>
            <Button style={{
              backgroundColor: '#DD81F6',
              color: 'white',
              position: 'fixed',
              left: '7%',
              bottom: '7%'
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
              bottom: '7%'
            }}
            onClick={ () => { handleNextClick().catch((error) => { console.log(error) }) }}
            >
              Next
            </Button>
        </div>
        <ToastContainer />
    </div>
  )
}

export default FactsPage
