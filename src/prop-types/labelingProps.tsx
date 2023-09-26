import { type ReactNode } from 'react'

interface CaseDetailsProp {
  case_id: string
  doc_url: string
  editor_id: string
  case_name: string
  facts: string
  petitioner_arguments: string[]
  respondent_arguments: string[]
  petitioner_name: string
  respondent_name: string
  facts_edited: boolean
  facts_last_updated_at: Date[]
  facts_cumulative_time: number
  // facts_reviewed: boolean

  issues: string[]
  issues_edited: boolean
  issues_last_updated_at: Date[]
  issues_cumulative_time: number
  // issues_reviewed: bool = False

  sections: Array<{ section_number: string, act_title: string, reason: string, is_applicable: boolean, description: string }>
  sections_edited: boolean
  sections_last_updated_at: Date[]
  sections_cumulative_time: number
  // sections_reviewed: bool = False

  precedents: Array<{ precedent_name: string, precedent_url: string, paragraphs: string[] }>
  precedents_edited: boolean
  precedents_last_updated_at: Date[]
  precedents_cumulative_time: number
  // precedents_reviewed: bool = False

  petitioner_arguments_edited: boolean
  petitioner_arguments_last_updated_at: Date[]
  petitioner_arguments_cumulative_time: number
  // petitioner_arguments_reviewed: bool = False

  respondent_arguments_edited: boolean
  respondent_arguments_last_updated_at: Date[]
  respondent_arguments_cumulative_time: number
  // respondent_arguments_reviewed: bool = False

  // case_id: string
  // case_name: string
  // case_type: string
  // court_name: string
  // court_type: string
  // doc_url: string
  // raw_text: string
  // doc_size: number
  // facts: string
  // facts_edited: boolean
  // facts_last_updated_at: Date
  // facts_cumulative_time: number
  // facts_reviewed: boolean
  // issues: string[]
  // issues_edited: boolean
  // issues_last_updated_at: List[datetime] = []
  // issues_cumulative_time: int = 0
  // issues_reviewed: bool = False
  // generated_issues: str = ''
  // sections: List[CaseSection] = []
  // sections_edited: bool = False
  // sections_last_updated_at: List[datetime] = []
  // sections_cumulative_time: int = 0
  // sections_reviewed: bool = False
  // precedents: List[CasePrecedent] = []
  // precedents_edited: bool = False
  // precedents_last_updated_at: List[datetime] = []
  // precedents_cumulative_time: int = 0
  // precedents_reviewed: bool = False
  // petitioner_arguments: List[str] = []
  // petitioner_arguments_edited: bool = False
  // petitioner_arguments_last_updated_at: List[datetime] = []
  // petitioner_arguments_cumulative_time: int = 0
  // petitioner_arguments_reviewed: bool = False
  // petitioner_generated_arguments: str = ''
  // respondent_arguments: List[str] = []
  // respondent_arguments_edited: bool = False
  // respondent_arguments_last_updated_at: List[datetime] = []
  // respondent_arguments_cumulative_time: int = 0
  // respondent_arguments_reviewed: bool = False
  // respondent_generated_arguments: str = ''
  // is_completed: bool = False
}

interface CaseProp {
  case_id: string
  case_name: string
}

interface LoginProps {
  username: string
  password: string
}
interface Case {
  caseData: CaseDetailsProp
}

interface ApiProps {
  caseDetails: CaseDetailsProp
  name: string
}

interface GenerateArgumentApiProps {
  caseData: CaseDetailsProp
  name: string
}

interface GenerateIssuesApiProps {
  caseData: CaseDetailsProp
}

interface CaseSection {
  section_number: string
  act_title: string
  reason: string
  is_applicable: boolean
  description: string
}

interface CaseArguments {
  petitionerArgument: string[]
  respondentArgument: string[]
}

interface CaseArgumentsProps {
  update: CaseArguments
}

interface CasePrecedents {
  precedent_name: string
  precedent_url: string
  paragraphs: string[]
}

interface SectionsProp {
  caseData: CaseDetailsProp
  getSections: GetSectionsProp
}

interface User {
  name: string
  email: string
  affliation: string
  password: string
}

interface CustomContextProps {
  children: ReactNode
}

type GetSectionsProp = (updatedList: CaseSection[]) => void

export type { CaseProp, CaseDetailsProp, Case, ApiProps, CaseSection, SectionsProp, CasePrecedents, GenerateArgumentApiProps, GenerateIssuesApiProps, CaseArguments, CaseArgumentsProps, LoginProps, User, CustomContextProps }

// {
//   "library_id": "123",
//   "case_id": "456",
//   "editor_id": "789",
//   "case_name": "Sample Vs Sample1",
//   "facts": "Lorem ipsum dolor sit amet sample edit",
//   "issues": [
//       "This is a sample issue",
//       "this another sample issue 2"
//   ],
//   "sections": [
//       {
//           "section": "section1",
//           "act_title": "act 1",
//           "reason": "reason1"
//       },
//       {
//           "section": "section2",
//           "act_title": "act 2",
//           "reason": "reason2"
//       }
//   ]
// }

// TODO ADD ISSUES EDITED LAST UPDATED TIME ETC FOR EVERYTHING
