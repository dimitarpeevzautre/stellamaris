---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Home
---

<div class="hero-image parralax" style="background-image: url('assets/arthy_hero.jpg')">
  <div class="hero-text">
    <h1>Breeding quality PWD dogs since 2005</h1>
  </div>
</div>

<script>
window.addEventListener('scroll', function() {
  var heroImage = document.querySelector('.hero-image');
  var scrollPosition = window.pageYOffset;

  // Adjust the factor to control the parallax effect
  var backgroundPositionY = scrollPosition * 0.3 + 'px'; 
  heroImage.style.backgroundPositionY = backgroundPositionY;
});
</script>