# 📄 Product Requirements Document (PRD)  
**Product Name:** (TBD – suggest branding later)  
**Version:** v1.0  
**Prepared by:** Habib Tanwir Laskar  
**Date:** 2025-09-01  

---

## 1. 🎯 Product Overview
This SaaS application leverages **Google Gemini Flash** models to provide users with AI-powered creative tools. The app will host multiple **mini-apps** under one platform, allowing users to perform specialized AI tasks.  

For the initial launch (MVP), the platform will focus on two mini-apps:  
1. **YouTube Thumbnail Generator** – Generate engaging, high-quality thumbnails tailored for YouTube creators.  
2. **Decades Photoshoot Generator** – Transform user photos into styles from different decades (e.g., 1920s, 1960s, 1990s, futuristic).  

Future roadmap will include additional mini-apps such as ad creatives, blog banners, LinkedIn headshots, etc.  

---

## 2. 🚀 Goals & Objectives
- Provide a **centralized SaaS platform** with modular mini-apps.  
- Enable **content creators and marketers** to generate creative assets quickly.  
- Differentiate by offering **fast, lightweight AI (Gemini Flash)** for cost efficiency.  
- Create a **scalable architecture** so new mini-apps can be easily plugged in.  

---

## 3. 🧑‍🤝‍🧑 Target Users
- **YouTube Creators** (individuals, small channels, content creators).  
- **Influencers & Social Media Managers** (require quick, branded assets).  
- **Students & Professionals** (resume/portfolio visuals, decade-styled shoots).  
- **Businesses** (UGC creators, marketing teams).  

---

## 4. 📦 Product Features

### 4.1 Core Platform Features
- **Authentication & User Management**  
  - Email/Google Sign-in  
  - User dashboard with credits/usage tracking  
- **Subscription & Billing**  
  - Free tier with limited credits  
  - Paid plans (monthly/yearly, credit-based)  
- **Mini-App Marketplace**  
  - Modular design where users can access current & upcoming mini-apps  
  - Each mini-app has its own UI/UX but shares the same backend  

---

### 4.2 Mini-App 1: YouTube Thumbnail Generator
**Objective:** Create eye-catching thumbnails optimized for YouTube CTR.  

**Features:**  
- Input:  
  - Title/keywords of video  
  - Optional uploaded image (face/logo/screenshot)  
- Output:  
  - 3–5 generated thumbnails (16:9, 1280x720)  
  - Different styles (minimalist, bold text, cinematic, playful)  
- Customization:  
  - Text overlay editor (change font, size, color)  
  - Brand color & logo insertion  
- Export:  
  - Download in JPG/PNG  
  - Save to user’s gallery  

---

### 4.3 Mini-App 2: Decades Photoshoot Generator
**Objective:** Allow users to transform uploaded photos into portraits styled by different decades.  

**Features:**  
- Input:  
  - User uploads photo(s)  
  - Select decade (1920s, 1960s, 1980s, 2000s, Future style)  
- Output:  
  - Generated styled portraits with background/attire  
- Customization:  
  - Adjust intensity of style (subtle → strong)  
  - Change background theme  
- Export:  
  - Download in HD JPG/PNG  
  - Option to generate multiple variations  

---

### 4.4 Mini-App 3: AI Yearbook Generator
**Objective:** Transform user photos into vintage yearbook-style portraits from any chosen year or decade.

**Features:**
- Input:
  - User uploads photo
  - Select specific year or decade (e.g., 1980s, 1995)
  - Optional custom instructions for specific details
- Output:
  - Generated yearbook-style portrait with authentic vintage appearance
- Customization:
  - AI-powered prompt enhancement for better results
  - Before/after comparison view
- Export:
  - Download in HD JPG/PNG
  - Option to regenerate with different prompts

---

## 5. 🛠 Technical Requirements

### 5.1 Frontend
- **Framework:** Next.js 14 + Tailwind CSS + ShadCN UI  
- **UI Libraries:** Framer Motion (animations), Headless UI (modals, dropdowns)  
- **File Handling:** Image upload (Drag & Drop, Camera upload)  

### 5.2 Backend
- **API Orchestration:** Node.js + Express / Next.js API routes  
- **AI Integration:** Google Gemini Flash (via Vertex AI endpoints), Perplexity API (for prompt enhancement)
- **Database:** Convex / Supabase (user accounts, credits, image metadata)  
- **Storage:** Google Cloud Storage / Supabase Storage (for images)  

### 5.3 AI Workflow
- **YouTube Thumbnail Generator**  
  1. User inputs text + optional image  
  2. Prompt enhancement via Perplexity API for better results
  3. Prompt construction → Gemini Flash → returns candidate designs  
  4. Render designs → allow user to edit/export  

- **Decades Photoshoot Generator**  
  1. User uploads photo  
  2. Prompt construction with style descriptor ("Generate portrait in 1960s film style…")  
  3. Gemini Flash image generation  
  4. Post-processing (filters, upscaling if required)  

- **AI Yearbook Generator**
  1. User uploads photo
  2. User selects year/decade and optional custom instructions
  3. Prompt enhancement via Perplexity API for authentic vintage styling
  4. Prompt construction → Gemini Flash → returns yearbook-style portrait
  5. Render design → allow user to download

---

## 6. 📊 Success Metrics
- **Activation:** % of new users generating at least 1 asset  
- **Engagement:** Avg. number of generations per user per week  
- **Retention:** % of users returning within 7 days  
- **Conversion:** Free → Paid plan conversion rate  
- **Performance:** Average response time per generation < 5 sec (Gemini Flash optimized)  

---

## 7. 🔒 Security & Compliance
- GDPR-compliant data handling  
- Encrypted file storage & transfer (HTTPS, GCS encryption)  
- Age-appropriate content filters (prevent misuse in photoshoot app)  

---

## 8. 📅 Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Dashboard, Billing, Mini-App 1 (Thumbnail), Mini-App 2 (Photoshoot), Mini-App 3 (Yearbook Generator) | 6–8 weeks |
| **Phase 2** | Team accounts, More mini-apps (Ad creatives, Blog banners) | +2 months |
| **Phase 3** | Mobile app (React Native Expo), Advanced editor | +3 months |

---

## 9. 🧪 Testing Strategy
- **Unit Tests:** UI, API, and AI prompt logic  
- **Integration Tests:** File upload, billing, and AI response  
- **User Testing:** Small group of creators for feedback before public launch  

---

## 10. 💰 Monetization
- **Free Tier:** 10 free generations/month  
- **Pro Tier:** $9.99/month – 300 generations, HD exports  
- **Enterprise Tier:** Custom pricing – bulk generations, API access  
