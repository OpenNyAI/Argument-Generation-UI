import React, { useState } from 'react'
import { type CaseDetailsProp } from '../prop-types/labelingProps'
import { Button, TextField } from '@mui/material'
import './FactsPage.css'

type GetFactsProp = (sampleParameter: string) => void

interface FactsProps {
  caseData: CaseDetailsProp
  getFacts: GetFactsProp
}

const Facts: React.FC<FactsProps> = ({ caseData, getFacts }) => {
  const [content, setContent] = useState(caseData.facts)
  const [editedContent, setEditedContent] = useState('')
  const [isEditable, setIsEditable] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(event.target.value)
  }

  const handleSaveClick = () => {
    setContent(editedContent)
    setIsEditable(false)
    getFacts(editedContent)
  }

  const handleTextFieldClick = () => {
    console.log('clicked')
    setIsEditable(true)
    setEditedContent(content)
  }

  return (
    <div>
        <div className='facts-content-area'>
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
                        <div style={{ fontSize: '17px' }}>
                            <div className="facts" onClick={handleTextFieldClick}>{content}</div>
                        </div>
                    )
                  : (
                        <div onClick={handleTextFieldClick}>Click here to add issues</div>
                    )
              )}
          </div>
    </div>
  )
}

export default Facts
