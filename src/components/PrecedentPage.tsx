import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router-dom'
import { type CasePrecedents, type CaseDetailsProp } from '../prop-types/labelingProps'
import { getCase, postCaseDetails } from '../utilities/Api'
import { Button } from '@mui/material'
import PrecedentForm from './PrecedentForm'
import { ToastContainer } from 'react-toastify'
import './PrecedentPage.css'
import Header from './header'
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

const PrecedentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { details } = location.state
  const contextValue = React.useContext(CustomContext)
  const [value, setValue] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const [caseDetails, setCaseDetails] = React.useState<CaseDetailsProp>()
  const [sectionList, setSectionList] = React.useState<Array<{ section_number: string, act_title: string, reason: string, is_applicable: boolean, description: string }>>(
    []
  )
  const [precedent, setPrecedent] = React.useState<CasePrecedents[]>([])

  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [timeSpent, setTimeSpent] = React.useState<number>(0)
  // console.log('DETAILS', details.sections)

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

  const getCaseDetails = React.useCallback(async () => {
    const result = await getCase(contextValue?.case_id as string, contextValue?.accessToken as string)
    setCaseDetails(result)
    setLoading(false)
  }, [contextValue?.accessToken])

  React.useEffect(() => {
    getCaseDetails().catch((error) => { console.log(error) })
    setSectionList(details.sections)
  }, [])

  const facts = caseDetails?.facts
  const issues = caseDetails?.issues

  const getPrecedents = (updatedList: CasePrecedents[]) => {
    setPrecedent(updatedList)
    if (caseDetails !== undefined) {
      caseDetails.precedents = updatedList
      caseDetails.precedents_edited = true
      caseDetails.precedents_last_updated_at = [new Date()]
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleSaveClick = () => {
    if (caseDetails !== undefined) {
      if (precedent.length !== 0) {
        caseDetails.precedents = precedent
        caseDetails.precedents_edited = true
        caseDetails.precedents_last_updated_at = [new Date()]
      }
      postCaseDetails(caseDetails, 'precedents', contextValue?.accessToken as string).catch((error) => { console.log(error) })
    }
  }

  const checkFunc = (element: CasePrecedents) => {
    return element.paragraphs.length === 0
  }

  const handleNextClick = async () => {
    // const flag1 = true
    const flag = precedent.some(checkFunc)
    // const flag = false
    console.log('flag value', flag)
    console.log('time spent', timeSpent)

    if (!flag) {
      if (caseDetails !== undefined) {
        if (precedent.length !== 0) {
          caseDetails.precedents = precedent
          caseDetails.precedents_edited = true
          caseDetails.precedents_last_updated_at = [new Date()]
        } else {
          caseDetails.precedents_edited = false
          caseDetails.precedents_last_updated_at = [new Date()]
        }
      }

      if (startTime != null) {
        const endTime = Date.now()
        // console.log('Next click end time', startTime, endTime)
        const elapsedTime = endTime - startTime
        // console.log('time spent', elapsedTime)
        setTimeSpent(prevTimeSpent => prevTimeSpent + elapsedTime)
        const cumulativeTime = elapsedTime / 1000
        if (caseDetails !== undefined) {
          caseDetails.precedents_cumulative_time = cumulativeTime
        }
      }

      const response = await postCaseDetails(caseDetails as CaseDetailsProp, 'precedents', contextValue?.accessToken as string).catch((error) => { console.log(error) })
      console.log('in here precedents', response)

      if (response !== '422') {
      // showToast('The content in is too long. Please go back and summarise the content.....')
      // return response
        details.caseData = caseDetails
        navigate('/arguments', { state: { details } })
      }
    } else {
      alert('Please fill all the fields.')
    }
  }

  const goBack = () => {
    window.history.back()
  }

  return (
    <div>
      <Header isLoginPage={true}/>
      <div style={{ }}>
        <div style={{ display: 'flex', marginLeft: '7%', marginTop: '1%' }}>
          <a style={{ position: 'fixed', right: '22%', top: '6%', marginLeft: '5%' }} href={caseDetails?.doc_url} target='_blank' rel="noreferrer">
            Source: {caseDetails?.doc_url}
          </a>
        </div>
      </div>
      <div className='precedent-layout'>
      {loading
        ? (
          <p> Case details Loading...</p>)
        : (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                  <Tab label="Precedents" {...a11yProps(0)} />
                  <Tab label="Statutes" {...a11yProps(1)} />
                  <Tab label="Issues" {...a11yProps(2)} />
                  <Tab label="Facts" {...a11yProps(3)} />
                  <Tab label="Arguments" {...a11yProps(4)} disabled />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div style={{ }}>
                <PrecedentForm caseDetails={caseDetails as CaseDetailsProp} getPrecedents={getPrecedents}/>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                <div className='sectionList' style={{ height: '55vh' }}>
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
              <CustomTabPanel value={value} index={2}>
                <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                <div style={{ height: '55vh' }}>
                  <ul style={{ listStyleType: 'none' }}>
                    {issues?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <h5 style={{ color: '#5E5F60', marginTop: '0px' }}>Non editable</h5>
                <div style={{ whiteSpace: 'pre-wrap', height: '55vh', fontSize: '16px' }}>
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
            <Button onClick={() => { handleNextClick().catch((error) => { console.log(error) }) }}
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
      </div>
      <ToastContainer />
    </div>
  )
}

export default PrecedentPage
