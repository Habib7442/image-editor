# 📘 PRD: AI Mockup Studio

## 1. Overview
**Product Name**: *AI Mockup Studio*  
**Purpose**: Allow users to place their images (photos, logos, products) into realistic mockups using either **text-to-image** or **image-to-image** workflows.  
**Differentiator**: Combines AI flexibility (prompt-driven) with predefined mockup categories and optional user-uploaded target images for precise placement.  

---

## 2. Key Features

### 🔹 Modes

#### 1. Text-to-Image Mode
- User uploads **main image** (selfie, product, logo).  
- Options:
  - Select a **predefined mockup type** (e.g., Billboard, Subway Board, Mug, T-Shirt, Magazine Cover).  
  - Enter **custom text prompt** (optional).  
  - Choose a **primary color** to influence final output aesthetics (optional).  
- AI generates the final mockup using uploaded photo + prompt.

#### 2. Image-to-Image Mode
- User uploads:
  - **Main Image** → photo/logo they want to place.  
  - **Target Image** → mockup/background (optional).  
- Optional prompt: “Place this photo on the left poster,” or “Make this logo fit the coffee cup.”  
- AI generates a composite image placing the main image into the target scene.  

---

### 🔹 Additional Features
- **Download / Share** → Export with or without watermark.  
- **Refinement Prompts** → On result page, user can enter a new prompt to regenerate.  
- **History (Local Only)** → Store generated mockups in `localStorage` (auto-delete after 4 hrs).  
- **Primary Color Influence** → Selected color adjusts lighting, background tint, or design tone.  
- **Predefined Mockup Names Only** → No need to show actual mockup images upfront; AI interprets based on category name.  

---

## 3. User Flow

1. **Landing Page**
   - CTA: “Create Your Mockup in Seconds.”  
   - Show examples: billboard, magazine cover, t-shirt, etc.

2. **Upload Step**
   - Upload main image (required).  
   - Choose **Text-to-Image Mode** or **Image-to-Image Mode**.  

3. **Mode Flow**
   - **Text-to-Image**:
     - Pick mockup name (dropdown).  
     - Select primary color (color picker).  
     - Enter optional prompt.  
   - **Image-to-Image**:
     - Upload target image.  
     - Enter optional prompt (“Place my photo on the right screen”).  

4. **AI Generation**
   - Loading animation (“Placing your image on [Billboard]...”).  

5. **Result Page**
   - Show generated mockup.  
   - Options: Download, Share, Refine with prompt.  
   - Auto-save to localStorage.  

6. **Gallery**
   - Local gallery of recent mockups.  
   - Auto-expire after 4 hours.  

---

## 4. Technical Requirements

### Frontend
- **Framework**: Next.js, TailwindCSS, Framer Motion.  
- **Components**:
  - Upload (drag & drop).  
  - Mode toggle (Text-to-Image vs Image-to-Image).  
  - Dropdown for predefined mockups.  
  - Color Picker.  
  - Prompt input field.  
  - Result viewer + download/share buttons.  
  - Local gallery grid.  

### Backend
- **AI Model**: Gemini (`gemini-2.5-flash-image-preview`).  
- **Prompt Structure (Text-to-Image)**:
"Insert this uploaded image into a realistic [mockup_name] design.
Apply a primary color tone of [selected color].
[Optional: user custom prompt]."

- **Prompt Structure (Image-to-Image)**:


"Take the main uploaded image and place it realistically into the target image.
Ensure natural perspective, lighting, and alignment.
[Optional: user prompt for placement details]."
- **Storage**:
- Images not stored on backend DB.
- LocalStorage (browser) with timestamp.
- Auto-delete after 4 hrs.  

---

## 5. Database
Minimal DB since images are not saved:  
- `users`: user_id, email, credits.  
- `logs`: generation count, mode used, mockup type.  
(Images remain client-side in localStorage only).  

---

## 6. Monetization
- **Free Tier**:
- Limited mockups/day (e.g., 2–3).  
- Watermark applied.  
- **Paid Tier**:
- Unlimited mockups.  
- HD export without watermark.  
- Premium mockup categories (luxury packaging, futuristic billboards, animated mockups).  

---

## 7. Success Metrics (KPIs)
- Avg. mockups generated per user/day.  
- Ratio of text-to-image vs image-to-image usage.  
- Follow-up refinement rate (% of users improving results).  
- Conversion free → paid.  
- Social share rate (mockups shared externally).  

---

## 8. Future Extensions
- **Batch Mode** → Generate 3–5 variations at once.  
- **Animated Mockups** → Short reel showing logo/photo on rotating billboard/mug.  
- **Team Mode** → Let users collaborate on brand/product mockups.  
- **Marketplace** → Designers can upload their own target mockup images (Image-to-Image).  

---
