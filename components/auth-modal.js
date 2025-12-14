// Auth Modal Script - Sign Up/Login with OTP and Gmail Integration

function initAuthModal() {
  const authModal = document.getElementById('authModal');
  const closeBtn = document.querySelector('.close-btn');
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  // Attach to authBtn
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', openAuthModal);
  }

  // Close modal when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      authModal.classList.remove('show');
      resetModal();
    });
  }

  // Close modal when clicking outside of auth-content
  window.addEventListener('click', function(event) {
    if (event.target === authModal) {
      authModal.classList.remove('show');
      resetModal();
    }
  });

  // Toggle between Sign Up and Login forms
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const formType = this.getAttribute('data-type');

      // Remove active class from all buttons
      toggleBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Handle form switching with slide animation
      if (formType === 'signup') {
        // Show signup form
        signupForm.classList.remove('prev');
        signupForm.classList.add('active');

        // Hide login form
        loginForm.classList.remove('active');
        loginForm.classList.add('prev');
      } else if (formType === 'login') {
        // Show login form
        loginForm.classList.remove('prev');
        loginForm.classList.add('active');

        // Hide signup form
        signupForm.classList.remove('active');
        signupForm.classList.add('prev');
      }
    });
  });

  // Sign Up Form Submission
  const completeSignupBtn = document.getElementById('completeSignup');
  if (completeSignupBtn) {
    completeSignupBtn.addEventListener('click', function() {
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const mobile = document.getElementById('signupMobile').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;

      if (!name || !email || !mobile || !password || !confirmPassword) {
        alert('Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      // Registration logic here (integrate with backend)
      console.log('Sign up attempt:', { name, email, mobile, password });
      alert('Registration successful! Welcome to Nestori.');
      authModal.classList.remove('show');
      resetModal();
    });
  }

  // Sign Up with Gmail
  const signupWithGmailBtn = document.getElementById('signupWithGmail');
  if (signupWithGmailBtn) {
    signupWithGmailBtn.addEventListener('click', function() {
      // Integrate with Google OAuth here
      console.log('Sign up with Gmail clicked');
      alert('Google OAuth integration needed. For demo, redirecting to Gmail signup.');
      // In real app: window.location.href = 'https://accounts.google.com/oauth/...';
    });
  }

  // Login OTP Send
  const sendOtpLoginBtn = document.getElementById('sendOtpLogin');
  if (sendOtpLoginBtn) {
    sendOtpLoginBtn.addEventListener('click', function() {
      const identifier = document.getElementById('loginIdentifier').value;
      if (!identifier) {
        alert('Please enter your Gmail or mobile number');
        return;
      }
      // Send OTP logic here (integrate with backend)
      console.log('Sending OTP to:', identifier);
      alert('OTP sent! (Demo)');
      document.getElementById('otpSectionLogin').style.display = 'block';
    });
  }

  // Login OTP Verify
  const verifyOtpLoginBtn = document.getElementById('verifyOtpLogin');
  if (verifyOtpLoginBtn) {
    verifyOtpLoginBtn.addEventListener('click', function() {
      const otp = document.getElementById('otpLogin').value;
      const identifier = document.getElementById('loginIdentifier').value;
      if (!otp) {
        alert('Please enter the OTP');
        return;
      }
      // Verify OTP logic here (integrate with backend)
      console.log('Verifying OTP for login:', { identifier, otp });
      // Simulate verification
      if (otp === '123456') { // Demo OTP
        alert('Login successful! Welcome back.');
        authModal.classList.remove('show');
        resetModal();
      } else {
        alert('Invalid OTP. Please try again.');
      }
    });
  }

  // Login with Gmail
  const loginWithGmailBtn = document.getElementById('loginWithGmail');
  if (loginWithGmailBtn) {
    loginWithGmailBtn.addEventListener('click', function() {
      // Integrate with Google OAuth here
      console.log('Login with Gmail clicked');
      alert('Google OAuth integration needed. For demo, redirecting to Gmail login.');
      // In real app: window.location.href = 'https://accounts.google.com/oauth/...';
    });
  }
}

// Function to reset modal to initial state
function resetModal() {
  // Reset signup form
  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupMobile').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('signupConfirmPassword').value = '';

  // Reset login form
  document.getElementById('loginIdentifier').value = '';
  document.getElementById('otpLogin').value = '';

  // Hide OTP section
  document.getElementById('otpSectionLogin').style.display = 'none';

  // Reset to signup form
  const signupBtn = document.querySelector('.signup-btn');
  if (signupBtn) {
    signupBtn.click();
  }
}

// Function to open the auth modal (call this from other pages)
function openAuthModal() {
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.classList.add('show');
    resetModal();
  }
}

// Function to open signup form directly (legacy, can be removed or updated)
function openSignupModal() {
  openAuthModal();
}

// Initialize modal if already present, else wait for DOM
if (document.getElementById('authModal')) {
  initAuthModal();
} else {
  document.addEventListener('DOMContentLoaded', initAuthModal);
}
