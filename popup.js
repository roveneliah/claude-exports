// document.addEventListener('DOMContentLoaded', function() {
//   var exportButton = document.getElementById('exportButton');
//   exportButton.addEventListener('click', exportChat);
// });

// function exportChat() {
//   console.log('Sending message to content script');
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       files: ['content.js']
//     }, function() {
//       chrome.tabs.sendMessage(tabs[0].id, { action: 'exportChat' }, function(response) {
//         if (chrome.runtime.lastError) {
//           console.error('Error: ', chrome.runtime.lastError.message);
//         } else {
//           if (response && response.chatContent) {
//             console.log(response)
//             console.log(response.chatContent)
//             var chatContent = response.chatContent;
//             saveToObsidian(chatContent);
//           }
//         }
//       });
//     });
//   });
// }

// function saveToObsidian(content) {
//   var timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, -5);
//   var filename = `chat-log-${timestamp}.md`;
//   var blob = new Blob([content], { type: 'text/markdown' });
//   var url = URL.createObjectURL(blob);
//   chrome.downloads.download({
//     url: url,
//     filename: filename,
//     saveAs: true
//   });
// }

document.addEventListener('DOMContentLoaded', function() {
  // var exportButton = document.getElementById('exportButton');
  // exportButton.addEventListener('click', exportChat);
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