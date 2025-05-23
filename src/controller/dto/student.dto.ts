export interface StudentBase {
  id?: number;
  studentName: string;
  marks: number;
  age: number;
  password: string;
  profile?: string | null;
  staff_id?: number;
}

export interface StudentDelete extends StudentBase {
  destroy(): void;
}

export type studId = {
  id: number | string;
};

export interface studentStaff extends StudentBase {
  staff?: {
    id: number;
    staffName: string;
    role: string;
    experience: number;
    email: string;
  };
}

export interface studentResponse {
  message: string;
  token?: string;
  error?: Error;
}

export type updatecount = [affectedRows: number];

export interface studentLogData {
  studentName: string;
  password: string;
}
