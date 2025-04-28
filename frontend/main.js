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
        displayImages(data.images);
      } else {
        gallery.innerHTML = '<div class="loading">No images found. Please add images to the backend/images folder.</div>';
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      gallery.innerHTML = '<div class="loading">Error loading images. Please check if the backend server is running.</div>';
    }
  }
  
  // Function to display images in the gallery
  function displayImages(images) {
    images.forEach(image => {
      // Create image container
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item';
      
      // Create image element with direct source
      const imgElement = document.createElement('img');
      imgElement.src = `${API_BASE_URL}/images/${image}`;
      imgElement.alt = image.replace(/\.[^/.]+$/, ""); // Remove extension for alt text
      
      // Add caption
      const caption = document.createElement('div');
      caption.className = 'image-caption';
      caption.textContent = image.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
      
      // Add elements to the DOM
      imageItem.appendChild(imgElement);
      imageItem.appendChild(caption);
      gallery.appendChild(imageItem);
    });
  }
  
  // Start loading images
  fetchImages();
});