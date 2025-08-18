import { DangerLog } from "../types";

export function logThreat(url: string) {
  const newLog: DangerLog = {
    time: new Date().toISOString(),
    url
  };

  chrome.storage.local.get({ dangerLogs: [] }, (data) => {
    const updated = [...data.dangerLogs, newLog];
    chrome.storage.local.set({ dangerLogs: updated }, () => {
      console.log("💾 로그 저장됨:", newLog);
    });
  });
}
