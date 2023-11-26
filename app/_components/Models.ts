export type User = {
  dp: string;
  username: string;
  password: string;
  crn: string;
  pin: string;
  name: string;
  id: string | null;
  bank: string;
};

export type Capital = {
  id: string;
  name: string;
  code: string;
};

export type CompanyApplication = {
  applicantFormId: number;
  companyName: string;
  companyShareId: number;
  script: string;
  shareGroupName: string;
  shareTypeName: string;
  statusName: string;
  subGroup: string;
};

export type Company = {
  companyName: string;
  companyShareId: number;
  issueCloseDate: string;
  issueOpenDate: string;
  scrip: string;
  shareGroupName: string;
  shareTypeName: string;
  statusName: string;
  subGroup: string;
};

export type Prospectus = {
  clientName: string;
  companyCode: string;
  companyName: string;
  companyShareId: number;
  maxIssueCloseDate: string;
  maxIssueCloseDateStr: string;
  maxUnit: number;
  minIssueOpenDate: string;
  minIssueOpenDateStr: string;
  minUnit: number;
  scrip: string;
  shareGroupName: string;
  sharePerUnit: number;
  shareTypeName: string;
  shareValue: number;
};

export type IpoResult = {
  status: string;
  name: string;
};
