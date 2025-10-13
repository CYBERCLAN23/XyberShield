// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        
        // Check for updates
        if (registration.waiting) {
          console.log('Service Worker is waiting to update');
          updateReady(registration.waiting);
          return;
        }
        
        if (registration.installing) {
          console.log('Service Worker is installing');
          trackInstalling(registration.installing);
          return;
        }
        
        registration.addEventListener('updatefound', () => {
          console.log('New Service Worker found');
          trackInstalling(registration.installing);
        });
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
  
  // Refresh the page when a new service worker takes over
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

// Track the installing worker
function trackInstalling(worker) {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  });
}

// Show update notification
function updateReady(worker) {
  const toast = document.createElement('div');
  toast.className = 'update-toast';
  toast.innerHTML = `
    <div class="update-content">
      <p>New update available! Click to refresh.</p>
      <button class="update-button">Update Now</button>
    </div>
    <style>
      .update-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #0a192f;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
        border: 1px solid #4c94be;
      }
      .update-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .update-button {
        background: #4c94be;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      .update-button:hover {
        background: #3a7a9c;
      }
      @keyframes slideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
    </style>
  `;
  
  const button = toast.querySelector('.update-button');
  button.addEventListener('click', () => {
    worker.postMessage({ action: 'skipWaiting' });
  });
  
  document.body.appendChild(toast);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 10000);
}
