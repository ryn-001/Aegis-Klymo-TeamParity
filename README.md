# [cite_start]Aegis: Secure & Ephemeral Networking [cite: 3]

[cite_start]Aegis is a privacy-first communication platform designed for **Klymo Ascent 1.0** [cite: 1] [cite_start]by **Team Parity**[cite: 2]. The platform leverages AI-driven verification and hardware-level identification to provide a secure environment with a strict **Zero-Retention Policy**.

---

## 🚀 Deployment Links
* [cite_start]**Frontend (App Demo):** [https://aegis-two-black.vercel.app/](https://aegis-two-black.vercel.app/) [cite: 8]
* [cite_start]**Backend:** [https://klymo.onrender.com](https://klymo.onrender.com) [cite: 8]
* [cite_start]**ML/Flask:** [https://schizoooo-klymo-hackathon.hf.space/classify](https://schizoooo-klymo-hackathon.hf.space/classify) [cite: 9]

---

## 🏗️ System Architecture
[cite_start]The platform is built on the principle of "Delete-after-verify" to ensure no personal data is stored[cite: 15].

### 1. Verification & Onboarding
* [cite_start]**Image Capture:** The process begins with real-time image capture on the Landing Page[cite: 13].
* [cite_start]**Secure Transit:** Images are sent to Cloudinary and processed by a Flask-based ML Model for gender classification[cite: 14, 21, 61].
* [cite_start]**Immediate Purge:** Following verification, the image is immediately deleted from Cloudinary regardless of the result[cite: 15, 100].
* [cite_start]**Pseudonymous Profiles:** Successful users proceed to set up profiles using animated avatars, nicknames, and bios rather than real-world identities[cite: 16, 80].

<img width="1320" height="889" alt="Blank diagram" src="https://github.com/user-attachments/assets/cf560b94-7e7a-44aa-aada-2ffdae22ff54" />

---

## 🤝 Intelligent Matchmaking
[cite_start]Aegis uses a 3-tier prioritized matchmaking engine to connect users efficiently[cite: 63, 51]:

| Priority | Tier | Logic Description |
| :--- | :--- | :--- |
| **Highest** | **Tier 1: Custom Interests** | [cite_start]Attempts to pair users with shared preferences[cite: 65, 72]. |
| **Middle** | **Tier 2: Gender** | [cite_start]Filters based on user-specified gender preferences[cite: 67, 74]. |
| **Lowest** | **Tier 3: FIFO** | [cite_start]Pairs the first two available users in the queue to minimize wait times[cite: 70, 75]. |

---

## 🛡️ Privacy & Abuse Prevention
### Device-Based Identification
* [cite_start]**No PII:** The system does not require emails or phone numbers[cite: 79].
* [cite_start]**Fingerprinting:** A unique Device ID is generated via `fingerprintjs` to track reporting history without needing a user's identity[cite: 84, 87].
* [cite_start]**Ban Logic:** Reports from users increment a ban count linked to the Device ID[cite: 57, 86].

| Number of Reports | Ban Duration |
| :--- | :--- |
| 3 Reports | [cite_start]6 Hours [cite: 123] |
| 5 Reports | [cite_start]12 Hours [cite: 123] |
| 10 Reports | [cite_start]24 Hours [cite: 123] |
| 20 Reports | [cite_start]Permanent Ban [cite: 123] |

### Ephemeral Data Policy
* [cite_start]**Zero Retention:** User records and chatrooms are purged from the database immediately upon disconnection or session termination[cite: 58, 91, 96].
* [cite_start]**Local History:** Chat histories are stored only in the user's `LocalStorage` and are never uploaded to a server[cite: 99].
* [cite_start]**Real-time Moderation:** Automated censorship monitors a blacklist of offensive words, blocking them before they reach the recipient[cite: 119, 120].


<img width="440" height="660" alt="Blank diagram (1)" src="https://github.com/user-attachments/assets/1dc85784-b9f3-420d-b96a-31b3724ab7c8" />

---

## 🛠️ Tech Stack
* [cite_start]**Frontend:** React, Material UI [cite: 61]
* [cite_start]**Backend:** Express, Socket.io, MongoDB, Fingerprint.js, Joi Validations, Crypto [cite: 61]
* [cite_start]**Machine Learning:** Flask, Hugging Face [cite: 61]

---

## 👥 Team Parity
* [cite_start]**Aryan Khaire** [cite: 5]
* [cite_start]**Sai Abhang** [cite: 5]
* [cite_start]**Chaitanya Patil** [cite: 6]
