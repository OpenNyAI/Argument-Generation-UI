/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

const Warning = () => {
  const notify = () => toast('Wow so easy!')
  return (
    <div>
        {toast('error')}
      {/* <button onClick={notify}>Notify!</button>
      <ToastContainer /> */}
    </div>
  )
}

export const showToast = (message: string) => {
  console.log('in here warning')
  toast.warning(message)
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error">This is an error alert — check it out!</Alert>
    </Stack>
  )
}

export default Warning
