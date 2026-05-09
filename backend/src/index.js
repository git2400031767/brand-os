const Idea = require("./models/Idea");
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/ideas", async (req, res) => {
  const ideas = await Idea.find();
  res.json(ideas);
});
app.post("/ideas", async (req, res) => {
  const idea = new Idea(req.body);
  await idea.save();
  res.json(idea);
});
app.put("/ideas/:id", async (req, res) => {
  const updatedIdea = await Idea.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedIdea);
});

app.delete("/ideas/:id", async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));


// ─────────────────────────────────────────────
// IN-MEMORY DATA STORE (replace with DB later)
// ─────────────────────────────────────────────

let data = {
  ideas: [
    { id: uuidv4(), title: "How I built my first 10k audience", platform: "YouTube", status: "draft", tags: ["growth", "strategy"], createdAt: new Date().toISOString(), notes: "Cover the exact steps, tools, and mindset" },
    { id: uuidv4(), title: "5 tools every creator needs in 2025", platform: "Newsletter", status: "in-progress", tags: ["tools", "productivity"], createdAt: new Date().toISOString(), notes: "Focus on free/cheap options" },
    { id: uuidv4(), title: "My morning routine for deep work", platform: "Instagram", status: "ready", tags: ["lifestyle", "productivity"], createdAt: new Date().toISOString(), notes: "Tie into the brand story" },
  ],
  posts: [
    { id: uuidv4(), title: "Thread: From 0 to 5k in 90 days", platform: "Twitter/X", scheduledAt: new Date(Date.now() + 86400000).toISOString(), status: "scheduled", content: "Here's exactly what I did...", engagement: null },
    { id: uuidv4(), title: "YouTube: Creator economy breakdown", platform: "YouTube", scheduledAt: new Date(Date.now() + 172800000).toISOString(), status: "scheduled", content: "Full video script ready", engagement: null },
    { id: uuidv4(), title: "Newsletter #42 - The leverage loop", platform: "Newsletter", scheduledAt: new Date(Date.now() - 86400000).toISOString(), status: "published", content: "Sent to 4,200 subscribers", engagement: { views: 4200, clicks: 840, rate: "20%" } },
  ],
  analytics: {
    followers: { twitter: 5240, instagram: 3180, youtube: 1920, newsletter: 4200 },
    growth: [
      { month: "Jan", twitter: 3200, instagram: 2100, youtube: 900, newsletter: 2800 },
      { month: "Feb", twitter: 3800, instagram: 2400, youtube: 1100, newsletter: 3200 },
      { month: "Mar", twitter: 4200, instagram: 2700, youtube: 1400, newsletter: 3600 },
      { month: "Apr", twitter: 4800, instagram: 2900, youtube: 1700, newsletter: 3900 },
      { month: "May", twitter: 5240, instagram: 3180, youtube: 1920, newsletter: 4200 },
    ],
    topPosts: [
      { title: "The leverage loop thread", platform: "Twitter/X", engagement: 12400, reach: 48000 },
      { title: "Creator burnout video", platform: "YouTube", engagement: 3200, reach: 15000 },
      { title: "Newsletter on niching down", platform: "Newsletter", engagement: 1800, reach: 4200 },
    ]
  },
  deals: [
    { id: uuidv4(), brand: "Notion", type: "Sponsored Post", value: 1500, status: "active", dueDate: new Date(Date.now() + 604800000).toISOString(), notes: "2 Instagram posts + 1 story", platform: "Instagram" },
    { id: uuidv4(), brand: "Gumroad", type: "Affiliate", value: 320, status: "ongoing", dueDate: null, notes: "15% commission, tracking link active", platform: "Newsletter" },
    { id: uuidv4(), brand: "Beehiiv", type: "Newsletter Sponsorship", value: 800, status: "negotiating", dueDate: new Date(Date.now() + 1209600000).toISOString(), notes: "Awaiting contract", platform: "Newsletter" },
    { id: uuidv4(), brand: "Descript", type: "Ambassador", value: 2400, status: "completed", dueDate: new Date(Date.now() - 604800000).toISOString(), notes: "Quarterly ambassador deal — done", platform: "YouTube" },
  ],
  income: [
    { id: uuidv4(), source: "Sponsorships", amount: 4300, month: "May 2025", category: "brand-deals" },
    { id: uuidv4(), source: "Digital Products", amount: 2100, month: "May 2025", category: "products" },
    { id: uuidv4(), source: "Affiliate", amount: 640, month: "May 2025", category: "affiliate" },
    { id: uuidv4(), source: "Consulting", amount: 1500, month: "May 2025", category: "services" },
    { id: uuidv4(), source: "Sponsorships", amount: 3200, month: "Apr 2025", category: "brand-deals" },
    { id: uuidv4(), source: "Digital Products", amount: 1800, month: "Apr 2025", category: "products" },
    { id: uuidv4(), source: "Affiliate", amount: 520, month: "Apr 2025", category: "affiliate" },
    { id: uuidv4(), source: "Consulting", amount: 2000, month: "Apr 2025", category: "services" },
  ]
};

