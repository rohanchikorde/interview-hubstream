
export type CandidateStatus = 'New' | 'Shortlisted' | 'Interviewed' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  resume_url?: string;
  skills?: string[];
  status: CandidateStatus;
  requirement_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCandidateRequest {
  full_name: string;
  email: string;
  resume_url?: string;
  requirement_id: string;
  status?: CandidateStatus;
}

export interface UpdateCandidateStatus {
  status: CandidateStatus;
}
