---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Apply
---

<div class="wrapper">
  <section class="content-section fade-in-section">
    <h1>Apply for a Stella Maris Puppy</h1>
    <p>At Stella Maris, we carefully match each puppy with the right family. We believe this approach leads to the happiest puppies and the most satisfied families. Our application process helps us understand your lifestyle, expectations, and experience to make the best match possible.</p>
    
    <div class="image-text-container">
      <img src="assets/home_image1.jpg" alt="Portuguese Water Dog puppy" class="apply-image">
      <div class="text-content">
        <h3>Application Steps</h3>
        <ol class="application-steps">
          <li><strong>Submit Application</strong> - Complete our comprehensive application form below.</li>
          <li><strong>Interview & Discussion</strong> - We'll schedule a phone or video call to discuss your application.</li>
          <li><strong>Waiting List Placement</strong> - Approved applicants are placed on our waiting list.</li>
          <li><strong>Puppy Selection & Matching</strong> - Based on temperament assessments, we match puppies with families.</li>
          <li><strong>Bringing Home Your Puppy</strong> - Puppies go home between 8-10 weeks with a comprehensive puppy package.</li>
        </ol>
      </div>
    </div>
    
    <div class="owner-responsibilities fade-in-section">
      <h3>Owner Responsibilities</h3>
      <p>When you welcome a Stella Maris puppy into your home, we expect the following commitments:</p>
      <ul>
        <li>Providing high-quality nutrition and proper veterinary care</li>
        <li>Continuing the socialization process we've begun</li>
        <li>Enrolling in puppy training classes and providing ongoing training</li>
        <li>Regular grooming and coat maintenance</li>
        <li>Providing appropriate exercise and mental stimulation</li>
        <li>Keeping your dog in a safe, loving environment for life</li>
        <li>Staying in touch with updates and photos</li>
        <li>Contacting us first if you ever need to rehome your dog</li>
      </ul>
    </div>
    
    <div class="application-form fade-in-section">
      <h3>Puppy Application Form</h3>
      <form id="puppy-application" class="contact-form" action="https://formspree.io/f/mldgyypr" method="POST">
        <div class="form-section">
          <h4>Personal Information</h4>
          
          <div class="form-group">
            <label for="name">Full Name*</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address*</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number*</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
          
          <div class="form-group">
            <label for="address">Complete Address*</label>
            <textarea id="address" name="address" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="occupation">Occupation*</label>
            <input type="text" id="occupation" name="occupation" required>
          </div>
        </div>
        
        <div class="form-section">
          <h4>Household Information</h4>
          
          <div class="form-group">
            <label for="household-members">Who lives in your household? (Include ages of children)*</label>
            <textarea id="household-members" name="household" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="allergies">Does anyone in your home have allergies to dogs?*</label>
            <select id="allergies" name="allergies" required>
              <option value="">Please select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unsure">Unsure</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="home-type">Type of home*</label>
            <select id="home-type" name="home_type" required>
              <option value="">Please select</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="own-rent">Do you own or rent?*</label>
            <select id="own-rent" name="housing" required>
              <option value="">Please select</option>
              <option value="own">Own</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="yard">Do you have a fenced yard?*</label>
            <select id="yard" name="fenced_yard" required>
              <option value="">Please select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h4>Dog Experience & Preferences</h4>
          
          <div class="form-group">
            <label for="current-pets">Current pets in your household?*</label>
            <textarea id="current-pets" name="current_pets" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="previous-dogs">Previous dog experience?*</label>
            <textarea id="previous-dogs" name="dog_experience" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="pwds">Experience with Portuguese Water Dogs?*</label>
            <textarea id="pwds" name="pwd_experience" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="gender-preference">Gender preference?</label>
            <select id="gender-preference" name="gender_preference">
              <option value="">No preference</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="color-preference">Color preference?</label>
            <select id="color-preference" name="color_preference">
              <option value="">No preference</option>
              <option value="black">Black</option>
              <option value="brown">Brown</option>
              <option value="white">White</option>
              <option value="parti">Parti (black & white or brown & white)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="coat-preference">Coat preference?</label>
            <select id="coat-preference" name="coat_preference">
              <option value="">No preference</option>
              <option value="curly">Curly</option>
              <option value="wavy">Wavy</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="plans">What are your plans for this dog? (Check all that apply)</label>
            <div class="checkbox-group">
              <input type="checkbox" id="plan-companion" name="plans[]" value="companion">
              <label for="plan-companion">Family Companion</label>
              
              <input type="checkbox" id="plan-show" name="plans[]" value="show">
              <label for="plan-show">Show Dog</label>
              
              <input type="checkbox" id="plan-performance" name="plans[]" value="performance">
              <label for="plan-performance">Performance Events (agility, obedience, etc.)</label>
              
              <input type="checkbox" id="plan-water" name="plans[]" value="water">
              <label for="plan-water">Water Work</label>
              
              <input type="checkbox" id="plan-therapy" name="plans[]" value="therapy">
              <label for="plan-therapy">Therapy Dog</label>
              
              <input type="checkbox" id="plan-breeding" name="plans[]" value="breeding">
              <label for="plan-breeding">Breeding</label>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="additional-info">Additional information or questions?</label>
          <textarea id="additional-info" name="additional_info"></textarea>
        </div>
        
        <!-- Anti-spam honeypot field (hidden) -->
        <input type="text" name="_gotcha" style="display:none">
        
        <!-- Identify which form was submitted -->
        <input type="hidden" name="form-type" value="puppy-application">
        
        <!-- Redirect after submission -->
        <input type="hidden" name="_next" value="https://stellamaris.com/thanks.html">
        
        <button type="submit" class="submit-button">Submit Application</button>
      </form>
    </div>
    
    <div class="centered-content">
      <img src="assets/home_image2.jpg" alt="Portuguese Water Dog family" class="centered-image">
      <h2>Finding the Perfect Match for Every Puppy</h2>
    </div>
  </section>
</div>
