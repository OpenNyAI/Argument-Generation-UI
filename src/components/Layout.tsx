import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { type CaseProp } from '../prop-types/labelingProps'
import './Layout.css'
import { Button } from '@mui/material'
import Header from './header'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { CustomContext } from '../utilities/CustomContext'

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    borderRadius: '20px', // Adjust the border radius value as needed
    border: 'none',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)', // Adjust the shadow value as needed
    '& .MuiInputBase-input': {
      padding: '10px 12px' // Adjust padding as needed
    }
  }
}))

const Layout: React.FC = () => {
  const contextValue = useContext(CustomContext)
  const navigate = useNavigate()
  // const location = useLocation()
  const [selectedCase, setSelectedCase] = useState<CaseProp | null>(null)
  const [cases, setCases] = useState<CaseProp[]>([])
  const [caseDetails, setCaseDetials] = useState({})

  // const { details } = location.state
  // const accessToken = details.token.access_token as string
  const classes = useStyles()

  const CustomListbox = styled('div')({
    backgroundColor: '#FDF3FF',
    // borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Add or modify the shadow property as needed
  })

  // console.log('in home page', details, process.env.REACT_APP_URL)

  const handleOnSelect = (event: any, newValue: CaseProp | null) => {
    console.log(newValue?.case_name, newValue?.case_id)
    setSelectedCase(newValue)
  }

  const handleNextClick = () => {
    // const facts = content
    try {
      getCaseDetails().catch((error) => { console.log(error) })
    } catch (error) {
      console.log(error)
    }
  }

  const getCaseDetails = async () => {
    const url = process.env.REACT_APP_URL as string
    const bearer = 'Bearer ' + String(contextValue?.accessToken)
    const headers = { Authorization: bearer }
    if (selectedCase !== null) {
      console.log(`${url}/cases/${selectedCase.case_id}`)
      try {
        contextValue?.updateCaseId(selectedCase.case_id)
        const response = await fetch(`${url}/cases/${selectedCase.case_id}`, { headers })
        // console.log('response', response)
        const caseDetails = await response.json()
        console.log('fetching', caseDetails)
        const element = {
          // token: details,
          token: 'sample',
          caseDetails
        }
        navigate('/facts', { state: { element } })
      } catch (error) {
      }
      setCaseDetials(caseDetails)
      // console.log(caseDetails)
    }
  }

  const fetchCases = async () => {
    const url = process.env.REACT_APP_URL as string
    const bearer = 'Bearer ' + String(contextValue?.accessToken)
    const headers = { Authorization: bearer }
    // console.log(bearer)
    try {
      const response = await fetch(`${url}/cases`, { headers }) // Update the URL here
      const caseList = await response.json()
      setCases(caseList)
    } catch (error) {
      console.error('Error fetching cases:', error)
    }
  }

  useEffect(() => {
    fetchCases().catch(error => error as Error)
  }, [])

  return (
    <div>
      <Header isLoginPage={true}/>
      {/* <h3 className='heading'>
      Selection page
        </h3> */}
        <main className='layout' style={{ justifyContent: 'center' }}>
        <div>
    </div>
            <div className='query-area'>
                <Autocomplete
                    options={cases}
                    value={selectedCase}
                    onChange={handleOnSelect}
                    getOptionLabel={(option) => option.case_name}
                    sx={{
                      width: '100%'
                    }}
                    renderInput={(params) => (
                    <TextField {...params} label="Select an option" variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true
                    }}
                    sx={{
                      '&': {
                        left: '4%',
                        margin: '0.4%',
                        width: '93%',
                        paddingBottom: '1%'
                      }
                      // '& .MuiFilledInput-underline:before': {
                      //   borderBottom: 'none'
                      // }
                    }}
                    />
                    )}
                    ListboxComponent={CustomListbox}
                    className={classes.autocomplete}
                />
                <Button onClick={handleNextClick} style={{ color: 'white', backgroundColor: '#DD81F6', height: '14%', margin: '1%', width: '10%', borderRadius: '15px' }} variant="contained">Next</Button>
            </div>
        </main>
    </div>
  )
}

export default Layout
