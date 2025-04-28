document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.getElementById('image-gallery');
  const API_BASE_URL = 'http://localhost:3000';
  
  // Function to fetch the list of images
  async function fetchImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images`);
      const data = await response.json();
      
      if (gallery.querySelector('.loading')) {
        gallery.querySelector('.loading').remove();
      }
      
      if (data.images && data.images.length) {
        loadImages(data.images);
      } else {
        gallery.innerHTML = '<div class="loading">No images found. Please add images to the backend/images folder.</div>';
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      gallery.innerHTML = '<div class="loading">Error loading images. Please check if the backend server is running.</div>';
    }
  }
  
  // Function to load images into the gallery
  async function loadImages(images) {
    for (const image of images) {
      // Create image container
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item';
      
      // Get low-res image path
      let lowResPath;
      try {
        const lowResResponse = await fetch(`${API_BASE_URL}/api/lowres/${image}`);
        const lowResData = await lowResResponse.json();
        lowResPath = `${API_BASE_URL}${lowResData.path}`;
      } catch (error) {
        console.error(`Error getting low-res version of ${image}:`, error);
        continue;
      }
      
      // Create image element with low-res version
      const imgElement = document.createElement('img');
      imgElement.className = 'placeholder';
      imgElement.src = lowResPath;
      imgElement.alt = image.replace(/\.[^/.]+$/, ""); // Remove extension for alt text
      imgElement.dataset.highres = `${API_BASE_URL}/images/${image}`;
      
      // Add caption
      const caption = document.createElement('div');
      caption.className = 'image-caption';
      caption.textContent = image.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
      
      // Add elements to the DOM
      imageItem.appendChild(imgElement);
      imageItem.appendChild(caption);
      gallery.appendChild(imageItem);
      
      // Set up intersection observer for lazy loading
      setupLazyLoading(imgElement);
    }
  }
  
  // Set up intersection observer for lazy loading
  function setupLazyLoading(imgElement) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const highResUrl = img.dataset.highres;
          
          // Load high-res image
          const highResImg = new Image();
          highResImg.onload = function() {
            img.src = highResImg.src;
            img.classList.remove('placeholder');
          };
          highResImg.src = highResUrl;
          
          // Stop observing once loaded
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px', // Load images 200px before they come into view
      threshold: 0.1
    });
    
    observer.observe(imgElement);
  }
  
  // Start loading images
  fetchImages();
});