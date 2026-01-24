// Verification Page JavaScript

const API_BASE = 'http://localhost:3000/api';

// Utility functions
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  const container = document.querySelector('.verification-card');
  container.insertBefore(alertDiv, container.firstChild);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

function setLoading(button, loading = true) {
  if (loading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function updateVerificationBadge(type, level) {
  const badge = document.getElementById(`${type}Badge`);
  if (badge) {
    badge.textContent = level;
    badge.className = `verification-badge ${level.toLowerCase()}`;
  }
}

// File validation
function validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size too large. Maximum 5MB allowed.');
  }
  return true;
}

// API calls
async function verifyKYC(aadhaar, pan) {
  const response = await fetch(`${API_BASE}/verify/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar, pan })
  });
  return response.json();
}

async function verifyBank(accountNumber, ifsc) {
  const response = await fetch(`${API_BASE}/verify/bank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountNumber, ifsc })
  });
  return response.json();
}

async function verifyBackground(aadhaar) {
  const response = await fetch(`${API_BASE}/verify/background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar })
  });
  return response.json();
}

async function uploadDocuments(formData) {
  const response = await fetch(`${API_BASE}/verify/documents`, {
    method: 'POST',
    body: formData
  });
  return response.json();
}

async function createUser(userData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
  // Landlord KYC Form
  document.getElementById('landlordKycForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const aadhaar = document.getElementById('landlordAadhaar').value;
      const pan = document.getElementById('landlordPan').value;

      const result = await verifyKYC(aadhaar, pan);
      if (result.success) {
        showAlert('KYC verification successful!', 'success');
        updateVerificationBadge('landlord', 'Silver');
      } else {
        showAlert(result.message || 'KYC verification failed', 'danger');
      }
    } catch (error) {
      showAlert('Error during KYC verification', 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Landlord Bank Form
  document.getElementById('landlordBankForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const accountNumber = document.getElementById('landlordAccountNumber').value;
      const ifsc = document.getElementById('landlordIfsc').value;
      const chequeFile = document.getElementById('landlordCheque').files[0];

      if (chequeFile) {
        validateFile(chequeFile);
      }

      const result = await verifyBank(accountNumber, ifsc);
      if (result.success) {
        showAlert('Bank verification successful!', 'success');
        updateVerificationBadge('landlord', 'Gold');
      } else {
        showAlert(result.message || 'Bank verification failed', 'danger');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Landlord Documents Form
  document.getElementById('landlordDocumentsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const formData = new FormData();
      const files = [
        { id: 'landlordSaleDeed', name: 'saleDeed' },
        { id: 'landlordTaxReceipt', name: 'taxReceipt' },
        { id: 'landlordUtilityBill', name: 'utilityBill' },
        { id: 'landlordNoc', name: 'noc' }
      ];

      files.forEach(({ id, name }) => {
        const file = document.getElementById(id).files[0];
        if (file) {
          validateFile(file);
          formData.append(name, file);
        }
      });

      const result = await uploadDocuments(formData);
      if (result.success) {
        showAlert('Documents uploaded successfully!', 'success');
        updateVerificationBadge('landlord', 'Gold');
      } else {
        showAlert(result.message || 'Document upload failed', 'danger');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Tenant Identity Form
  document.getElementById('tenantIdentityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const aadhaar = document.getElementById('tenantAadhaar').value;
      const passport = document.getElementById('tenantPassport').value;

      // Create user profile
      const userData = {
        type: 'tenant',
        aadhaar,
        passport: passport || null,
        identityVerified: true
      };

      const result = await createUser(userData);
      if (result.success) {
        showAlert('Identity verification successful!', 'success');
        updateVerificationBadge('tenant', 'Silver');
      } else {
        showAlert(result.message || 'Identity verification failed', 'danger');
      }
    } catch (error) {
      showAlert('Error during identity verification', 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Tenant Social Form
  const tenantSocialForm = document.getElementById('tenantSocialForm');
  if (tenantSocialForm) {
    tenantSocialForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const linkedIn = document.getElementById('tenantLinkedIn').value;
        const facebook = document.getElementById('tenantFacebook').value;
        const instagram = document.getElementById('tenantInstagram').value;

        // Validate at least one social profile
        if (!linkedIn && !facebook && !instagram) {
          throw new Error('Please provide at least one social media profile');
        }

        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/;
        if (linkedIn && !urlPattern.test(linkedIn)) {
          throw new Error('Please enter a valid LinkedIn URL');
        }
        if (facebook && !urlPattern.test(facebook)) {
          throw new Error('Please enter a valid Facebook URL');
        }
        if (instagram && !urlPattern.test(instagram)) {
          throw new Error('Please enter a valid Instagram URL');
        }

        showAlert('Social media verification submitted successfully!', 'success');
        updateVerificationBadge('tenant', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Tenant Reference Form
  const tenantReferenceForm = document.getElementById('tenantReferenceForm');
  if (tenantReferenceForm) {
    tenantReferenceForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const name = document.getElementById('referenceName').value;
        const relation = document.getElementById('referenceRelation').value;
        const phone = document.getElementById('referencePhone').value;
        const email = document.getElementById('referenceEmail').value;

        if (!name.trim()) {
          throw new Error('Please enter reference name');
        }
        if (!relation) {
          throw new Error('Please select relationship');
        }
        if (!phone.trim()) {
          throw new Error('Please enter reference phone number');
        }

        // Basic phone validation
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''))) {
          throw new Error('Please enter a valid phone number');
        }

        showAlert('Reference added successfully!', 'success');
        updateVerificationBadge('tenant', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Tenant Address Form
  const tenantAddressForm = document.getElementById('tenantAddressForm');
  if (tenantAddressForm) {
    tenantAddressForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const proofType = document.getElementById('tenantAddressProofType').value;
        const proofFile = document.getElementById('tenantAddressFile').files[0];

        if (!proofType) {
          throw new Error('Please select address proof type');
        }
        if (!proofFile) {
          throw new Error('Please upload address proof document');
        }

        validateFile(proofFile);

        showAlert('Address verification submitted successfully!', 'success');
        updateVerificationBadge('tenant', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Tenant Profile Form
  const tenantProfileForm = document.getElementById('tenantProfileForm');
  if (tenantProfileForm) {
    tenantProfileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const occupation = document.getElementById('tenantOccupation').value;
        const about = document.getElementById('tenantAbout').value;
        const interests = document.getElementById('tenantInterests').value;

        if (!occupation) {
          throw new Error('Please select your occupation/study status');
        }

        // Save profile data
        const profileData = {
          occupation,
          about: about.trim(),
          interests: interests.trim()
        };

        localStorage.setItem('tenantProfile', JSON.stringify(profileData));

        showAlert('Profile enhanced successfully!', 'success');
        updateVerificationBadge('tenant', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Tenant Background Form
  document.getElementById('tenantBackgroundForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const aadhaar = document.getElementById('tenantBackgroundAadhaar').value;
      const consent = document.getElementById('backgroundConsent').checked;

      if (!consent) {
        throw new Error('Please provide consent for background check');
      }

      const result = await verifyBackground(aadhaar);
      if (result.success) {
        showAlert('Background check completed successfully!', 'success');
        updateVerificationBadge('tenant', 'Gold');
      } else {
        showAlert(result.message || 'Background check failed', 'warning');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Tenant Compatibility Form
  document.getElementById('tenantCompatibilityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const preferences = {
        nonSmoking: document.getElementById('smoking').checked,
        petFriendly: document.getElementById('pets').checked,
        vegetarian: document.getElementById('veg').checked,
        nightOwl: document.getElementById('nightOwl').checked
      };

      // Save preferences (would typically send to API)
      localStorage.setItem('tenantPreferences', JSON.stringify(preferences));

      showAlert('Roommate preferences saved successfully!', 'success');
    } catch (error) {
      showAlert('Error saving preferences', 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Dashboard Tenant Identity Form
  const dashboardIdentityForm = document.getElementById('dashboardTenantIdentityForm');
  if (dashboardIdentityForm) {
    dashboardIdentityForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const aadhaar = document.getElementById('dashboardTenantAadhaar').value;
        const passport = document.getElementById('dashboardTenantPassport').value;

        // Create user profile
        const userData = {
          type: 'tenant',
          aadhaar,
          passport: passport || null,
          identityVerified: true
        };

        const result = await createUser(userData);
        if (result.success) {
          showAlert('Identity verification successful!', 'success');
          updateVerificationBadge('tenantDashboard', 'Silver');
        } else {
          showAlert(result.message || 'Identity verification failed', 'danger');
        }
      } catch (error) {
        showAlert('Error during identity verification', 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Social Form
  const dashboardSocialForm = document.getElementById('dashboardTenantSocialForm');
  if (dashboardSocialForm) {
    dashboardSocialForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const linkedIn = document.getElementById('dashboardTenantLinkedIn').value;
        const facebook = document.getElementById('dashboardTenantFacebook').value;
        const instagram = document.getElementById('dashboardTenantInstagram').value;

        // Validate at least one social profile
        if (!linkedIn && !facebook && !instagram) {
          throw new Error('Please provide at least one social media profile');
        }

        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/;
        if (linkedIn && !urlPattern.test(linkedIn)) {
          throw new Error('Please enter a valid LinkedIn URL');
        }
        if (facebook && !urlPattern.test(facebook)) {
          throw new Error('Please enter a valid Facebook URL');
        }
        if (instagram && !urlPattern.test(instagram)) {
          throw new Error('Please enter a valid Instagram URL');
        }

        showAlert('Social media verification submitted successfully!', 'success');
        updateVerificationBadge('tenantDashboard', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Reference Form
  const dashboardReferenceForm = document.getElementById('dashboardTenantReferenceForm');
  if (dashboardReferenceForm) {
    dashboardReferenceForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const name = document.getElementById('dashboardReferenceName').value;
        const relation = document.getElementById('dashboardReferenceRelation').value;
        const phone = document.getElementById('dashboardReferencePhone').value;
        const email = document.getElementById('dashboardReferenceEmail').value;

        if (!name.trim()) {
          throw new Error('Please enter reference name');
        }
        if (!relation) {
          throw new Error('Please select relationship');
        }
        if (!phone.trim()) {
          throw new Error('Please enter reference phone number');
        }

        // Basic phone validation
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''))) {
          throw new Error('Please enter a valid phone number');
        }

        showAlert('Reference added successfully!', 'success');
        updateVerificationBadge('tenantDashboard', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Address Form
  const dashboardAddressForm = document.getElementById('dashboardTenantAddressForm');
  if (dashboardAddressForm) {
    dashboardAddressForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const proofType = document.getElementById('dashboardTenantAddressProofType').value;
        const proofFile = document.getElementById('dashboardTenantAddressFile').files[0];

        if (!proofType) {
          throw new Error('Please select address proof type');
        }
        if (!proofFile) {
          throw new Error('Please upload address proof document');
        }

        validateFile(proofFile);

        showAlert('Address verification submitted successfully!', 'success');
        updateVerificationBadge('tenantDashboard', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Profile Form
  const dashboardProfileForm = document.getElementById('dashboardTenantProfileForm');
  if (dashboardProfileForm) {
    dashboardProfileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const occupation = document.getElementById('dashboardTenantOccupation').value;
        const about = document.getElementById('dashboardTenantAbout').value;
        const interests = document.getElementById('dashboardTenantInterests').value;

        if (!occupation) {
          throw new Error('Please select your occupation/study status');
        }

        // Save profile data
        const profileData = {
          occupation,
          about: about.trim(),
          interests: interests.trim()
        };

        localStorage.setItem('tenantProfile', JSON.stringify(profileData));

        showAlert('Profile enhanced successfully!', 'success');
        updateVerificationBadge('tenantDashboard', 'Silver');
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Background Form
  const dashboardBackgroundForm = document.getElementById('dashboardTenantBackgroundForm');
  if (dashboardBackgroundForm) {
    dashboardBackgroundForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const aadhaar = document.getElementById('dashboardTenantBackgroundAadhaar').value;
        const consent = document.getElementById('dashboardBackgroundConsent').checked;

        if (!consent) {
          throw new Error('Please provide consent for background check');
        }

        const result = await verifyBackground(aadhaar);
        if (result.success) {
          showAlert('Background check completed successfully!', 'success');
          updateVerificationBadge('tenantDashboard', 'Gold');
        } else {
          showAlert(result.message || 'Background check failed', 'warning');
        }
      } catch (error) {
        showAlert(error.message, 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Dashboard Tenant Compatibility Form
  const dashboardCompatibilityForm = document.getElementById('dashboardTenantCompatibilityForm');
  if (dashboardCompatibilityForm) {
    dashboardCompatibilityForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const button = this.querySelector('button');
      setLoading(button, true);

      try {
        const preferences = {
          nonSmoking: document.getElementById('dashboardSmoking').checked,
          petFriendly: document.getElementById('dashboardPets').checked,
          vegetarian: document.getElementById('dashboardVeg').checked,
          nightOwl: document.getElementById('dashboardNightOwl').checked
        };

        // Save preferences (would typically send to API)
        localStorage.setItem('tenantPreferences', JSON.stringify(preferences));

        showAlert('Roommate preferences saved successfully!', 'success');
      } catch (error) {
        showAlert('Error saving preferences', 'danger');
      } finally {
        setLoading(button, false);
      }
    });
  }

  // Property Legal Form
  document.getElementById('propertyLegalForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const formData = new FormData();
      const files = [
        { id: 'propertyOwnership', name: 'ownership' },
        { id: 'propertyTax', name: 'tax' },
        { id: 'propertyUtility', name: 'utility' },
        { id: 'propertyOc', name: 'oc' }
      ];

      files.forEach(({ id, name }) => {
        const file = document.getElementById(id).files[0];
        if (file) {
          validateFile(file);
          formData.append(name, file);
        }
      });

      const result = await uploadDocuments(formData);
      if (result.success) {
        showAlert('Legal documents uploaded successfully!', 'success');
        updateVerificationBadge('property', 'Silver');
      } else {
        showAlert(result.message || 'Document upload failed', 'danger');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(button, false);
    }
  });

  // Property Media Form
  document.getElementById('propertyMediaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    setLoading(button, true);

    try {
      const photoFile = document.getElementById('propertyPhoto').files[0];
      const videoFile = document.getElementById('propertyVideo').files[0];

      if (photoFile) {
        validateFile(photoFile, ['image/jpeg', 'image/png']);
      }

      if (videoFile) {
        validateFile(videoFile, ['video/mp4', 'video/quicktime']);
      }

      // Simulate geo-tagging check
      if (photoFile && !photoFile.name.includes('geo')) {
        showAlert('Photo uploaded successfully! GPS verification would be checked in production.', 'success');
      } else {
        showAlert('Media uploaded successfully!', 'success');
      }

      updateVerificationBadge('property', 'Gold');
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(button, false);
    }
  });
});

// Skip trust building function
function skipTrustBuilding() {
  showAlert('Trust building activities skipped. You can complete them later to unlock premium features.', 'info');
  updateVerificationBadge('tenant', 'Silver');
  updateVerificationBadge('tenantDashboard', 'Silver');
}

// Schedule visit function
function scheduleVisit() {
  showAlert('Visit scheduling feature coming soon! Contact support@nestori.com for premium verification.', 'warning');
}

// Initialize badges on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load saved verification status from localStorage (in production, this would come from API)
  const landlordStatus = localStorage.getItem('landlordVerification') || 'Basic';
  const tenantStatus = localStorage.getItem('tenantVerification') || 'Basic';
  const propertyStatus = localStorage.getItem('propertyVerification') || 'Basic';

  updateVerificationBadge('landlord', landlordStatus);
  updateVerificationBadge('tenant', tenantStatus);
  updateVerificationBadge('property', propertyStatus);
});
