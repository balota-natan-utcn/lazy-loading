const gallery = document.getElementById('gallery');

const images = ['n64_bomberman64.webp', 'n64_kirby64.webp', 'n64_marioparty3.webp', 'n64_papermario.webp', 'nes_megaman.webp', 'nes_smb3.webp', 'ps1_crash.webp', 'ps1_ff7.webp', 'ps1_mgear.webp', 'ps1_spyro.webp', 'mkart64.webp', 'nes_contra.webp']; // Your images here
let imagesToLoad = images.length; // total number of images
let imagesLoaded = 0; // counter

images.forEach(imageName =>
{
  const img = document.createElement('img');
  img.dataset.lowres = `http://localhost:3000/images/${imageName}`;
  img.dataset.highres = `http://localhost:3000/images/high/${imageName}`;
  img.classList.add('blur');
  gallery.appendChild(img);
});

const observer = new IntersectionObserver((entries, observer) =>
{
  entries.forEach(entry =>
  {
    if (entry.isIntersecting)
    {
      const img = entry.target;

      img.src = img.dataset.lowres;

      img.onload = () => {
        const highRes = new Image();
        highRes.src = img.dataset.highres;

        highRes.onload = () =>
        {
          img.src = highRes.src;
          img.classList.remove('blur');

          // Increase loaded count
          imagesLoaded++;

          // If all images are loaded, manually signal
          if (imagesLoaded === imagesToLoad)
          {
            console.log('All images loaded!');
            window.dispatchEvent(new Event('load'));
          }
        };
      };

      observer.unobserve(img);
    }
  });
},
{
  rootMargin: '100px',
  threshold: 0.1
});

// Observe all images
document.querySelectorAll('#gallery img').forEach(img =>
{
  observer.observe(img);
});

window.onload = () => {
  console.log('Page fully loaded');

  if (imagesLoaded === imagesToLoad) {
    console.log('All images loaded!');
    //window.stop();//i got really tired of that spinny thing and not figuring out what was keeping the page in interactive mode
  }
};