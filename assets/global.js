window.addEventListener('scroll', function() {
  // Get all elements with the class 'parallax-image'
  var parallaxImages = document.querySelectorAll('.parallax-image');
  var scrollPosition = window.pageYOffset;

  // Loop through each parallax image
  parallaxImages.forEach(function(image) {
    // Get the data-parallax-factor attribute or use a default value
    var parallaxFactor = parseFloat(image.dataset.parallaxFactor) || 0.2; 
    
    // Get the data-parallax-offset attribute or use a default value
    var parallaxOffset = parseFloat(image.dataset.parallaxOffset) || 100;

    // Adjust the background position based on the factor and offset
    var backgroundPositionY = (scrollPosition * parallaxFactor - parallaxOffset) + 'px';
    image.style.backgroundPositionY = backgroundPositionY;
  });
});

function startSlideshow() {
  const images = document.querySelectorAll('.square-image');
  let currentIndex = 0;

  // First make sure all images are visible but opacity 0
  images.forEach(img => {
    img.style.display = 'block';
    img.opacity = 0;
  });

  // Show first image initially
  images[0].classList.add('active');
  
  function changeImage() {
    // Remove active class from current image
    images[currentIndex].classList.remove('active');
    
    // Update index
    currentIndex = (currentIndex + 1) % images.length;
    
    // Add active class to next image
    images[currentIndex].classList.add('active');
  }

  // Change image every 3 seconds
  return setInterval(changeImage, 3000);
}

function startCarousel() {
  const items = document.querySelectorAll('.carousel > div');
  let currentIndex = 0;

  function changeItem() {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }

  // Change image every 3 seconds
  return setInterval(changeItem, 3000);
}

function slidein() {
  // Select all elements with the fade-in-section class
  const fadeElements = document.querySelectorAll('.fade-in-section');

  // Create an Intersection Observer instance
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
          }
          else {
              entry.target.classList.remove('is-visible');
          }
      });
  }, {
      // Observer options
      threshold: 0.3, // Trigger when at least 30% of the element is visible
      rootMargin: '0px' // No margin around the viewport
  });

  // Start observing each fade element
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}


// Start the slideshow immediately
document.addEventListener('DOMContentLoaded', startSlideshow);
document.addEventListener('DOMContentLoaded', slidein);
document.addEventListener('DOMContentLoaded', startCarousel);