import { DangerLog } from "src/types";
import './options.css';

const renderLogs = (logs: DangerLog[]) => {
  const tbody = document.querySelector("#logTable tbody")!;
  tbody.innerHTML = "";  // 기존 행 초기화

  logs.forEach(log => {
    const row = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = new Date(log.time).toLocaleString();

    const urlCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = log.url;
    link.textContent = log.url;
    link.target = "_blank";
    urlCell.appendChild(link);

    row.append(timeCell, urlCell);
    tbody.appendChild(row);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const logTableBody = document.querySelector("#logTable tbody");
  const clearBtn = document.getElementById("clearLogs");

  chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
  })

  // 📌 로그 불러오기
 chrome.storage.local.get({ dangerLogs: [] }, ({ dangerLogs }) => {
   renderLogs(dangerLogs);
 });

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.dangerLogs) {
    // newValue를 넘겨주면 최신 배열로 재렌더
    renderLogs(changes.dangerLogs.newValue as DangerLog[]);
  }
});


  // 📌 로그 전체 삭제
  clearBtn!.addEventListener("click", () => {
    if (confirm("정말 모든 로그를 삭제하시겠습니까?")) {
      chrome.storage.local.set({ dangerLogs: [] }, () => {
        renderLogs([]);
        alert("모든 로그가 삭제되었습니다.");
      });
    }
  });
});
