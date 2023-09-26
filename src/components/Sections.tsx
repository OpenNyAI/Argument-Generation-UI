import React, { useEffect, useState, useRef } from 'react'
import { type SectionsProp, type CaseSection } from '../prop-types/labelingProps'
import { Button, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFilledInput-root': {
      background: '#F3D7FB'
    }
  }
}))

const Sections: React.FC<SectionsProp> = ({ caseData, getSections }) => {
  const classes = useStyles()
  const listRef = useRef<HTMLDivElement>(null)

  const [sectionList, setSectionList] = useState<Array<{ section_number: string, act_title: string, reason: string, is_applicable: boolean, description: string }>>(
    caseData?.sections
  )
  // console.log('section list', sectionList)
  const [newSection, setNewSection] = useState<string>('')
  const [newReason, setNewReason] = useState<string>('')
  const [newActTitle, setNewActTitle] = useState<string>('')
  const [newDescription, setNewDescription] = useState<string>('')
  const [newApplicable, setNewApplicable] = useState<boolean>(true)

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView()
  }, [sectionList.length])

  useEffect(() => {
    if (caseData?.sections !== undefined) {
      setSectionList(caseData.sections)
    }
  }, [caseData])

  const handleSectionChange = (index: number, value: string) => {
    const updatedList = [...sectionList]
    updatedList[index].section_number = value
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleApplicableChange = (index: number, value: boolean) => {
    const updatedList = [...sectionList]
    updatedList[index].is_applicable = value
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleReasonChange = (index: number, value: string) => {
    const updatedList = [...sectionList]
    updatedList[index].reason = value
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleActTileChange = (index: number, value: string) => {
    const updatedList = [...sectionList]
    updatedList[index].act_title = value
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleActDescriptionChange = (index: number, value: string) => {
    const updatedList = [...sectionList]
    updatedList[index].description = value
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleDeleteSection = (index: number) => {
    const updatedList = [...sectionList]
    updatedList.splice(index, 1)
    setSectionList(updatedList)
    getSections(updatedList)
  }

  const handleAddItem = () => {
    const newItem: CaseSection = { section_number: newSection, reason: newReason, act_title: newActTitle, is_applicable: newApplicable, description: newDescription }
    const updatedList = [...sectionList, newItem]
    setSectionList(updatedList)
    setNewSection('')
    setNewReason('')
    setNewActTitle('')
    setNewDescription('')
    setNewApplicable(false)
    getSections(updatedList)

    // listRef.current?.lastElementChild?.scrollIntoView()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
      <strong>Case Name: {caseData?.case_name}</strong>
      <div ref={listRef} style={{ height: '65vh', overflowY: 'auto', marginTop: '10px' }}>
        {sectionList.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '8%', flexDirection: 'column', marginLeft: '8%', marginBottom: '1%' }}>
          <div style={{ marginBottom: '2%' }}>
            <label style={{ marginRight: '7%' }}>
                  <strong> Applicable: </strong>
            </label>
            <input
              type="checkbox"
              checked={item.is_applicable}
              onChange={(e) => {
                handleApplicableChange(index, e.target.checked)
              }}
              style={{ marginTop: '10px' }}
            />
          </div>
              <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '5%' }}>
                <label style={{ marginRight: '10px', width: '100px' }}>
                    Section No:
                </label>
                <TextField
                    id="standard-basic"
                    // label="Name"
                    variant="filled"
                    type="text"
                    value={item.section_number}
                    onChange={(e) => { handleSectionChange(index, e.target.value) }}
                    className={classes.root}
                    fullWidth={true}
                    InputProps={{
                      disableUnderline: true
                    }}
                    style={{ width: '70%' }}
                />
              </div>
              <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '5%' }}>
                <label style={{ marginRight: '10px', width: '100px' }}>
                    Act:
                </label>
                <TextField
                    id="standard-basic"
                    // label="Name"
                    variant="filled"
                    type="text"
                    value={item.act_title}
                    onChange={(e) => { handleActTileChange(index, e.target.value) }}
                    style={{ width: '70%' }}
                    className={classes.root}
                    fullWidth={true}
                    InputProps={{
                      disableUnderline: true
                    }}
                />
              </div>
              <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '5%' }}>
                <label style={{ marginRight: '10px', width: '100px' }}>
                    Section Definition:
                </label>
                <TextField
                    id="standard-basic"
                    // label="Name"
                    variant="filled"
                    type="text"
                    value={item.description}
                    onChange={(e) => { handleActDescriptionChange(index, e.target.value) }}
                    style={{ width: '70%' }}
                    multiline={true}
                    rows={4}
                    className={classes.root}
                    fullWidth={true}
                    InputProps={{
                      disableUnderline: true
                    }}
                />
              </div>
              <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '5%' }}>
                <label style={{ marginRight: '10px', width: '100px' }}>
                    Reason:
                </label>
                <TextField
                    id="standard-basic"
                    // label="Name"
                    variant="filled"
                    type="text"
                    value={item.reason}
                    onChange={(e) => { handleReasonChange(index, e.target.value) }}
                    style={{ width: '70%' }}
                    multiline={true}
                    rows={5}
                    className={classes.root}
                    fullWidth={true}
                    InputProps={{
                      disableUnderline: true
                    }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button variant="contained" color="error" onClick={() => { handleDeleteSection(index) }}
                  style={{ width: '20px' }}
                >
                  <DeleteForeverIcon style={{ height: '25px', width: 'auto' }}/>
                </Button>
          </div>
        </div>
        ))}
      </div>

      {/* <h4 style={{ marginBottom: '2px' }}>Add section</h4> */}
      {/* <div style={{ display: 'flex', gap: '10px', width: '90%', marginTop: '2px' }}>
        <input
          type="text"
          value={newSection}
          onChange={(e) => { setNewSection(e.target.value) }}
          style={{ width: '46%', backgroundColor: '#222324', color: 'white', border: 'none', marginBottom: '5px', height: '40px' }}
        />
        <input
          type="text"
          value={newActTitle}
          onChange={(e) => { setNewActTitle(e.target.value) }}
          style={{ width: '46%', backgroundColor: '#222324', color: 'white', border: 'none', marginBottom: '5px', height: '40px' }}
        />
        <input
          type="text"
          value={newReason}
          onChange={(e) => { setNewReason(e.target.value) }}
          style={{ width: '46%', backgroundColor: '#222324', color: 'white', border: 'none', marginBottom: '5px', height: '40px' }}
        />
      </div> */}
        <Button onClick={handleAddItem} style={{ }}>
          <AddCircleOutlineIcon style={{ width: 'auto', height: '30px' }}/>
        </Button>
    </div>
  )
}

export default Sections
