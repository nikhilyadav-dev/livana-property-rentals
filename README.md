# 🏡 Livana Full-Stack Web Application

A production-grade, full-stack web application inspired by Airbnb.  
Built using **Node.js**, **Express.js**, **MongoDB**, and enhanced with **cloud image storage**, **social login**, **map integration**, and **secure authentication systems**.

---

## 🎯 Project Overview

This project recreates the essential workflow of Airbnb with a focus on **property listings**, **user accounts**, **reviews**, and **location-based interactions**.  
The system supports multiple authentication strategies, secure session handling, image uploads, and dynamically rendered UI templates.

## 📸 Screenshots 
Here's a visual tour of AI Career Forge:

| Screenshot 1 | Screenshot 2 |
|--------------|--------------|
| ![Screenshot 1](/screenshots/1-Home-Page.jpg) | ![Screenshot 2](/screenshots/2-Filter-Option.jpg) |
| *All Listings* | *Filter Listings* |

| Screenshot 3 | Screenshot 4 |
|--------------|--------------|
| ![Screenshot 3](/screenshots/3-Login-Page.jpg) | ![Screenshot 4](/screenshots/4-Signup-Page.jpg) |
| *Login Page* | *Signup Page* |

| Screenshot 5 | Screenshot 6 |
|--------------|--------------|
| ![Screenshot 5](/screenshots/5-Contact-Us-Page.jpg) | ![Screenshot 6](/screenshots/6-List-Your-Property.jpg) |
| *Contact Us Page* | *List Your Property* |

| Screenshot 7 | Screenshot 8 |
|--------------|--------------|
| ![Screenshot 7](/screenshots/7-Listing-Images.jpg) | ![Screenshot 8](/screenshots/8-Lisitng-Details(1).jpg) |
| *Property Details* | *More About Property* |

| Screenshot 9 | Screenshot 10 |
|--------------|--------------|
| ![Screenshot 9](/screenshots/9-Lisitng-Details(2).jpg) | ![Screenshot 10](/screenshots/10--Review-Lisitng.jpg) |
| *Calender UI* | *Add Review* |

| Screenshot 11 | Screenshot 12 |
|--------------|--------------|
| ![Screenshot 9](/screenshots/11-All-Reviews.jpg) | ![Screenshot 10](/screenshots/12-Map-Feature.jpg) |
| *All Reviews* | *Map Feature* |

---

## 🚀 Key Features Implemented

- **🔐 User Authentication**  
  Login, logout, registration, profile management.

- **🏠 Listings Management (CRUD)**  
  Add, edit, delete, and explore listings with full validation.

- **🖼️ Image Uploads**  
  Optimized cloud storage using Cloudinary.

- **🗺️ Interactive Location Maps**  
  Mapbox-based geolocation and listing markers.

- **📝 Review System**  
  Users can add/delete reviews with rating logic.

- **👤 Account Management**  
  Update user profile, password, and personal listings.

- **🔒 Data Security**  
  Password hashing, cookie security, and session protection.

- **🌐 Social Authentication**  
  Login via:
  - Google  
  - Facebook  
  - Standard email/password  

---

## 🛠️ Technologies & Packages Used

| Category          | Tools / Libraries |
|------------------|-------------------|
| **Backend**      | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication**| Passport.js, Passport Local, Google OAuth20, Facebook OAuth |
| **Image Storage**| Cloudinary, Multer |
| **Geolocation**  | Mapbox |
| **Templating**   | EJS |
| **Validation**   | Joi |
| **Sessions**     | Cookie Parser, Connect-Flash, Connect-Mongo |
| **Environment**  | Dotenv |

---

### 📁 Detailed Project Structure

