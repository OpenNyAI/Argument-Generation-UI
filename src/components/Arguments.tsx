/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { type GenerateArgumentApiProps, type CaseDetailsProp, type CaseArguments, type CaseArgumentsProps } from '../prop-types/labelingProps'
import { getGenerateArgument } from '../utilities/Api'

interface ArgumentProps {
  title: string
  argumentContent: string[]
  caseData: CaseDetailsProp
  getArguments: GetArgumentProp
}

type GetArgumentProp = (updated: CaseArguments) => void

interface ArgumentContainerProps {
  caseData: CaseDetailsProp
  getArguments: GetArgumentProp
}

const Argument: React.FC<ArgumentProps> = ({ title, argumentContent, caseData, getArguments }) => {
  const [content, setContent] = useState<string[]>(argumentContent)
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    if (argumentContent !== undefined) {
      setContent(argumentContent)
      setEditedContent(argumentContent?.join('\n'))
    }
  }, [argumentContent])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(event.target.value)
  }

  const handleSaveClick = () => {
    setContent(editedContent.split('\n'))
    setIsEditable(false)
    if (title === 'Petitioner Arguments') {
      const update = {
        petitionerArgument: editedContent.split('\n'),
        respondentArgument: caseData.respondent_arguments
      }
      getArguments(update)
    }
    if (title === 'Respondent Arguments') {
      const update = {
        petitionerArgument: caseData.petitioner_arguments,
        respondentArgument: editedContent.split('\n')
      }
      getArguments(update)
    }
  }

  const handleTextFieldClick = () => {
    setIsEditable(true)
    setEditedContent(content.join('\n'))
  }

  return (
  <div style={{ overflow: 'auto', width: '100%', height: '60vh', marginBottom: '15px' }}>
    <h2 style={{ textAlign: 'center' }}>{title}</h2>
    <div>
      {isEditable
        ? (
          <div style={{ fontSize: '18px' }}>
              <TextField
                multiline
                rows={17}
                variant="outlined"
                className="content-input"
                value={editedContent}
                onChange={handleInputChange}
                InputProps={{
                  disableUnderline: true
                }}
                style={{ border: 'none', height: '55vh', fontSize: '18px' }}
              />
              <Button variant="contained" onClick={handleSaveClick} style={{ backgroundColor: '#DD81F6', color: 'white', margin: '10px', position: 'fixed', right: '16%', bottom: '4%', borderRadius: '10%' }}>
                Save Changes
              </Button>
            </div>
          )
        : (
            content?.length > 0
              ? (
            <div onClick={handleTextFieldClick} style={{ fontSize: '17.2px' }}>
              <ul>
                {content.map((item, index) => (
                  <li key={index} style={{ whiteSpace: 'pre-wrap' }}>{item}</li>
                ))}
              </ul>
            </div>
                )
              : (
            <div onClick={handleTextFieldClick}>Click here to add arguments</div>
                )
          )
      }
    </div>
  </div>
  )
}

const ArgumentsContainer: React.FC<ArgumentContainerProps> = ({ caseData, getArguments }) => {
  const [petitionerArguments, setPetitionerArguments] = useState<string[]>(caseData?.petitioner_arguments ?? [])
  const [respondentArguments, setRespondentArguments] = useState<string[]>(caseData?.respondent_arguments ?? [])
  const [isLoadingPetitioner, setIsLoadingPetitioner] = useState(false)
  const [isLoadingRespondent, setIsLoadingRespondent] = useState(false)

  useEffect(() => {
    setPetitionerArguments(caseData?.petitioner_arguments)
    setRespondentArguments(caseData?.respondent_arguments)
  }, [caseData])

  const handleGenerateArgumentPetitioner = () => {
    setIsLoadingPetitioner(true)
    const caseInfo = {
      caseData,
      name: 'petitioners'
    }

    getGenerateArgument(caseData, 'respondent', 'a')
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

  const handleGenerateArgumentRespondent = () => {
    setIsLoadingRespondent(true)

    const caseInfo = {
      caseData,
      name: 'respondent'
    }
    getGenerateArgument(caseData, 'respondent', 'a')
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
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95%' }}>
    <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-around', width: '95%' }}>
      <Argument title="Petitioner Arguments" argumentContent={isLoadingPetitioner ? ['Loading. Please wait....'] : petitionerArguments} caseData={caseData} getArguments={getArguments}/>
      <Argument title="Respondent Arguments" argumentContent={isLoadingRespondent ? ['Loading. Please wait....'] : respondentArguments} caseData={caseData} getArguments={getArguments}/>
    </div>
    <div>
      <Button style={{ margin: '0 10px', backgroundColor: 'white', color: 'black', width: '200px' }} onClick={handleGenerateArgumentPetitioner}>{isLoadingPetitioner ? 'Loading...' : 'Generate Arguments Petitioner'}</Button>
      <Button style={{ margin: '0 10px', backgroundColor: 'white', color: 'black', width: '200px' }} onClick={handleGenerateArgumentRespondent}>{isLoadingRespondent ? 'Loading...' : 'Generate Arguments Respondent'}</Button>
    </div>
  </div>
  )
}

export default Argument
