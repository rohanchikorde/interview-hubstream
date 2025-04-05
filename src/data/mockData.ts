
export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  dateAdded: string;
  interviewsCount: number;
}

export interface Interviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

export interface InterviewStats {
  total: number;
  upcoming: number;
  completed: number;
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    industry: 'Technology',
    address: '123 Tech Lane, Silicon Valley, CA 94123',
    contactPerson: 'John Doe',
    email: 'john@acme.com',
    phone: '555-1234',
    dateAdded: '2024-02-15',
    interviewsCount: 5
  },
  {
    id: '2',
    name: 'Globex Industries',
    industry: 'Manufacturing',
    address: '456 Factory Ave, Detroit, MI 48201',
    contactPerson: 'Jane Smith',
    email: 'jane@globex.com',
    phone: '555-5678',
    dateAdded: '2024-01-20',
    interviewsCount: 8
  },
  {
    id: '3',
    name: 'Oceanic Airlines',
    industry: 'Transportation',
    address: '789 Sky Blvd, Atlanta, GA 30301',
    contactPerson: 'Robert Johnson',
    email: 'robert@oceanic.com',
    phone: '555-9012',
    dateAdded: '2024-03-05',
    interviewsCount: 3
  },
  {
    id: '4',
    name: 'Initech Solutions',
    industry: 'Information Technology',
    address: '101 Office Park, Austin, TX 78701',
    contactPerson: 'Michael Bolton',
    email: 'michael@initech.com',
    phone: '555-3456',
    dateAdded: '2024-02-28',
    interviewsCount: 12
  }
];

export const mockInterviewers: Record<string, Interviewer[]> = {
  '1': [
    { id: '101', name: 'Alice Chen', email: 'alice@acme.com', role: 'HR Manager', companyId: '1' },
    { id: '102', name: 'Bob Wilson', email: 'bob@acme.com', role: 'Technical Lead', companyId: '1' },
    { id: '103', name: 'Carol Davis', email: 'carol@acme.com', role: 'Senior Developer', companyId: '1' }
  ],
  '2': [
    { id: '201', name: 'David Miller', email: 'david@globex.com', role: 'HR Director', companyId: '2' },
    { id: '202', name: 'Emily White', email: 'emily@globex.com', role: 'Engineering Manager', companyId: '2' }
  ],
  '3': [
    { id: '301', name: 'Frank Lopez', email: 'frank@oceanic.com', role: 'HR Specialist', companyId: '3' },
    { id: '302', name: 'Grace Kim', email: 'grace@oceanic.com', role: 'Department Head', companyId: '3' }
  ],
  '4': [
    { id: '401', name: 'Henry Adams', email: 'henry@initech.com', role: 'HR Coordinator', companyId: '4' },
    { id: '402', name: 'Irene Garcia', email: 'irene@initech.com', role: 'Project Manager', companyId: '4' },
    { id: '403', name: 'Jack Thompson', email: 'jack@initech.com', role: 'Team Lead', companyId: '4' }
  ]
};

export const mockInterviewStats: Record<string, InterviewStats> = {
  '1': { total: 10, upcoming: 3, completed: 7 },
  '2': { total: 15, upcoming: 5, completed: 10 },
  '3': { total: 8, upcoming: 2, completed: 6 },
  '4': { total: 20, upcoming: 8, completed: 12 }
};
