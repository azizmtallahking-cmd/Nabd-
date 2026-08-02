/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NotebookMessage {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
}

export interface DailyNotebookState {
  date: string;               // تاريخ اليوم الحالي فقط، بصيغة YYYY-MM-DD
  messages: NotebookMessage[];
  isOpen: boolean;
}
