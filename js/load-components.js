// load-components.js
// Fetch and inject HTML components, then load their scripts.
document.addEventListener('DOMContentLoaded', function () {
  const components = [
    { html: 'components/auth-modal.html', script: 'components/auth-modal.js' },
    { html: 'components/property-modal.html', script: 'components/property-modal.js' },
  ];

  components.forEach(function (comp) {
    fetch(comp.html)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + comp.html);
        return res.text();
      })
      .then(function (html) {
        document.body.insertAdjacentHTML('beforeend', html);
        // Now load its JS (if specified)
        if (comp.script) {
          var s = document.createElement('script');
          s.src = comp.script;
          document.body.appendChild(s);
        }
      })
      .catch(function (err) {
        console.error('Component load error:', err);
      });
  });
});
