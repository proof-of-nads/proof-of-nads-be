// src/connect/types/connection.types.ts
export interface ConnectionResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    successful: string[];
    failed: { username: string; reason: string }[];
  };
}
