# CareerPulse: Job Application Tracking System

A modern, local-first Next.js dashboard designed to help engineers and professionals track their job applications, parse CVs, and instantly verify their compatibility against Job Descriptions.

![Dashboard Preview]((placeholder for screenshot))

## Features

- **The Ledger**: A sleek tabular history of your job applications with expanding rows to view full metrics, notes, and submitted documents.
- **Client-Side Document Parsing**: Drag and drop `.txt`, `.csv`, `.pdf`, or `.docx` files natively into your browser to safely extract text into your CV/Cover Letter history without any backend servers!
- **Interactive KPI Filtering**: Click any row in your application history, and the dashboard metrics (Interview Rate, Active Pipeline) instantly filter to represent that specific application.
- **Local-First Privacy**: No cloud databases. All of your user profiles, job data, and CVs are securely saved to your browser's local storage utilizing Zustand Persist.
- **Profile Auto-Suggest**: Add "Sectors" to your profile (like *Technology* or *Healthcare*) and get intelligent, click-to-add action phrases recommended for your bio.
- **Mock AI Compatibility Engine**: Click "Analyze Compatibility" on any application to generate a simulated mapping score of your Profile + CV against the Target Job Description.

## Quick Start (Run Locally)

This application is completely self-contained. To run it on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Job-Application-Tracking-System.git
   cd Job-Application-Tracking-System/careerpulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

Your data will automatically begin saving locally in your browser.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Document Parsing**: pdfjs-dist, mammoth.js

## License
MIT
