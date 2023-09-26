import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Argument from './Arguments'
import { type CaseArguments, type CaseDetailsProp } from '../prop-types/labelingProps'
import { getCase, getGenerateArgument } from '../utilities/Api'
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

type GetArgumentProp = (updated: CaseArguments) => void

interface ArgumentContainerProps {
  caseData: CaseDetailsProp
  getArguments: GetArgumentProp
  accessToken: string
}

function TabPanel (props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

const ArgumentContainer1: React.FC<ArgumentContainerProps> = ({ caseData, getArguments, accessToken }) => {
  const [value, setValue] = React.useState(0)
  const [isLoadingPetitioner, setIsLoadingPetitioner] = React.useState(false)
  const [isLoadingRespondent, setIsLoadingRespondent] = React.useState(false)

  const [petitionerArguments, setPetitionerArguments] = React.useState<string[]>(caseData?.petitioner_arguments ?? [])
  const [respondentArguments, setRespondentArguments] = React.useState<string[]>(caseData?.respondent_arguments ?? [])

  React.useEffect(() => {
    setPetitionerArguments(caseData?.petitioner_arguments)
    // setRespondentArguments(caseData?.respondent_arguments)
  }, [caseData])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleGenerateArgumentPetitioner = () => {
    setIsLoadingPetitioner(true)

    getGenerateArgument(caseData, 'petitioners', accessToken)
      .then((result) => {
        setPetitionerArguments([result])
        setIsLoadingPetitioner(false)
        caseData.petitioner_arguments = result
        const update = {
          petitionerArgument: [result], // Corrected property name
          respondentArgument: respondentArguments // Corrected property name
        }
        setIsLoadingPetitioner(false)
        getArguments(update)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const getCaseDetails = React.useCallback(async () => {
    const result = await getCase(caseData.case_id, accessToken)
    setPetitionerArguments(result.petitioner_arguments)
    setRespondentArguments(result.respondent_arguments)
  }, [caseData.case_id])

  React.useEffect(() => {
    getCaseDetails().catch((error) => { console.log(error) })
  }, [value])

  const handleGenerateArgumentRespondent = () => {
    setIsLoadingRespondent(true)

    getGenerateArgument(caseData, 'respondent', accessToken)
      .then((result) => {
        setRespondentArguments([result])
        setIsLoadingRespondent(false)
        caseData.respondent_arguments = [result]
        setIsLoadingRespondent(false)
        const update = {
          petitionerArgument: petitionerArguments, // Corrected property name
          respondentArgument: [result] // Corrected property name
        }

        getArguments(update)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 700 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        // aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', alignContent: 'center' }}
      >
        <Tab label="Petitioner " {...a11yProps(0)} />
        <Tab label="Respondent" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div style={{ width: '120vh', height: '65vh' }}>
            {isLoadingPetitioner
              ? <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap', height: '60vh' }}>
                  <CircularProgress />
                </Box>
              : <Argument title="Petitioner Arguments" argumentContent={petitionerArguments} caseData={caseData} getArguments={getArguments}/>
            }
            {/* <Argument title="Petitioner Arguments" argumentContent={isLoadingPetitioner ? ['Loading. Please wait....'] : petitionerArguments} caseData={caseData} getArguments={getArguments}/> */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button style={{ }} variant="contained" onClick={handleGenerateArgumentPetitioner}>{isLoadingPetitioner ? 'Loading...' : 'Generate Arguments'}</Button>
            </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div style={{ width: '120vh', height: '65vh' }}>
          {isLoadingRespondent
            ? <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap', height: '60vh' }}>
                <CircularProgress />
              </Box>
            : <Argument title="Respondent Arguments" argumentContent={respondentArguments} caseData={caseData} getArguments={getArguments}/>
        }
        {/* <Argument title="Respondent Arguments" argumentContent={isLoadingRespondent ? ['Loading. Please wait....'] : respondentArguments} caseData={caseData} getArguments={getArguments}/> */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button style={{ }} variant="contained" onClick={handleGenerateArgumentRespondent}>{isLoadingRespondent ? 'Loading...' : 'Generate Arguments'}</Button>
        </div>
        </div>
      </TabPanel>
    </Box>
  )
}

export default ArgumentContainer1
