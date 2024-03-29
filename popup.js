
document.addEventListener('DOMContentLoaded', function() {
  exportChat();
});

function exportChat() {
  console.log('Exporting chat content');
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getPageContent
    }, function(results) {
      if (chrome.runtime.lastError) {
        console.error('Error: ', chrome.runtime.lastError.message);
      } else {
        var chatContent = results[0].result;
        saveToObsidian(chatContent);
      }
    });
  });
}

function getPageContent() {
  return document.body.innerText;
}

function saveToObsidian(content) {
  var timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, -5);
  var filename = `chat-log-${timestamp}.md`;
  var blob = new Blob([content], { type: 'text/markdown' });
  var url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}