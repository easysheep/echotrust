// /public/embed-walloftrust.js
(function() {
    const container = document.getElementById('wall-of-trust');
    if (container) {
      const iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:3000/app/walloftrust';
      iframe.width = '600';
      iframe.height = '400';
      container.appendChild(iframe);
    }
  })();
  