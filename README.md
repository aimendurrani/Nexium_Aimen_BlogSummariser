**AI Blog Summarizer + Urdu Translator**

**Description:**
This is a modern AI-powered web app built using **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **ShadCN UI**. The app allows users to input a blog URL, automatically scrape and extract the blog content, generate a concise AI-style summary (simulated), and translate the summary into **Urdu**. The English summary is saved in **Supabase**, and the full blog text is stored in **MongoDB**.

**Key Features:**

* Input any public blog URL
* Scrape and clean blog text using Cheerio
* Generate a simulated summary (basic keyword logic)
* Translate summary into Urdu using MyMemory API
* Real-time visual status for each processing step
* Smooth UI animations and transitions
* Store data in Supabase (summary) and MongoDB (full blog)

**Tech Stack:**

* Frontend: Next.js 14, Tailwind CSS, Framer Motion, ShadCN UI
* Backend: API routes in Next.js (`/api/summarize`)
* Storage: Supabase (PostgreSQL) and MongoDB Atlas
* Utilities: Cheerio for scraping, fetch API for translation

**Project Setup (Local):**

1. Clone the repository
   `git clone https://github.com/aimendurrani/Nexium_Aimen_BlogSummariser.git`

2. Navigate to the project folder
   `cd Nexium_Aimen_BlogSummariser`

3. Install dependencies
   `npm install`

4. Create and configure your `.env.local` file with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   MONGODB_URI=your_mongodb_uri
   ```

5. Run the development server
   `npm run dev`

6. Open in browser
   `http://localhost:3000`

---

**License:**
This project is licensed under the **MIT License**