```

livana-property-rentals/
│
├── 🎮 controllers/                        # Core business logic for each module
│   ├── facebookAuth.js                   # Facebook OAuth login controller
│   ├── googleAuth.js                     # Google OAuth2 authentication logic
│   ├── listings.js                       # CRUD operations for property listings
│   ├── reviews.js                        # Review handling (add/delete)
│   └── users.js                          # User account & profile management
│
├── ⚙️ init/                               # Database seeding & initialization
│   ├── data.js                           # Initial listing dataset for seeding
│   ├── data2.js                          # Additional seed data
│   └── index.js                          # Main script to run seed operations
│
├── 🧱 models/                             # Mongoose schemas & DB entities
│   ├── listing.js                        # Listing schema (title, price, images, geometry)
│   ├── review.js                         # Review schema (rating + comment)
│   └── user.js                           # User schema (auth methods + profile)
│
├── 🌐 public/                             # Client-side static assets
│   ├── asset/                            # Images, icons & static media
│   │   ├── 9515711c2027...jpg            # Sample listing image
│   │   ├── calender.jpg                  # UI asset
│   │   ├── calender2.png                 # UI asset
│   │   ├── facebook.svg                  # Facebook icon (footer/social auth)
│   │   ├── home-marker.png               # Mapbox marker icon
│   │   ├── insta.svg                     # Instagram logo
│   │   ├── twitter.svg                   # Twitter logo
│   │   └── User-Profile.jpg              # Default user profile
│   │
│   ├── css/                              # Page-specific and shared styles
│   │   ├── contact.css                   # Contact page styling
│   │   ├── editPage.css                  # Edit listing page UI
│   │   ├── filterbtn.css                 # Filter buttons layout
│   │   ├── footer.css                    # Footer component styling
│   │   ├── index.css                     # Homepage styles
│   │   ├── login.css                     # Login page UI
│   │   ├── navbar.css                    # Navigation bar styling
│   │   ├── newListing.css                # "List your property" creation page
│   │   ├── propertyList.css              # User's listed properties
│   │   ├── ratings.css                   # Ratings UI component
│   │   ├── showPage.css                  # Individual listing UI
│   │   ├── signup.css                    # Signup page styling
│   │   ├── style.css                     # Global stylesheet
│   │   └── wishList.css                  # Wishlist page layout
│   │
│   └── js/                               # Client-side behavior & interactive scripts
│       ├── filterIcon.js                 # Filtering animation logic
│       ├── index.js                      # Homepage dynamic features
│       ├── map.js                        # Mapbox map rendering logic
│       ├── navbar.js                     # Navbar scroll and toggle control
│       ├── propertyList.js               # User property list actions
│       ├── script.js                     # Global JS functions
│       └── slider.js                     # Image slider/carousel logic
│
├── 🚏 routes/                             # Express route definitions
│   ├── facebookAuth.js                   # Facebook login routes
│   ├── googleAuth.js                     # Google login routes
│   ├── listing.js                        # Listing CRUD routes
│   ├── review.js                         # Review operations routes
│   └── user.js                           # User account routes
│
├── 📸 screenshots/                        # Demo screenshots for README
│   ├── 1-Home-Page.jpg                   # Home page preview
│   ├── 10--Review-Lisitng.jpg            # Review submission screen
│   ├── 11-All-Reviews.jpg                # All reviews page
│   ├── 12-Map-Feature.jpg                # Mapbox preview
│   ├── 2-Filter-Option.jpg               # Filtering UI
│   ├── 3-Login-Page.jpg                  # Login page
│   ├── 4-Signup-Page.jpg                 # Signup UI
│   ├── 5-Contact-Us-Page.jpg             # Contact form
│   ├── 6-List-Your-Property.jpg          # New listing page
│   ├── 7-Listing-Images.jpg              # Gallery preview
│   ├── 8-Lisitng-Details(1).jpg          # Listing details part 1
│   └── 9-Lisitng-Details(2).jpg          # Listing details part 2
│
├── 🛠️ utils/                              # Helper classes & reusable utilities
│   ├── ExpressError.js                   # Custom error handling class
│   ├── generateEmailTempltae.js          # Email template generator
│   ├── sendEmail.js                      # Nodemailer email sender
│   └── wrapAsync.js                      # Async error handling wrapper
│
├── 🖼️ views/                              # EJS templates (server-side rendered UI)
│   ├── includes/                         # Shared UI components
│   │   ├── filterbtn.ejs                 # Filter component
│   │   ├── flash.ejs                     # Flash message renderer
│   │   ├── footer.ejs                    # Footer layout
│   │   └── navbar.ejs                    # Navbar component
│   │
│   ├── layouts/                          # Base templates
│   │   └── boilerPlate.ejs               # Main HTML layout wrapper
│   │
│   ├── listings/                         # Listing-related pages
│   │   ├── edit.ejs                      # Edit listing page
│   │   ├── index.ejs                     # All listings UI
│   │   ├── new.ejs                       # Create new listing
│   │   └── show.ejs                      # Listing details page
│   │
│   ├── users/                            # User-specific pages
│   │   ├── contact.ejs                   # Contact page
│   │   ├── login.ejs                     # Login page
│   │   ├── propertyList.ejs              # User's property dashboard
│   │   ├── signup.ejs                    # Register new account
│   │   └── wishList.ejs                  # Wishlist UI
│   │
│   └── error.ejs                         # Error fallback template
│
├── 🔧 Root Files
│   ├── .env                              # Environment variables
│   ├── .gitignore                        # Git ignored files
│   ├── app.js                            # Main Express server entry
│   ├── cloudConfig.js                    # Cloudinary configuration
│   ├── data.js                           # Legacy data loading
│   ├── middleware.js                     # Authentication & validation middlewares
│   ├── package-lock.json                 # Dependency lock file
│   ├── package.json                      # Project metadata + dependencies
│   └── schema.js                         # Joi validation schemas

```
### User Workflow 📊

