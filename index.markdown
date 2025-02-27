---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Home
permalink: /
namespace: home
---

<div class="parallax-image" style="background-image: url('{{ "/assets/hero_image.jpeg" | prepend: site.baseurl_root }}')">
  <div class="parallax-text">
    <h1>{% t pages.home.hero_heading %}</h1>
  </div>
</div>

<div class="wrapper">
  <section class="three-column-section">
    <h2 class="section-title fade-in-section">{% t pages.home.section_title %}</h2>
    <div class="image-container">
      <img src="{{ "/assets/home_image1.jpg" | prepend: site.baseurl_root }}" alt="The puppy Amadeus Mozart" class="square-image">
      <img src="{{ "/assets/home_image2.jpg" | prepend: site.baseurl_root }}" alt="The puppy Alma Sol" class="square-image">
      <img src="{{ "/assets/home_image3.jpg" | prepend: site.baseurl_root }}" alt="The dog Arthur Rubinstein" class="square-image">
    </div>
    <p class="fade-in-section">
      {% t pages.home.community_text %}
    </p>
  </section>
</div>

<div class="wrapper">
    <h2>{% t pages.home.what_sets_apart %}</h2>
    <div class="container">
        <div class="column">
            <h3>{% t pages.home.experience_title %}</h3>
            <p>{% t pages.home.experience_text %}</p>
        </div>
        <div class="column">
            <h3>{% t pages.home.handling_title %}</h3>
            <p>{% t pages.home.handling_text %}</p>
        </div>
        <div class="column">
            <h3>{% t pages.home.passion_title %}</h3>
            <p>{% t pages.home.passion_text %}</p>
        </div>
        <div class="column">
            <h3>{% t pages.home.hobby_title %}</h3>
            <p>{% t pages.home.hobby_text %}</p>
        </div>
    </div>
</div>

<div class="parallax-image" data-parallax-offset="400" style="background-image: url('{{ "/assets/home_image1.jpg" | prepend: site.baseurl_root }}')">
  <div class="parallax-text">
    <h2>{% t pages.home.testimonials_heading %}</h2>
    <div class="carousel">
      <div class="active">{% t pages.home.testimonial1 %}</div>
      <div>{% t pages.home.testimonial2 %}</div>
      <div>{% t pages.home.testimonial3 %}</div>
    </div>
  </div>
</div>