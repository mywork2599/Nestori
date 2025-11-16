/* auth-modal.js
   Contains behavior for the reusable auth modal component.
   This script is loaded dynamically after the component HTML is injected.
*/
(function () {
  function initAuthModal() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;

    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = authModal.querySelector('.close-btn');
    const switchToSignup = document.getElementById('switchToSignup');
    const modalTitle = document.getElementById('modalTitle');
    const btnSubmit = authModal.querySelector('.btn-submit');

    if (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        authModal.style.display = 'flex';
        modalTitle.textContent = 'Login to Nestori';
        if (btnSubmit) btnSubmit.textContent = 'Login';
        if (switchToSignup) switchToSignup.innerHTML = 'Sign Up';
      });
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', function (e) {
        e.preventDefault();
        authModal.style.display = 'flex';
        modalTitle.textContent = 'Create Your Account';
        if (btnSubmit) btnSubmit.textContent = 'Sign Up';
        if (switchToSignup) switchToSignup.innerHTML = 'Login';
      });
    }

    if (switchToSignup) {
      switchToSignup.addEventListener('click', function (e) {
        e.preventDefault();
        if (modalTitle.textContent.includes('Login')) {
          modalTitle.textContent = 'Create Your Account';
          if (btnSubmit) btnSubmit.textContent = 'Sign Up';
          switchToSignup.innerHTML = 'Login';
        } else {
          modalTitle.textContent = 'Login to Nestori';
          if (btnSubmit) btnSubmit.textContent = 'Login';
          switchToSignup.innerHTML = 'Sign Up';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        authModal.style.display = 'none';
      });
    }

    window.addEventListener('click', function (e) {
      if (e.target === authModal) authModal.style.display = 'none';
    });

    const authForm = document.getElementById('authForm');
    if (authForm) {
      authForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Send form to backend (submit.php) with action=login|signup
        const formData = new FormData(authForm);
        const action = (btnSubmit && btnSubmit.textContent && btnSubmit.textContent.toLowerCase().includes('sign')) ? 'signup' : 'login';
        formData.append('action', action);

        if (btnSubmit) btnSubmit.disabled = true;

        fetch('submit.php', {
          method: 'POST',
          body: formData,
        })
          .then(function (res) {
            // Try JSON first, fallback to text
            return res.json().catch(function () { return res.text(); });
          })
          .then(function (data) {
            if (typeof data === 'object') {
              if (data.success) {
                alert(data.message || 'Success');
              } else {
                alert(data.message || 'Authentication failed');
              }
            } else {
              // text response
              alert(String(data));
            }
            authModal.style.display = 'none';
          })
          .catch(function (err) {
            console.error('Auth request failed', err);
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
