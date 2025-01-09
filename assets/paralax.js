window.addEventListener('scroll', function() {
    var heroImage = document.querySelector('.hero-image');
    var scrollPosition = window.pageYOffset;
  
    // Adjust the factor to control the parallax effect
    var backgroundPositionY = (scrollPosition * 0.2 - 100) + 'px'; 
    heroImage.style.backgroundPositionY = backgroundPositionY;
  });