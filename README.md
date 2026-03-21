# NoFap Streak Tracker

A simple and private streak tracker designed to help users build discipline, track progress, and stay accountable. The app allows users to monitor their streak, record relapses, and visualize their self-improvement journey.

## 🚀 Features

* **Streak Counter**

  * Track current streak in days
  * View longest streak achieved
  * Automatically reset streak after relapse

* **Daily Check-in**

  * Mark a day as successful
  * Log relapses
  * Add optional notes for each day

* **Statistics Dashboard**

  * Total days tracked
  * Total relapses
  * Success rate percentage
  * Visual progress overview

* **Motivation System**

  * Daily motivational quotes
  * Random quote generator
  * Focus on discipline, focus, and self-control

* **Privacy First**

  * No login required
  * No cloud storage
  * All data stored locally on the device

* **Clean UI**

  * Minimal interface
  * Dark theme
  * Fast and distraction-free experience

---

## 🛠 Tech Stack

* **React (JSX)**
* **JavaScript**
* **Local Storage** for saving user data
* **CSS / Tailwind (optional depending on implementation)**

---

## 📂 Project Structure

```
/src
  /components
    StreakCounter.jsx
    DailyCheckin.jsx
    Statistics.jsx
    MotivationQuote.jsx

  /pages
    Home.jsx
    Stats.jsx
    Settings.jsx

  /utils
    streakUtils.js
    quoteGenerator.js

  App.jsx
  index.js
```

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/yourusername/nofap-streak-tracker.git
```

Navigate to the project directory:

```
cd nofap-streak-tracker
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm start
```

---

## 📊 How It Works

1. User checks in daily.
2. The streak increases for each successful day.
3. If the user records a relapse, the streak resets.
4. Statistics update automatically to reflect progress.

All data is stored locally using **browser local storage**, ensuring privacy and offline functionality.

---

## 🔒 Privacy

This app is designed with privacy in mind:

* No account required
* No personal data collection
* No external tracking
* All data stays on the user's device

---

## 📈 Future Improvements

* Calendar view for streak history
* Optional PIN lock
* Export streak data
* Mobile PWA support
* Additional motivational content

---

## 🤝 Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request if you would like to improve the project.

---

## 📄 License


---

## ⭐ Support

If you find this project helpful, please consider giving it a star.
