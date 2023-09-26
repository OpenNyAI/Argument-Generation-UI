import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Sections from './Sections'
import { type CaseSection, type CaseDetailsProp } from '../prop-types/labelingProps'
import { getCase, postCaseDetails } from '../utilities/Api'
import { ToastContainer } from 'react-toastify'
import Header from './header'
import './Statutes.css'
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

const Statutes = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const contextValue = React.useContext(CustomContext)
  const { details } = location.state

  const [value, setValue] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [caseData, setCaseData] = React.useState<CaseDetailsProp>(details.caseData)
  const [section, setSection] = React.useState<CaseSection[]>(details.caseData.sections)

  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [timeSpent, setTimeSpent] = React.useState<number>(0)

  // console.log('details', section)

  React.useEffect(() => {
    setStartTime(Date.now())
    return () => {
      if (startTime != null) {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime
        setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
      }
    }
  }, [])

  const getSections = (updatedList: CaseSection[]) => {
    setSection(updatedList)
  }

  const handleSaveClick = () => {
    if (caseData !== undefined) {
      caseData.sections = section
      caseData.sections_edited = true
      caseData.sections_last_updated_at = [new Date()]
    }
    postCaseDetails(caseData, 'sections', contextValue?.accessToken as string).catch((error) => { console.log(error) })
  }

  const getCaseDetails = React.useCallback(async () => {
    const result = await getCase(contextValue?.case_id as string, contextValue?.accessToken as string)
    setCaseData(result)
    setLoading(false)
  }, [contextValue?.case_id])

  React.useEffect(() => {
    getCaseDetails().catch((error) => { console.log(error) })
  }, [value])

  const facts = caseData?.facts
  const issues = caseData?.issues

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const goBack = () => {
    window.history.back()
  }

  const checkFunc = (element: CaseSection) => {
    console.log(element.act_title.length)
    return (element.act_title.length === 0)
  }

  const handleNextClick = () => {
    // const flag = false
    // console.log(section)
    const flag = section.some(checkFunc)
    console.log(section, flag)
    console.log('Time spent in page', timeSpent)

    if (!flag) {
      if (startTime != null) {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime
        setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
        const cumulativeTime = elapsedTime / 1000
        if (caseData !== undefined) {
          caseData.sections_cumulative_time = cumulativeTime
        }
      }

      if (caseData !== undefined) {
        if (section.length !== 0) {
          caseData.sections = section
          caseData.sections_edited = true
          caseData.sections_last_updated_at = [new Date()]
        } else {
          caseData.sections_edited = false
          caseData.sections_last_updated_at = [new Date()]
        }
      }

      postCaseDetails(caseData, 'sections', contextValue?.accessToken as string).catch((error) => { console.log(error) })
      // details.caseData = caseData
      navigate('/precedent', {
        state: { details: caseData }
      })
    } else {
      alert('Please fill all the fields.')
    }
  }

  return (
    <div>
      <Header isLoginPage={true}/>
      <div style={{ }}>
        <div style={{ display: 'flex', marginLeft: '7%', marginTop: '1%' }}>
          <a style={{ position: 'fixed', right: '22%', top: '6%', marginLeft: '5%' }} href={caseData?.doc_url} target='_blank' rel="noreferrer">
            Source: {caseData?.doc_url}
          </a>
        </div>
      </div>
      <div className='statues-layout'>
      {loading
        ? (
          <p> Case details Loading...</p>)
        : (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
              <Tab label="Statutes" {...a11yProps(0)} />
              <Tab label="Issues" {...a11yProps(1)} />
              <Tab label="Facts" {...a11yProps(2)} />
              <Tab label="Precedents" {...a11yProps(3)} disabled />
              <Tab label="Arguments" {...a11yProps(4)} disabled />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Sections caseData={caseData} getSections={getSections}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
            <div>
            <ul style={{ listStyleType: 'none', fontSize: '17.2px' }}>
              {issues?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
            <div style={{ whiteSpace: 'pre-wrap', height: '55vh', fontSize: '16.2px' }}>
                      {facts}
            </div>
          </CustomTabPanel>
        </Box>
          )}
        <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: '0' }}>
          <Button onClick={goBack}
            style={{
              backgroundColor: '#DD81F6',
              color: 'white',
              position: 'fixed',
              left: '24%',
              bottom: '7%',
              borderRadius: '12px'
            }}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSaveClick} style={{
            backgroundColor: '#DD81F6',
            color: 'white',
            margin: '10px',
            position: 'fixed',
            right: '28%',
            bottom: '6%',
            borderRadius: '12px'
          }}>
                  Save Changes
          </Button>
          <Button onClick={handleNextClick}
          style={{
            backgroundColor: '#DD81F6',
            color: 'white',
            position: 'fixed',
            right: '24%',
            bottom: '7%',
            borderRadius: '12px'
          }}>
            Next
          </Button>
        </div>
        <ToastContainer />
      </div>
    </div>
  )
}

export default Statutes
