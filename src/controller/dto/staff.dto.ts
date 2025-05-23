export interface StaffBase {
  id?: number;
  staffName: string;
  role: string;
  experience: number;
  password: string;
  email: string;
}

export interface StaffDelete extends StaffBase {
  destroy(): Promise<void>;
}

export interface StaffStudentData extends StaffBase {
  students?: {
    studentName: string;
    age: number;
    marks: number;
  }[];
}

export type staffLoginRequest = {
  staffName: string;
  password: string;
};

export type staffId = {
  id: number;
};

export type updateStaffData = Partial<StaffBase>;

export type updatecount = [affectedRows: number];

export type emailRequest = {
  email: string;
  type: string;
};

export interface staffResponse {
  message: string;
  error?: Error;
  token?: string;
}