1. 👉 User signs up or logs in
2. 🏠 User creates a property listing
3. 🖼️ Uploads images (sent to Cloudinary)  
4. 🗺️ Picks listing location using Mapbox  
5. ⭐ Other users leave reviews  
6. ✏️ Users manage listings (edit/delete)  
7. 👤 User updates profile & account data

---

### 📦 Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Airbnb_Clone.git
cd Airbnb_Clone
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Add Environment Variables

Create a .env file:
    
    ```bash
    #https://cloudinary.com/  (Cloudinary) (Change key)
    CLOUD_NAME=kjkdmckdhjks
    CLOUD_API_KEY=89340593499490394
    CLOUD_API_SECRET=jdskLKJlklkdlsdfkKKdsdkkd

    #https://www.mapbox.com/ (Mapbox)
    MAP_TOKEN=pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ

    #https://www.mongodb.com/ (MongoDb Atlas) (Change key)
    ATLASDB_URL=mongodb+srv://demo:kLKJFKOEMNDDOI9089dndd@cluster0.kkdnvkdkds.mongodb.net/?retryWrites=true&w=majority

    #Add Random Secret Key
    SECRET=ckcdenlksufoifafknddsoiddfkadsfafd

    #https://console.developers.google.com/ (Google Developer Console) (Change key)
    GOOGLE_CLIENT_ID=89038948394-kjfdkcmckdmckdfsid94jkkknd9sd4.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=KDJKDF-4KJDF894NF-DFKEF9MN-NFKEJD

    #https://developers.facebook.com/ (Facebook Developer Console) (Change key)
    FACEBOOK_APP_ID=94383859383287
    FACEBOOK_APP_SECRET=89diodfjd9r98ddfjsodwj9df8d

    #Add redirect URL in Google Developer Console
    GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

    #Add redirect URL in Facebook Developer Console
    FACEBOOK_CALLBACK_URL=http://localhost:8080/auth/facebook/callback

    ```

    Replace the values with your specific configurations.

### 4️⃣ Run the Application

    ```bash
    node app.js
    ```

### 5️⃣ Open App in Browser

    Open `http://localhost:8080/listings` in your web browser.


---
👤 Author

Nikhil Yadav 
📧 Email: nikhilyadav.prof@gmail.com
🔗 LinkedIn: `www.linkedin.com/in/nikhilyadav-developer`


