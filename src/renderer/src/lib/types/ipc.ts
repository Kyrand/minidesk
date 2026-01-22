/**
 * Error response from IPC calls
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Generic IPC response wrapper
 * All IPC handlers should return this format for consistent error handling
 */
export type IPCResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResponse };

/**
 * Unwrap an IPC response and throw if there's an error
 * @param response The IPC response to unwrap
 * @returns The data if successful
 * @throws Error if the response indicates failure
 */
export function unwrapIPCResponse<T>(response: IPCResponse<T>): T {
  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.error.message);
  }
}

/**
 * Create a success IPC response
 */
export function successResponse<T>(data: T): IPCResponse<T> {
  return { success: true, data };
}

/**
 * Create an error IPC response
 */
export function errorResponse(message: string, code?: string, details?: any): IPCResponse<never> {
  return {
    success: false,
    error: { message, code, details },
  };
}
