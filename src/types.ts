import {Timestamp} from 'firebase/firestore';

export interface Task {
  id?: string;
  text: string;
  期日: string;
  時刻: string;
  completed: boolean;
  is周期的: string;
  周期日数?: string;
  周期単位?: string;
  親taskId?: string;
  toggleCompletionTimestamp?: Timestamp;
}
export interface LogsCompleteLogs {
  id?: string;
  logId: string;
  timestamp?: Timestamp;
  type?: string;
}

export interface Log {
  id?: string;
  text: string;
  親logId?: string;
  timestamp?: Timestamp;
  completeLogs?: LogsCompleteLogs[];
  interval?: boolean;
}
