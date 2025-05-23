export interface EmailData {
  id: number;
  type: string;
  subject: string;
  html: string;
  cc?: string;
}

export interface HtmlData {
  id: string;
  type: string;
  content: string;
}

export type emailType = {
  type: string;
};

export type sendEmail = {
  type: string;
  to: string;
  from: string;
};

export interface emailResponse {
  message: string;
  info: {
    response: string;
    envelope: {
      from: string;
      to: string;
    };
    messageId: string;
  };
}

export interface errorResponse {
  message: string;
  error?: Error | undefined;
}
