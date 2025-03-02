// This script helps detect when the Midnight wallet is injected
(function() {
  // Check if the wallet is already available
  if (window.midnight?.mnLace) {
    window.dispatchEvent(new Event('midnightWalletLoaded'));
    return;
  }

  // Set up a observer to watch for the wallet injection
  const observer = new MutationObserver((mutations) => {
    if (window.midnight?.mnLace) {
      window.dispatchEvent(new Event('midnightWalletLoaded'));
      observer.disconnect();
    }
  });

  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Fallback timeout after 3 seconds
  setTimeout(() => {
    observer.disconnect();
    if (!window.midnight?.mnLace) {
      console.warn('Midnight wallet not detected after timeout');
    }
  }, 3000);
})();
