// Auth Modal Script - Toggle and Form Handling

function initAuthModal() {
  const authModal = document.getElementById('authModal');
  const closeBtn = document.querySelector('.close-btn');
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const loginForm = document.getElementById('authForm');
  const signupForm = document.getElementById('signupForm');
  const loginFormContent = document.querySelector('.login-form');
  const signupFormContent = document.querySelector('.signup-form');

  // Attach to authBtn
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', openAuthModal);
  }

  // Close modal when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      authModal.classList.remove('show');
    });
  }

  // Close modal when clicking outside of auth-content
  window.addEventListener('click', function(event) {
    if (event.target === authModal) {
      authModal.classList.remove('show');
    }
  });

  // Toggle between Login and Sign Up forms
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const formType = this.getAttribute('data-form');

      // Remove active class from all buttons
      toggleBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Handle form switching with slide animation
      if (formType === 'login') {
        // Show login form
        loginFormContent.classList.remove('prev');
        loginFormContent.classList.add('active');
        
        // Hide signup form
        signupFormContent.classList.remove('active');
        signupFormContent.classList.add('prev');
      } else if (formType === 'signup') {
        // Show signup form
        signupFormContent.classList.remove('prev');
        signupFormContent.classList.add('active');
        
        // Hide login form
        loginFormContent.classList.remove('active');
        loginFormContent.classList.add('prev');
      }
    });
  });

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      console.log('Login attempt:', { email, password });
      // Add your login logic here
      alert('Login form submitted! (Check console for data)');
    });
  }

  // Handle Signup Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      console.log('Signup attempt:', { name, email, password });
      // Add your signup logic here
      alert('Signup form submitted! (Check console for data)');
    });
  }
});

// Function to open the auth modal (call this from other pages)
function openAuthModal() {
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.classList.add('show');
    // Reset to login form by default
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
      loginBtn.click();
    }
  }
}

// Function to open signup form directly
function openSignupModal() {
  const authModal = document.getElementById('authModal');
  const signupBtn = document.querySelector('.signup-btn');
  if (authModal && signupBtn) {
    authModal.classList.add('show');
    signupBtn.click();
  }
}

// Initialize modal if already present, else wait for DOM
if (document.getElementById('authModal')) {
  initAuthModal();
} else {
  document.addEventListener('DOMContentLoaded', initAuthModal);
}
