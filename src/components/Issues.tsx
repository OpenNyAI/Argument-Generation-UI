/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import './IssuesPage.css'
import './Layout.css'
import './FactsPage.css'
import { Button, TextField } from '@mui/material'
import { type CaseDetailsProp } from '../prop-types/labelingProps'
import { getGenerateIssues } from '../utilities/Api'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

type GetIssueProp = (sampleParameter: string[]) => void

interface IssuesProps {
  case: CaseDetailsProp
  getIssues: GetIssueProp
  accessToken: string
}

const IssuesPage: React.FC<IssuesProps> = ({ case: caseData, getIssues, accessToken }) => {
  const [content, setContent] = useState<string[]>(caseData?.issues)
  const [editedContent, setEditedContent] = useState<string>(content.join('\n'))
  const [isEditable, setIsEditable] = useState(false)
  const [generateIssue, setgenerateIssue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(event.target.value)
  }

  const handleTextFieldClick = () => {
    setIsEditable(true)
    setEditedContent(content.join('\n'))
  }

  const handleSaveClick = () => {
    setContent(editedContent.split('\n'))
    setIsEditable(false)
    getIssues(editedContent.split('\n'))
  }

  const handleGenerateIssues = () => {
    setIsLoading(true)

    getGenerateIssues(caseData, accessToken)
      .then((result) => {
        const splitContent = result.split('\n')
        setgenerateIssue(result)
        setContent(splitContent)
        getIssues(splitContent)
        setIsLoading(false)
        setEditedContent(splitContent) // Assuming setEditedContent exists
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
        <div>
          <div className='issues-content-area'>
            {isLoading
              ? <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
                  <CircularProgress />
                </Box>
              : <div>
              {isEditable
                ? (
              <>
                <TextField
                  multiline
                  rows={20}
                  variant="outlined"
                  className="content-input"
                  value={editedContent}
                  onChange={handleInputChange}
                  InputProps={{
                    disableUnderline: true
                  }}
                />
                <Button variant="contained" onClick={handleSaveClick} style={{ backgroundColor: '#DD81F6', color: 'white', margin: '10px', position: 'fixed', right: '9%', bottom: '6%' }}>
                  Save Changes
                </Button>
              </>
                  )
                : (
                    content.length > 0
                      ? (
              <div onClick={handleTextFieldClick} style={{ fontSize: '17.2px' }}>
                <ul style={{ listStyleType: 'none' }}>
                  {content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
                        )
                      : (
              <div onClick={handleTextFieldClick}>Click here to add issues</div>
                        )
                  )}
              </div>}
          </div>

          <Button style={{ display: 'flex', left: '45%', backgroundColor: '#DD81F6', color: 'white', position: 'absolute', bottom: '20%', borderRadius: '15px' }} onClick={handleGenerateIssues}>
            {isLoading ? 'Loading Issues...' : 'Generate Issues'}
          </Button>
</div>
  )
}

export default IssuesPage