// ─────────────────────────────────────────────
// ROUTES: IDEAS
// ─────────────────────────────────────────────


// GET IDEAS
app.get('/api/ideas', async (req, res) => {
  const ideas = await Idea.find();
  res.json(ideas);
});

// CREATE IDEA
app.post('/api/ideas', async (req, res) => {
  const idea = new Idea({
    ...req.body,
    status: 'draft'
  });

  await idea.save();
  res.status(201).json(idea);
});

// UPDATE IDEA STATUS
app.put('/api/ideas/:id', async (req, res) => {
  const updatedIdea = await Idea.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedIdea);
});

// DELETE IDEA
app.delete('/api/ideas/:id', async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);

  res.json({
    success: true
  });
});

// ─────────────────────────────────────────────
// ROUTES: POSTS
// ─────────────────────────────────────────────

app.get('/api/ideas', async (req, res) => {
  const ideas = await Idea.find();
  res.json(ideas);
});

app.post('/api/posts', (req, res) => {
  const post = { id: uuidv4(), status: 'scheduled', engagement: null, ...req.body };
  data.posts.unshift(post);
  res.status(201).json(post);
});

app.put('/api/posts/:id', (req, res) => {
  const idx = data.posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.posts[idx] = { ...data.posts[idx], ...req.body };
  res.json(data.posts[idx]);
});

app.delete('/api/posts/:id', (req, res) => {
  data.posts = data.posts.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// ROUTES: ANALYTICS
// ─────────────────────────────────────────────

app.get('/api/analytics', (req, res) => res.json(data.analytics));

// ─────────────────────────────────────────────
// ROUTES: DEALS
// ─────────────────────────────────────────────

app.get('/api/deals', (req, res) => res.json(data.deals));

app.post('/api/deals', (req, res) => {
  const deal = { id: uuidv4(), status: 'negotiating', ...req.body };
  data.deals.unshift(deal);
  res.status(201).json(deal);
});

app.put('/api/deals/:id', (req, res) => {
  const idx = data.deals.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.deals[idx] = { ...data.deals[idx], ...req.body };
  res.json(data.deals[idx]);
});

app.delete('/api/deals/:id', (req, res) => {
  data.deals = data.deals.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// ROUTES: INCOME
// ─────────────────────────────────────────────

app.get('/api/income', (req, res) => res.json(data.income));

app.post('/api/income', (req, res) => {
  const entry = { id: uuidv4(), ...req.body };
  data.income.unshift(entry);
  res.status(201).json(entry);
});

app.delete('/api/income/:id', (req, res) => {
  data.income = data.income.filter(i => i.id !== req.params.id);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// DASHBOARD SUMMARY
// ─────────────────────────────────────────────

app.get('/api/dashboard', (req, res) => {
  const totalFollowers = Object.values(data.analytics.followers).reduce((a, b) => a + b, 0);
  const mayIncome = data.income.filter(i => i.month === 'May 2025').reduce((a, b) => a + b.amount, 0);
  const aprIncome = data.income.filter(i => i.month === 'Apr 2025').reduce((a, b) => a + b.amount, 0);
  const activeDeals = data.deals.filter(d => d.status === 'active' || d.status === 'negotiating').length;
  const pendingDealsValue = data.deals.filter(d => d.status === 'active' || d.status === 'negotiating').reduce((a, b) => a + b.value, 0);
  const scheduledPosts = data.posts.filter(p => p.status === 'scheduled').length;
  const ideasReady = data.ideas.filter(i => i.status === 'ready').length;

  res.json({
    totalFollowers,
    monthlyIncome: mayIncome,
    incomeGrowth: aprIncome > 0 ? (((mayIncome - aprIncome) / aprIncome) * 100).toFixed(1) : 0,
    activeDeals,
    pendingDealsValue,
    scheduledPosts,
    ideasReady,
    followersByPlatform: data.analytics.followers,
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Brand OS API running on http://localhost:${PORT}`));
