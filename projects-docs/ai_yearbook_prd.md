# 📘 PRD: AI Yearbook Generator

## 1. Overview
**Product Name**: *AI Yearbook Generator*  
**Purpose**: Transform user photos into yearbook-style portraits from any chosen year or decade. Users can refine results with follow-up prompts.  
**Key Difference**: User images are not stored in the backend — they are saved locally (browser `localStorage`) and auto-deleted after 4 hours for privacy.  

---

## 2. Key Features

### 🔹 Core Features
1. **Image Upload**
   - User uploads photo (JPG/PNG/WebP).
   - Client-side validation (size, format).

2. **Year/Decade Selection**
   - Option to choose **decade** (e.g., 1920s, 1980s).
   - Or select **specific year** from a calendar picker.

3. **Custom Prompt (Optional)**
   - User can enter extra instructions (e.g., “make it a graduation photo”).
   - Final AI prompt combines year/decade + user input.

4. **AI Generation**
   - Send request to Gemini (`gemini-2.5-flash-image-preview`).
   - Inline image data + constructed text prompt.

5. **Result Page**
   - Display generated photo.
   - Actions:
     - Download
     - Share (social media with watermark)
     - **Follow-Up Prompt** → Regenerate with new instructions, using the same uploaded photo.

6. **Gallery (Local Only)**
   - Generated images stored in **localStorage** (not server DB).
   - Entries expire & auto-delete after **4 hours**.

---

### 🔹 Additional Features
- **Before/After Slider** → Compare original vs generated photo.
- **Regeneration Counter** → Show how many times a user refined the same photo.
- **Watermark** → App branding for free users.

---

## 3. User Flow

1. **Landing Page**
   - Showcase samples from different decades.
   - CTA: "Generate Your Yearbook Photo."

2. **Upload Flow**
   - Upload photo → select year/decade → (optional) add custom prompt.

3. **AI Generation**
   - Show loading animation (e.g., “Traveling back to 1980s…”).

4. **Result Page**
   - Generated photo displayed.
   - Options:
     - Download / Share / Save to Gallery
     - Enter follow-up prompt → Regenerate image.

5. **Local Gallery**
   - User sees previously generated images (stored in localStorage).
   - Images expire & vanish after 4 hours.

---

## 4. Technical Requirements

### Frontend
- **Framework**: Next.js + TailwindCSS + Framer Motion.
- **Core Components**:
  - Upload Component (drag & drop/file picker).
  - Year/Decade Picker (dropdown + calendar).
  - Result Page with follow-up prompt input.
  - Gallery grid (localStorage data).
  - Auto-expiry timer (JS-based, checks timestamps in localStorage).

### Backend
- **AI Model**: Gemini (`gemini-2.5-flash-image-preview`).
- **Prompt Structure**:
- **Storage**: 
- No images stored on backend DB.
- User images + results stored in browser `localStorage` with metadata `{ id, base64Data, timestamp }`.
- Auto-delete images > 4 hours old.

---

## 5. Database
Since images are not stored in DB, the backend DB is minimal:
- `users`: user_id, email, credits (for monetization).
- `logs` (optional): record usage counts for analytics (no images).

---

## 6. Monetization
- **Free Tier**:
- 1–2 free generations/day.
- Watermark on images.
- **Paid Tier**:
- Unlimited generations.
- No watermark.
- Higher resolution downloads.
- Faster generation queue.

---

## 7. Success Metrics (KPIs)
- Avg. generations per user/day.
- Follow-up prompt usage rate (% of users refining results).
- Retention rate (users returning within a week).
- Conversion from free → paid.
- Social shares (tracked via share button clicks).

---

## 8. Future Extensions
- Batch Generation: multiple decades in one go.
- Animated “Time Travel” video (morph through decades).
- AI Captions: Generate funny yearbook quotes with each image.
- Group Photos: Multi-user yearbook class photo.
- Mobile App: Offline gallery sync.

---
