---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Contact
---

<div class="wrapper">
  <section class="content-section fade-in-section">
    <h1>Contact Stella Maris Kennel</h1>
    <p>We're always happy to hear from Portuguese Water Dog enthusiasts, prospective puppy families, and fellow breeders. Whether you have questions about our dogs, breeding program, or available puppies, we're here to help.</p>
    
    <div class="contact-container">
      <div class="contact-info">
        <img src="assets/arthy_hero.jpg" alt="Portuguese Water Dog contact" class="contact-image">
        <h3>Contact Information</h3>
        <div class="contact-details">
          <div class="contact-item">
            <i class="contact-icon location-icon"></i>
            <div class="contact-text">
              <h4>Location</h4>
              <p>Sofia, Bulgaria</p>
            </div>
          </div>
          
          <div class="contact-item">
            <i class="contact-icon phone-icon"></i>
            <div class="contact-text">
              <h4>Phone</h4>
              <p>+359 897 014 015</p>
            </div>
          </div>
          
          <div class="contact-item">
            <i class="contact-icon email-icon"></i>
            <div class="contact-text">
              <h4>Email</h4>
              <p>hello@stellamaris.dog</p>
            </div>
          </div>
          
          <div class="contact-item">
            <i class="contact-icon social-icon"></i>
            <div class="contact-text">
              <h4>Social Media</h4>
              <div class="social-links">
                <a href="https://facebook.com/portuguesewaterdogbulgaria" target="_blank" class="social-link">Facebook</a>
                <a href="https://instagram.com/pwdbulgaria" target="_blank" class="social-link">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="contact-hours">
          <h4>Best Times to Contact</h4>
          <p>We're generally available to respond to inquiries between 9:00 AM and 7:00 PM Central European Time (CET).</p>
          <p>Please allow up to 48 hours for a response, as we are often busy caring for our dogs.</p>
        </div>
      </div>
      
      <div class="contact-form-container">
        <h3>Send Us a Message</h3>
        <form id="contact-form" class="contact-form" action="https://formspree.io/f/myzkqqny" method="POST">
          <div class="form-group">
            <label for="contact-name">Your Name*</label>
            <input type="text" id="contact-name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="contact-email">Your Email*</label>
            <input type="email" id="contact-email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="contact-phone">Phone Number</label>
            <input type="tel" id="contact-phone" name="phone">
          </div>
          
          <div class="form-group">
            <label for="contact-subject">Subject*</label>
            <select id="contact-subject" name="subject" required>
              <option value="">Please select</option>
              <option value="puppy-inquiry">Puppy Inquiry</option>
              <option value="breeding-inquiry">Breeding Inquiry</option>
              <option value="general-question">General Question</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="contact-message">Your Message*</label>
            <textarea id="contact-message" name="message" rows="5" required></textarea>
          </div>
          
          <!-- Anti-spam honeypot field (hidden) -->
          <input type="text" name="_gotcha" style="display:none">
          
          <!-- Redirect after submission -->
          <input type="hidden" name="_next" value="https://stellamaris.dog/thanks.html">
          
          <button type="submit" class="submit-button">Send Message</button>
        </form>
      </div>
    </div>
    
    <div class="faq-section fade-in-section">
      <h3>Frequently Asked Questions</h3>
      
      <div class="faq-item">
        <h4>Do you ship puppies internationally?</h4>
        <p>Yes, we do work with families internationally. We can arrange for safe puppy transport to many countries, following all necessary regulations and ensuring the puppy's comfort throughout the journey. Additional fees apply for international placements.</p>
      </div>
      
      <div class="faq-item">
        <h4>How long is your waiting list typically?</h4>
        <p>Our waiting list varies in length depending on the time of year and planned litters. Generally, expect a wait of 6-12 months from application to bringing home a puppy. The wait may be shorter or longer based on your specific preferences and needs.</p>
      </div>
      
      <div class="faq-item">
        <h4>What health testing do you perform on your breeding dogs?</h4>
        <p>All our breeding dogs undergo comprehensive health testing including OFA hip and elbow evaluations, CERF eye examinations, and genetic testing for breed-specific conditions such as PRA/PRCD, GM-1, and JDCM. We only breed dogs that have passed all health clearances.</p>
      </div>
      
      <div class="faq-item">
        <h4>Do you offer any support after we take our puppy home?</h4>
        <p>Absolutely! We provide lifetime support for all Stella Maris puppies. This includes guidance on training, nutrition, grooming, health concerns, and any other questions that may arise throughout your dog's life. We consider our puppy families part of our extended family.</p>
      </div>
    </div>
    
    <div class="centered-content">
      <img src="assets/home_image3.jpg" alt="Portuguese Water Dog" class="centered-image">
      <h2>We Look Forward to Hearing from You</h2>
    </div>
  </section>
</div>