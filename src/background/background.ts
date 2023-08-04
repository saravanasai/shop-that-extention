// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  // TODO: on installed function
})


chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["contentScript.js"]
  });
});