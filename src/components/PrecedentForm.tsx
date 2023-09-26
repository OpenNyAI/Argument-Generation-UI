import { Button, TextField } from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@mui/styles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { type CaseDetailsProp, type CasePrecedents } from '../prop-types/labelingProps'

type GetPrecedentProp = (updatedList: CasePrecedents[]) => void

interface PrecedentsProp {
  caseDetails: CaseDetailsProp
  getPrecedents: GetPrecedentProp
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFilledInput-root': {
      background: '#F3D7FB'
    }
  }
}))

const PrecedentForm: React.FC<PrecedentsProp> = ({ caseDetails, getPrecedents }) => {
  const listRef = useRef<HTMLDivElement>(null)
  const classes = useStyles()
  const [precedents, setPrecedents] = useState<CasePrecedents[]>([])
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView()
  }, [precedents.length])

  useEffect(() => {
    if (caseDetails?.precedents !== undefined) {
      setPrecedents(caseDetails?.precedents)
    }
  }, [caseDetails])

  const handleAddPrecedent = () => {
    setPrecedents([...precedents, { precedent_name: '', precedent_url: '', paragraphs: [] }])
  }

  const handleDeletePrecedent = (index: number) => {
    const newPrecedents = [...precedents]
    newPrecedents.splice(index, 1)
    setPrecedents(newPrecedents)
  }

  const handleChange = (index: number, field: string, value: string) => {
    const newPrecedents = [...precedents]
    newPrecedents[index] = { ...newPrecedents[index], [field]: value }
    console.log(field)
    setPrecedents(newPrecedents)
    getPrecedents(newPrecedents)
  }

  const handleChangeParagraph = (index: number, value: string) => {
    const newPrecedents = [...precedents]
    if (value === '') {
      console.log('empty list')
      newPrecedents[index] = { ...newPrecedents[index], paragraphs: [] }
    } else {
      newPrecedents[index] = { ...newPrecedents[index], paragraphs: [value] }
    }
    setPrecedents(newPrecedents)
    getPrecedents(newPrecedents)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <strong>Case Name: {caseDetails?.case_name}</strong>
      <div ref={listRef} style={{ height: '65vh', overflowY: 'auto', marginTop: '20px' }}>
      {precedents.map((precedent, index) => (
        <div key={index} style={{ display: 'flex', gap: '8%', flexDirection: 'column', marginLeft: '8%', marginBottom: '4%' }}>
          <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '100px' }}>
            <label style={{ marginRight: '10px' }}>
              Precedent Name:
            </label>
            <TextField
              id="standard-basic"
              variant="filled"
              type="text"
              value={precedent.precedent_name}
              onChange={(e) => { handleChange(index, 'precedent_name', e.target.value) }}
              className={classes.root}
              fullWidth={true}
              InputProps={{
                disableUnderline: true
              }}
              style={{ width: '70%' }}
            />
          </div>
          <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '105px' }}>
            <label style={{ marginRight: '20px' }}>
              Precedent Link:
            </label>
            <TextField
              id="standard-basic"
              // label="link"
              variant="filled"
              value={precedent.precedent_url}
              onChange={(e) => { handleChange(index, 'precedent_url', e.target.value) }}
              className={classes.root}
              fullWidth={true}
              InputProps={{
                disableUnderline: true
              }}
              style={{ width: '70%' }}
            />
          </div>
          <div style={{ marginBottom: '2%', display: 'flex', alignItems: 'center', gap: '62px' }}>
            <label style={{ marginRight: '10px' }}>
              Precedent paragraphs:
            </label>
            <TextField
              id="standard-multiline-static"
              multiline
              rows={4}
              variant="filled"
              value={precedent.paragraphs}
              onChange={(e) => { handleChangeParagraph(index, e.target.value) }}
              className={classes.root}
              fullWidth={true}
              InputProps={{
                disableUnderline: true
              }}
              style={{ width: '70%' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" color="error" onClick={() => { handleDeletePrecedent(index) }}
            style={{ width: '20px' }}
            >
              <DeleteForeverIcon style={{ height: '25px', width: 'auto' }}/>
            </Button>
          </div>
          <hr />
        </div>
      ))}
      </div>
      <Button onClick={handleAddPrecedent} style={{ color: 'black', margin: '10px' }}>
        <AddCircleOutlineIcon style={{ width: 'auto', height: '30px' }}/>
      </Button>
    </div>
  )
}

export default PrecedentForm
