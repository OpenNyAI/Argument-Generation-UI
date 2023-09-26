/* eslint-disable @typescript-eslint/naming-convention */
import { type User, type CaseDetailsProp } from '../prop-types/labelingProps'
import { showToast } from '../components/Warning'

const url = process.env.REACT_APP_URL as string

const postSignup = async (name: string, email: string, affliation: string, password: string) => {
  const formData = new URLSearchParams()
  // formData.append('grant_type', 'password')
  formData.append('name', name)
  formData.append('email', email)
  formData.append('affliation', affliation)
  formData.append('password', password)

  const user: User = {
    name,
    email,
    affliation,
    password
  }

  try {
    const response = await fetch(`${url}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating case details:', error)
  }
}

const postLogin = async (username: string, password: string) => {
  const formData = new URLSearchParams()
  formData.append('grant_type', 'password')
  formData.append('username', username)
  formData.append('password', password)

  try {
    const response = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating case details:', error)
  }
}

const postCaseDetails = async (caseDetails: CaseDetailsProp, name: string, accessToken: string) => {
  console.log('Post call', name)
  // const bearer = 'Bearer ' + accessToken
  // const headers = { Authorization: bearer }

  try {
    const response = await fetch(`${url}/cases/${caseDetails.case_id}/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(caseDetails)
    })
    if (response.status === 422) {
      const data = await response.json()
      showToast(data.detail)
      console.log('post response', data.detail)
      return '422'
    }
    // return response

    const data = await response.json()
    if (data === false) {
      return false
    }
    console.log('Post response: 200')
    return '200'
  } catch (error) {
    console.error('Error updating case details:', error)
  }
}

const getGenerateArgument = async (caseData: CaseDetailsProp, name: string, accessToken: string) => {
  console.log('Generating Arguments')
  const case_id: string = caseData.case_id
  const generate_arguments_for: string = name
  // const petitioner_name: string = caseData.petitioner_name
  // const respondent_name: string = caseData.respondent_name

  const urlArguments: string = `${url}/generate-arguments?case_id=${case_id}&generate_arguments_for=${generate_arguments_for}`
  try {
    const response = await fetch(urlArguments, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      console.error('Request failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error updating case details:', error)
  }
}

const getGenerateIssues = async (caseData: CaseDetailsProp, accessToken: string) => {
  const case_id: string = caseData.case_id
  const urlIssues: string = `${url}/generate-issues?case_id=${case_id}`
  console.log('Generating Issues')

  try {
    const response = await fetch(urlIssues, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.ok) {
      const responseData = await response.json()
      return responseData // Return the response data
    } else {
      console.error('Request failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error updating case details:', error)
  }
}

const getCase = async (caseId: string, accessToken: string) => {
  // const url = process.env.REACT_APP_URL as string
  const bearer = 'Bearer ' + accessToken
  const headers = { Authorization: bearer }
  const response = await fetch(`${url}/cases/${caseId}`, { headers })
  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    throw new Error('Error fetching case details')
  }
}

export { postCaseDetails, getCase, getGenerateArgument, getGenerateIssues, postLogin, postSignup }
