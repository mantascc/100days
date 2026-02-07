// Clock and typing phrase content system

// Global variables
let bodyTextPhrases = ["Loading..."];
let contentCFG;
let contentCtx;

// Typing state
let typingState = {
  currentPhraseIndex: 0,
  currentText: '',
  targetText: "Loading...",
  isTyping: true,
  charIndex: 0,
  lastTypeTime: 0,
  typeSpeed: 90,        // ms between characters
  pauseAfterComplete: 15000, // ms to pause after completing a phrase
  deleteSpeed: 65       // ms between character deletions
};

function initContent(config, canvasContext) {
  contentCFG = config;
  contentCtx = canvasContext;
  
  // Load phrases from JSON file
  loadPhrases();
}

function loadPhrases() {
  fetch('./phrases.json')
    .then(response => response.json())
    .then(data => {
      bodyTextPhrases = data.phrases;
      // Always start with the first phrase (index 0)
      typingState.currentPhraseIndex = 0;
      typingState.targetText = bodyTextPhrases[typingState.currentPhraseIndex];
      typingState.currentText = '';
      typingState.isTyping = true;
      typingState.charIndex = 0;
    })
    .catch(error => {
      console.warn('Could not load phrases from phrases.json, using fallback:', error);
      bodyTextPhrases = [
        "Welcome to the simulation",
        "This is an error state"
      ];
      typingState.targetText = bodyTextPhrases[0];
    });
}

function updateTypingEffect() {
  const now = Date.now();
  
  if (now - typingState.lastTypeTime < (typingState.isTyping ? typingState.typeSpeed : typingState.deleteSpeed)) {
    return; // Not time for next character yet
  }
  
  if (typingState.isTyping) {
    // Typing phase
    if (typingState.charIndex < typingState.targetText.length) {
      typingState.currentText = typingState.targetText.substring(0, typingState.charIndex + 1);
      typingState.charIndex++;
      typingState.lastTypeTime = now;
    } else {
      // Finished typing, wait then start deleting
      if (now - typingState.lastTypeTime > typingState.pauseAfterComplete) {
        typingState.isTyping = false;
        typingState.lastTypeTime = now;
      }
    }
  } else {
    // Deleting phase
    if (typingState.currentText.length > 0) {
      typingState.currentText = typingState.currentText.substring(0, typingState.currentText.length - 1);
      typingState.lastTypeTime = now;
    } else {
      // Finished deleting, move to random phrase (but not the first one again)
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * bodyTextPhrases.length);
      } while (nextIndex === 0); // Avoid repeating the first phrase
      
      typingState.currentPhraseIndex = nextIndex;
      typingState.targetText = bodyTextPhrases[typingState.currentPhraseIndex];
      typingState.isTyping = true;
      typingState.charIndex = 0;
      typingState.lastTypeTime = now;
    }
  }
}

function drawClock(canvasDimensions) {
  const { W, H } = canvasDimensions;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  const centerX = W / 2;
  const centerY = H / 2;
  
  // Draw clock
  contentCtx.font = `${contentCFG.clockFontSize}px "Instrument Serif", serif`;
  contentCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  contentCtx.textAlign = 'center';
  contentCtx.textBaseline = 'middle';
  contentCtx.fillText(timeString, centerX, centerY);
  
  // Draw animated body text below clock
  contentCtx.font = `${contentCFG.bodyTextSize}px monospace`;
  contentCtx.fillStyle = 'rgba(128, 128, 128, 0.8)'; // mid-grey
  contentCtx.textAlign = 'center';
  contentCtx.textBaseline = 'top';
  
  const bodyTextY = centerY + contentCFG.clockFontSize / 2 + 20; // 20px spacing below clock
  const displayText = typingState.currentText + (typingState.isTyping && typingState.charIndex === typingState.targetText.length ? '' : '|');
  contentCtx.fillText(displayText, centerX, bodyTextY);
}

function updateContent() {
  updateTypingEffect();
}

function renderContent(canvasDimensions) {
  drawClock(canvasDimensions);
}

// Make functions globally accessible
window.initContent = initContent;
window.updateContent = updateContent;
window.renderContent = renderContent;