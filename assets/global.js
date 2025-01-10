window.addEventListener('scroll', function() {
  var heroImage = document.querySelector('.hero-image');
  var scrollPosition = window.pageYOffset;

  // Adjust the factor to control the parallax effect
  var backgroundPositionY = (scrollPosition * 0.2 - 100) + 'px'; 
  heroImage.style.backgroundPositionY = backgroundPositionY;
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

// Start the slideshow immediately
startSlideshow();

//add the scroll to set visible class