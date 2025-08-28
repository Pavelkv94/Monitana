// HTTP Status Code types for better type safety
export type HttpStatusCode = 
  | 200 | 201 | 204 | 301 | 302 | 304 
  | 400 | 401 | 403 | 404 | 405 | 409 | 422 | 429 
  | 500 | 501 | 502 | 503 | 504;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// Log levels for structured logging
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// Time period types for queries
export type TimePeriod = '1' | '6' | '12' | '24' | '48' | '72' | '168' | '720'; // hours

// Agent types
export type AgentType = 'filebeat' | 'logstash' | 'beats' | 'elastic-agent';

// Device types
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown';

// Browser types
export type BrowserType = 
  | 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' 
  | 'Internet Explorer' | 'Unknown';

// Operating System types
export type OperatingSystem = 
  | 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android' 
  | 'Unix' | 'Unknown';

// Query filters for log searching
export interface LogQueryFilters {
  period?: TimePeriod;
  statusCode?: HttpStatusCode;
  method?: HttpMethod;
  sourceIp?: string;
  userAgent?: string;
  path?: string;
  startTime?: Date;
  endTime?: Date;
  limit?: number;
  offset?: number;
}

// Response type for log queries
export interface LogQueryResponse {
  logs: any[]; // You can replace 'any' with your LogDocument type
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Aggregation result types
export interface LogStats {
  totalRequests: number;
  uniqueIps: number;
  statusCodeDistribution: Record<number, number>;
  methodDistribution: Record<string, number>;
  topPaths: Array<{ path: string; count: number }>;
  topIps: Array<{ ip: string; count: number }>;
  hourlyDistribution: Array<{ hour: string; count: number }>;
}

// Error response type
export interface LogServiceError {
  code: string;
  message: string;
  details?: any;
}
