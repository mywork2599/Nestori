// Property modal behavior: open/close, validation, submit handling
(function(){
  try{
  console.log('[property-modal] init');
  const openBtn = document.getElementById('listPropertyBtn');
  const modal = document.getElementById('propertyModal');
  const closeBtn = modal && modal.querySelector('.close-btn-property');
  const cancelBtn = modal && modal.querySelector('.btn-cancel');
  const form = document.getElementById('propertyForm');
  const fileInput = document.getElementById('images');
  const previewEl = document.getElementById('imagePreview');
  const formMessage = document.getElementById('formMessage');

  if(!modal){ console.warn('[property-modal] no #propertyModal found'); return; }

  let selectedFiles = [];
  let previewsData = [];

  function openModal(){
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // expose global fallbacks in case event binding fails
  try{
    window.openPropertyModal = openModal;
    window.closePropertyModal = closeModal;
  }catch(e){ /* ignore */ }

  if(openBtn) {
    openBtn.addEventListener('click', function(e){
      e.preventDefault();
      console.log('[property-modal] openBtn clicked');
      openModal();
    });
  } else {
    // fallback: listen for clicks on document for element with that id
    document.addEventListener('click', function(ev){
      const el = ev.target.closest && ev.target.closest('#listPropertyBtn');
      if(el){
        ev.preventDefault();
        console.log('[property-modal] openBtn (fallback) clicked');
        openModal();
      }
    });
  }

  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(cancelBtn) cancelBtn.addEventListener('click', function(){
    form.reset();
    clearPreview();
    closeModal();
  });

  // close when clicking outside content
  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });

  // Close on ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  function clearPreview(){
    selectedFiles = [];
    previewsData = [];
    if(previewEl) previewEl.innerHTML = '';
    if(fileInput) fileInput.value = '';
  }

  function renderPreviews(){
    if(!previewEl) return;
    previewEl.innerHTML = '';
    previewsData.forEach((src, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'thumb';
      const img = document.createElement('img');
      img.src = src;
      const rem = document.createElement('div');
      rem.className = 'remove-thumb';
      rem.innerHTML = '&times;';
      rem.title = 'Remove image';
      rem.addEventListener('click', function(){
        selectedFiles.splice(idx,1);
        previewsData.splice(idx,1);
        renderPreviews();
      });
      wrap.appendChild(img);
      wrap.appendChild(rem);
      previewEl.appendChild(wrap);
    });
  }

  if(fileInput){
    fileInput.addEventListener('change', function(e){
      const files = Array.from(fileInput.files || []);
      const MAX_FILES = 6;
      const allowed = files.slice(0, MAX_FILES - selectedFiles.length);
      if((selectedFiles.length + files.length) > MAX_FILES){
        showMessage('Maximum ' + MAX_FILES + ' images allowed. Extra images were ignored.', true);
      }
      // Append allowed files
      allowed.forEach(f => selectedFiles.push(f));
      // create previews for each newly selected file
      allowed.forEach(f => {
        const reader = new FileReader();
        reader.onload = function(evt){
          previewsData.push(evt.target.result);
          renderPreviews();
        };
        reader.readAsDataURL(f);
      });
    });
  }

  // image resize helper: returns Blob
  function resizeImage(file, maxDim = 1600, mime = 'image/jpeg', quality = 0.85){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function(){
        let w = img.width;
        let h = img.height;
        if(w > h){
          if(w > maxDim){ h = Math.round(h * (maxDim / w)); w = maxDim; }
        } else {
          if(h > maxDim){ w = Math.round(w * (maxDim / h)); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(function(blob){
          if(blob) resolve(blob);
          else reject(new Error('Image resize failed'));
        }, mime, quality);
      };
      img.onerror = function(){ reject(new Error('Could not read image')); };
      const reader = new FileReader();
      reader.onload = function(ev){ img.src = ev.target.result; };
      reader.onerror = function(){ reject(new Error('File read error')); };
      reader.readAsDataURL(file);
    });
  }

  // xhr upload to get progress
  function uploadWithProgress(url, formData, onProgress){
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.upload.onprogress = function(e){
        if(e.lengthComputable && typeof onProgress === 'function'){
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };
      xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
          resolve(new Response(xhr.responseText, { status: xhr.status }));
        } else {
          reject(new Error('Upload failed: ' + xhr.status));
        }
      };
      xhr.onerror = function(){ reject(new Error('Network error')); };
      xhr.send(formData);
    });
  }

  function showMessage(text, isError){
    if(!formMessage) return;
    formMessage.textContent = text;
    formMessage.classList.toggle('error', !!isError);
    formMessage.style.display = 'block';
  }

  function clearMessage(){
    if(!formMessage) return;
    formMessage.textContent = '';
    formMessage.style.display = 'none';
    formMessage.classList.remove('error');
  }

  // Submit handling with optional endpoint
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      clearMessage();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const endpoint = form.dataset.endpoint && form.dataset.endpoint.trim();

      const payload = {
        title: document.getElementById('propTitle').value.trim(),
        city: document.getElementById('propCity').value,
        type: document.getElementById('propType').value,
        bedrooms: document.getElementById('bedrooms').value,
        bathrooms: document.getElementById('bathrooms').value,
        rent: document.getElementById('rent').value,
        pincode: document.getElementById('pincode').value.trim(),
        contactName: document.getElementById('contactName').value.trim(),
        contactEmail: document.getElementById('contactEmail').value.trim(),
        contactPhone: document.getElementById('contactPhone').value.trim(),
        description: document.getElementById('description').value.trim()
      };

      // disable UI
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

      try{
        if(endpoint){
          // validate and resize images before upload
          const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 2.5MB
          const resizedBlobs = [];
          for(let i=0;i<selectedFiles.length;i++){
            const f = selectedFiles[i];
            try{
              let blob = await resizeImage(f, 1600, 'image/jpeg', 0.9);
              // if still too large, try reducing quality
              let q = 0.85;
              while(blob.size > MAX_FILE_SIZE && q > 0.5){
                blob = await resizeImage(f, 1600, 'image/jpeg', q);
                q -= 0.1;
              }
              // final check
              if(blob.size > (MAX_FILE_SIZE + 500000)){
                // skip file if too large after resizing
                console.warn('Skipping oversized image after resize:', f.name, blob.size);
                continue;
              }
              resizedBlobs.push({ blob, name: f.name });
            }catch(err){
              console.warn('Could not resize', f.name, err);
            }
          }

          const fd = new FormData();
          Object.keys(payload).forEach(k => fd.append(k, payload[k]));
          // include resized blobs
          resizedBlobs.forEach((entry, i) => fd.append('images', entry.blob, 'resized_'+entry.name));

          // show progress UI
          const progressWrap = document.getElementById('uploadProgress');
          const progressBar = progressWrap && progressWrap.querySelector('.upload-progress-bar');
          if(progressWrap) progressWrap.style.display = 'block';

          await uploadWithProgress(endpoint, fd, function(pct){
            if(progressBar) progressBar.style.width = pct + '%';
          });

          if(progressWrap){ setTimeout(()=>{ progressWrap.style.display='none'; if(progressBar) progressBar.style.width='0%'; }, 500); }
          showMessage('Listing submitted successfully. It will appear after review.');
        } else {
          // fallback: store in localStorage with images as dataURLs
          const stored = JSON.parse(localStorage.getItem('nestoriListings') || '[]');
          stored.push(Object.assign({}, payload, { images: previewsData, createdAt: Date.now() }));
          localStorage.setItem('nestoriListings', JSON.stringify(stored));
          showMessage('Listing saved locally (no endpoint configured).');
        }

        console.log('Property listing data:', payload, 'files:', selectedFiles);
        form.reset();
        clearPreview();
        setTimeout(()=>{
          closeModal();
          clearMessage();
        }, 1200);
      }catch(err){
        console.error(err);
        showMessage('Failed to submit listing. Try again later.', true);
      }finally{
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Submit Listing'; }
      }
    });
  }catch(err){
    console.error('[property-modal] initialization error', err);
  }
})();
