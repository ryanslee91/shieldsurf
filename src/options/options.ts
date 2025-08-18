import { DangerLog } from "src/types";
import './options.css';

document.addEventListener("DOMContentLoaded", () => {
  const logTableBody = document.querySelector("#logTable tbody");
  const clearBtn = document.getElementById("clearLogs");

  chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
  })

  // 📌 로그 불러오기
  chrome.storage.local.get({ threatLogs: [] }, (data) => {
    const logs: DangerLog[] = data.threatLogs;
    logs.forEach((log: DangerLog) => {
      const row = document.createElement("tr");

      const timeCell = document.createElement("td");
      timeCell.textContent = new Date(log.time).toLocaleString();

      const urlCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = log.url;
      link.textContent = log.url;
      link.target = "_blank";
      urlCell.appendChild(link);

      row.appendChild(timeCell);
      row.appendChild(urlCell);

      if (!logTableBody) return;
      logTableBody.appendChild(row);
    });
  });

  // 📌 로그 전체 삭제
  clearBtn!.addEventListener("click", () => {
    if (confirm("정말 모든 로그를 삭제하시겠습니까?")) {
      chrome.storage.local.set({ threatLogs: [] }, () => {
        logTableBody!.innerHTML = "";
        alert("모든 로그가 삭제되었습니다.");
      });
    }
  });
});
