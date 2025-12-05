/* auth-modal.js
   Contains behavior for the reusable auth modal component.
   This script is loaded dynamically after the component HTML is injected.
*/
(function () {
  function initAuthModal() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;

    const authBtn = document.getElementById('authBtn');
    const closeBtn = authModal.querySelector('.close-btn');
    const authForm = document.getElementById('authForm');
    const signupForm = document.getElementById('signupForm');
    const btnSubmits = authModal.querySelectorAll('.btn-submit');

    // Open modal: show both forms (toggle removed) and focus the first input of the login form
    if (authBtn) {
      authBtn.addEventListener('click', function (e) {
        e.preventDefault();
        authModal.style.display = 'flex';
        try {
          const first = authForm && authForm.querySelector('input');
          if (first) first.focus();
        } catch (err) { /* ignore */ }
      });
    }

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        authModal.style.display = 'none';
      });
    }

    window.addEventListener('click', function (e) {
      if (e.target === authModal) authModal.style.display = 'none';
    });

    // Handle login form submission
    if (authForm) {
      authForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(authForm);
        formData.append('action', 'login');

        const btnSubmit = authForm.querySelector('.btn-submit');
        if (btnSubmit) btnSubmit.disabled = true;

        fetch('submit.php', {
          method: 'POST',
          body: formData,
        })
          .then(function (res) {
            return res.json().catch(function () { return res.text(); });
          })
          .then(function (data) {
            if (typeof data === 'object') {
              if (data.success) {
                alert(data.message || 'Login successful');
              } else {
                alert(data.message || 'Login failed');
              }
            } else {
              alert(String(data));
            }
            if (data.success) authModal.style.display = 'none';
          })
          .catch(function (err) {
            console.error('Login request failed', err);
            alert('Request failed. Check console for details.');
          })
          .finally(function () {
            if (btnSubmit) btnSubmit.disabled = false;
          });
      });
    }

    // Handle signup form submission
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }

        if (password.length < 6) {
          alert('Password must be at least 6 characters!');
          return;
        }

        const formData = new FormData(signupForm);
        formData.append('action', 'signup');
        formData.append('email', document.getElementById('signupEmail').value);
        formData.append('password', password);
        formData.append('name', document.getElementById('signupName').value);

        const btnSubmit = signupForm.querySelector('.btn-submit');
        if (btnSubmit) btnSubmit.disabled = true;

        fetch('submit.php', {
          method: 'POST',
          body: formData,
        })
          .then(function (res) {
            return res.json().catch(function () { return res.text(); });
          })
          .then(function (data) {
            if (typeof data === 'object') {
              if (data.success) {
                alert(data.message || 'Account created successfully');
              } else {
                alert(data.message || 'Signup failed');
              }
            } else {
              alert(String(data));
            }
            if (data.success) authModal.style.display = 'none';
          })
          .catch(function (err) {
            console.error('Signup request failed', err);
            alert('Request failed. Check console for details.');
          })
          .finally(function () {
            if (btnSubmit) btnSubmit.disabled = false;
          });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModal);
  } else {
    initAuthModal();
  }
})();
