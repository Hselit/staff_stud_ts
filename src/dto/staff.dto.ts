export interface StaffBase {
  id?: number;
  staffName: string;
  role: string;
  experience: number;
  password: string;
  email: string;
}

export type Staffbase = StaffBase | null;

export interface StaffDelete extends StaffBase {
  destroy(): Promise<void>;
}

export interface StaffStudentResponse extends StaffBase {
  students?: {
    studentName: string;
    age: number;
    marks: number;
  }[];
}

export interface staffStudentRequest extends StaffBase {
  students: {
    studentName: string;
    age: number;
    marks: number;
    password: string;
  };
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
