export interface IErrorResponse {
  status?: string,
  message: string,
  data?: any
}

export interface IWarningResponse {
  status?: string,
  message: string,
  data?: any
}


// Auth api will only have below structure

// status: string,
// message: string,


// Majority of api will have below structure

// responseCode: string,
// responseMessage: string
