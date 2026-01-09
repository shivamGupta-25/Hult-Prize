const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Blog Schema
const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: true },
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  posterImage: String,
  author: { type: String, required: true },
  isPublished: { type: Boolean, default: true },
  publishedAt: Date,
  likes: [String],
  likeCount: { type: Number, default: 0 },
  dislikes: [String],
  comments: [CommentSchema],
  views: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// ============================================================================
// HELPER FUNCTIONS FOR REALISTIC DATA GENERATION
// ============================================================================

// Diverse author pool with varied backgrounds
const AUTHORS = [
  "Sarah Johnson", "Michael Chen", "Priya Sharma", "Carlos Rodriguez",
  "Aisha Okonkwo", "David Kim", "Emma Thompson", "Raj Patel",
  "Maria Garcia", "James Wilson", "Fatima Al-Rashid", "Lucas Silva",
  "Yuki Tanaka", "Amara Nwosu", "Sophie Dubois", "Omar Hassan",
  "Isabella Rossi", "Kwame Mensah", "Leila Cohen", "Arjun Mehta"
];

// Diverse commenter names
const COMMENTERS = [
  "Alex Turner", "Maya Patel", "Chris Anderson", "Zara Ahmed",
  "Ryan Mitchell", "Nina Kowalski", "Jordan Lee", "Aaliyah Brown",
  "Ethan Davis", "Sophia Martinez", "Liam O'Brien", "Chloe Wang",
  "Noah Jackson", "Olivia Santos", "Aiden Kumar", "Mia Thompson",
  "Benjamin Foster", "Ava Nguyen", "Samuel Green", "Emily Rodriguez",
  "Daniel Park", "Grace Chen", "Matthew Wilson", "Hannah Kim",
  "Joshua Taylor", "Ella Martinez", "Andrew Lewis", "Lily Anderson"
];

// Blog topics with associated keywords and image categories
const BLOG_TOPICS = [
  {
    category: "Social Entrepreneurship",
    keywords: ["impact", "social change", "innovation", "entrepreneurship"],
    imageQuery: "business-meeting"
  },
  {
    category: "Technology & Innovation",
    keywords: ["technology", "AI", "digital", "innovation", "tech"],
    imageQuery: "technology"
  },
  {
    category: "Sustainability",
    keywords: ["environment", "climate", "sustainable", "green", "eco"],
    imageQuery: "nature-sustainability"
  },
  {
    category: "Education",
    keywords: ["learning", "education", "students", "teaching", "EdTech"],
    imageQuery: "education-learning"
  },
  {
    category: "Healthcare",
    keywords: ["health", "medical", "wellness", "healthcare", "telemedicine"],
    imageQuery: "healthcare-medical"
  },
  {
    category: "Community Development",
    keywords: ["community", "development", "local", "grassroots"],
    imageQuery: "community-people"
  },
  {
    category: "Youth Empowerment",
    keywords: ["youth", "young people", "empowerment", "leadership"],
    imageQuery: "young-people"
  },
  {
    category: "Financial Inclusion",
    keywords: ["finance", "banking", "fintech", "inclusion", "microfinance"],
    imageQuery: "finance-money"
  },
  {
    category: "Agriculture",
    keywords: ["agriculture", "farming", "food security", "agritech"],
    imageQuery: "agriculture-farm"
  },
  {
    category: "Women Empowerment",
    keywords: ["women", "gender equality", "empowerment", "female"],
    imageQuery: "women-leadership"
  }
];

// Helper: Get random item from array
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper: Get random integer between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Get random date in the past
const randomPastDate = (daysAgo) => {
  const now = Date.now();
  const randomDays = Math.random() * daysAgo;
  return new Date(now - randomDays * 24 * 60 * 60 * 1000);
};

// Helper: Generate realistic view count with distribution
const generateViews = () => {
  const rand = Math.random();
  if (rand < 0.1) return randomInt(1500, 2500); // 10% viral posts
  if (rand < 0.3) return randomInt(800, 1500);  // 20% popular posts
  if (rand < 0.7) return randomInt(300, 800);   // 40% average posts
  return randomInt(50, 300);                     // 30% new/niche posts
};

// Helper: Generate likes based on views (2-8% engagement)
const generateLikes = (views) => {
  const engagementRate = 0.02 + Math.random() * 0.06; // 2-8%
  const likeCount = Math.floor(views * engagementRate);
  const likes = [];
  for (let i = 0; i < likeCount; i++) {
    likes.push(`user_${randomInt(1000, 9999)}`);
  }
  return likes;
};

// Helper: Generate dislikes (0.1-0.5% of views)
const generateDislikes = (views) => {
  const dislikeRate = 0.001 + Math.random() * 0.004; // 0.1-0.5%
  const dislikeCount = Math.floor(views * dislikeRate);
  const dislikes = [];
  for (let i = 0; i < dislikeCount; i++) {
    dislikes.push(`user_${randomInt(1000, 9999)}`);
  }
  return dislikes;
};

// Helper: Generate realistic comments
const generateComments = (views, publishedAt) => {
  const comments = [];
  const rand = Math.random();

  let commentCount;
  if (rand < 0.2) return []; // 20% no comments
  if (rand < 0.5) commentCount = randomInt(1, 3);   // 30% few comments
  if (rand < 0.8) commentCount = randomInt(4, 8);   // 30% moderate comments
  else commentCount = randomInt(9, 20);             // 20% many comments

  const commentTexts = [
    "Great insights! This really helped me understand the topic better.",
    "Thank you for sharing this valuable information.",
    "This is exactly what I was looking for. Very helpful!",
    "Interesting perspective. I hadn't thought about it this way before.",
    "Could you elaborate more on this point?",
    "Excellent article! Looking forward to more content like this.",
    "This resonates with my own experience. Well written!",
    "Very informative and well-researched. Thanks!",
    "I have a question about the implementation details mentioned here.",
    "Brilliant work! This should be required reading.",
    "The examples provided are very practical and useful.",
    "I disagree with some points, but overall a good read.",
    "Can you recommend any resources for learning more about this?",
    "This article came at the perfect time for our project!",
    "Well explained! The step-by-step approach is very clear.",
    "I've been following your work and this is another gem.",
    "The data and statistics really strengthen your arguments.",
    "Bookmarking this for future reference. Thank you!",
    "Would love to see a follow-up article on this topic.",
    "This challenges some conventional thinking. Thought-provoking!"
  ];

  const publishTime = new Date(publishedAt).getTime();
  const now = Date.now();

  for (let i = 0; i < commentCount; i++) {
    const commentTime = publishTime + Math.random() * (now - publishTime);
    comments.push({
      author: randomItem(COMMENTERS),
      content: randomItem(commentTexts),
      createdAt: new Date(commentTime),
      isApproved: Math.random() > 0.05 // 95% approved
    });
  }

  return comments.sort((a, b) => a.createdAt - b.createdAt);
};

// Helper: Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper: Generate LoremFlickr image URL (Unsplash source deprecated/unreliable for random IDs)
const generateImageUrl = (query) => {
  // Convert "business-meeting" to "business,meeting" for better tagging
  const tags = query.replace(/-/g, ',');
  return `https://loremflickr.com/800/400/${tags}/all?lock=${randomInt(1, 1000)}`;
};

// ============================================================================
// BLOG CONTENT TEMPLATES
// ============================================================================

const BLOG_TEMPLATES = [
  {
    title: "The Future of Social Entrepreneurship in 2026",
    category: "Social Entrepreneurship",
    excerpt: "Exploring emerging trends and opportunities in social entrepreneurship as we navigate the challenges and possibilities of 2026.",
    content: `<h1>The Future of Social Entrepreneurship in 2026</h1>
<p>Social entrepreneurship continues to evolve, adapting to new challenges and leveraging innovative solutions to create meaningful impact. As we progress through 2026, several key trends are shaping the landscape.</p>

<h2>Emerging Trends</h2>
<p>The integration of <strong>technology and social impact</strong> has reached new heights. Entrepreneurs are using AI, blockchain, and IoT to solve complex social problems at scale.</p>

<blockquote>
  <p>"The future belongs to those who can blend profit with purpose seamlessly." - Industry Expert</p>
</blockquote>

<h2>Key Opportunities</h2>
<ul>
  <li><strong>Climate Tech:</strong> Solutions addressing climate change are attracting significant investment</li>
  <li><strong>Digital Inclusion:</strong> Bridging the digital divide remains a critical opportunity</li>
  <li><strong>Health Innovation:</strong> Post-pandemic healthcare solutions continue to evolve</li>
  <li><strong>Circular Economy:</strong> Sustainable business models are becoming mainstream</li>
</ul>

<h2>Challenges Ahead</h2>
<p>Despite progress, social entrepreneurs face ongoing challenges including funding gaps, regulatory hurdles, and the need for greater collaboration across sectors.</p>

<p>The most successful ventures will be those that can demonstrate both financial sustainability and measurable social impact.</p>`
  },
  {
    title: "Building Sustainable Communities Through Technology",
    category: "Technology & Innovation",
    excerpt: "How digital tools and platforms are empowering communities to create sustainable, resilient local ecosystems.",
    content: `<h1>Building Sustainable Communities Through Technology</h1>
<p>Technology is revolutionizing how communities organize, collaborate, and create sustainable solutions to local challenges.</p>

<h2>Digital Platforms for Community Building</h2>
<p>Modern platforms enable communities to:</p>
<ul>
  <li>Share resources efficiently</li>
  <li>Coordinate local initiatives</li>
  <li>Track environmental impact</li>
  <li>Connect with similar communities globally</li>
</ul>

<h2>Case Studies</h2>
<p>Several communities have successfully implemented technology-driven sustainability programs, resulting in reduced waste, improved resource sharing, and stronger social bonds.</p>

<blockquote>
  <p>"Technology should serve humanity, not the other way around."</p>
</blockquote>

<h2>Getting Started</h2>
<ol>
  <li>Identify your community's specific needs</li>
  <li>Research available technological solutions</li>
  <li>Start with a pilot program</li>
  <li>Gather feedback and iterate</li>
  <li>Scale what works</li>
</ol>

<p>The key is to ensure technology enhances rather than replaces human connection and community engagement.</p>`
  },
  {
    title: "Climate Action: From Awareness to Implementation",
    category: "Sustainability",
    excerpt: "Practical strategies for turning climate awareness into concrete action at individual, organizational, and community levels.",
    content: `<h1>Climate Action: From Awareness to Implementation</h1>
<p>While climate awareness has grown significantly, the gap between knowledge and action remains a critical challenge. This guide explores practical steps for implementing meaningful climate solutions.</p>

<h2>Understanding the Challenge</h2>
<p>Climate change requires action at multiple levels:</p>
<ul>
  <li><strong>Individual:</strong> Personal lifestyle changes and choices</li>
  <li><strong>Organizational:</strong> Business practices and policies</li>
  <li><strong>Community:</strong> Collective initiatives and advocacy</li>
  <li><strong>Systemic:</strong> Policy changes and infrastructure</li>
</ul>

<h2>Practical Implementation Steps</h2>
<ol>
  <li>Measure your current carbon footprint</li>
  <li>Set realistic, measurable goals</li>
  <li>Identify high-impact actions</li>
  <li>Create an implementation timeline</li>
  <li>Track progress and adjust</li>
</ol>

<blockquote>
  <p>"We don't need a handful of people doing zero waste perfectly. We need millions of people doing it imperfectly."</p>
</blockquote>

<h2>Success Stories</h2>
<p>Organizations and communities worldwide are demonstrating that climate action is both possible and beneficial, creating jobs, improving health, and building resilience.</p>

<p>The time for action is now. Every step counts, and collective effort creates exponential impact.</p>`
  },
  {
    title: "Revolutionizing Education: The EdTech Transformation",
    category: "Education",
    excerpt: "How educational technology is democratizing access to quality learning and transforming traditional education models.",
    content: `<h1>Revolutionizing Education: The EdTech Transformation</h1>
<p>Educational technology has moved from a nice-to-have to an essential component of modern learning, especially in the wake of global disruptions that forced rapid digital adoption.</p>

<h2>The EdTech Landscape</h2>
<p>Today's educational technology encompasses:</p>
<ul>
  <li>Adaptive learning platforms</li>
  <li>Virtual and augmented reality experiences</li>
  <li>AI-powered tutoring systems</li>
  <li>Collaborative online learning spaces</li>
  <li>Gamified learning experiences</li>
</ul>

<h2>Impact on Access and Equity</h2>
<p>EdTech has the potential to democratize education by:</p>
<ol>
  <li>Reaching underserved communities</li>
  <li>Providing personalized learning paths</li>
  <li>Offering flexible learning schedules</li>
  <li>Reducing educational costs</li>
  <li>Connecting learners globally</li>
</ol>

<blockquote>
  <p>"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela</p>
</blockquote>

<h2>Challenges and Considerations</h2>
<p>While promising, EdTech implementation must address digital divide issues, ensure data privacy, maintain human connection, and focus on learning outcomes rather than just technology adoption.</p>

<p>The future of education is hybrid, combining the best of technology with the irreplaceable value of human mentorship and connection.</p>`
  },
  {
    title: "Healthcare Innovation: Telemedicine and Beyond",
    category: "Healthcare",
    excerpt: "Exploring how digital health solutions are improving access to quality healthcare and transforming patient experiences.",
    content: `<h1>Healthcare Innovation: Telemedicine and Beyond</h1>
<p>The healthcare sector is experiencing unprecedented innovation, with digital solutions addressing long-standing challenges in access, quality, and affordability.</p>

<h2>The Rise of Telemedicine</h2>
<p>Telemedicine has evolved from a convenience to a necessity, offering:</p>
<ul>
  <li>Remote consultations and diagnoses</li>
  <li>Continuous patient monitoring</li>
  <li>Mental health support</li>
  <li>Specialist access for rural areas</li>
  <li>Reduced healthcare costs</li>
</ul>

<h2>Emerging Technologies</h2>
<p>Beyond telemedicine, innovations include:</p>
<ol>
  <li><strong>AI Diagnostics:</strong> Machine learning for early disease detection</li>
  <li><strong>Wearable Health Tech:</strong> Continuous health monitoring</li>
  <li><strong>Blockchain:</strong> Secure health records management</li>
  <li><strong>3D Printing:</strong> Custom prosthetics and medical devices</li>
</ol>

<blockquote>
  <p>"The best medicine is preventive medicine, and technology makes prevention more accessible than ever."</p>
</blockquote>

<h2>Patient-Centered Care</h2>
<p>Modern healthcare innovation prioritizes patient experience, empowerment, and outcomes. Technology enables patients to take active roles in their health management.</p>

<p>As we move forward, the integration of technology with compassionate care will define the future of healthcare.</p>`
  },
  {
    title: "Empowering Local Communities: A Grassroots Approach",
    category: "Community Development",
    excerpt: "Strategies for building strong, resilient communities through local leadership, collaboration, and resource sharing.",
    content: `<h1>Empowering Local Communities: A Grassroots Approach</h1>
<p>True community development starts from within. Grassroots initiatives led by community members themselves create sustainable, culturally appropriate solutions.</p>

<h2>Principles of Grassroots Development</h2>
<ul>
  <li><strong>Local Leadership:</strong> Community members drive the change</li>
  <li><strong>Cultural Sensitivity:</strong> Solutions respect local context</li>
  <li><strong>Participatory Approach:</strong> Everyone has a voice</li>
  <li><strong>Asset-Based:</strong> Build on existing strengths</li>
  <li><strong>Sustainable:</strong> Long-term thinking and planning</li>
</ul>

<h2>Building Community Capacity</h2>
<p>Effective community development requires:</p>
<ol>
  <li>Identifying local assets and resources</li>
  <li>Developing leadership skills</li>
  <li>Creating collaborative networks</li>
  <li>Establishing sustainable funding</li>
  <li>Measuring and celebrating progress</li>
</ol>

<blockquote>
  <p>"Never doubt that a small group of thoughtful, committed citizens can change the world; indeed, it's the only thing that ever has." - Margaret Mead</p>
</blockquote>

<h2>Success Factors</h2>
<p>Successful grassroots initiatives share common elements: strong local ownership, clear vision, inclusive participation, and patience for organic growth.</p>

<p>When communities are empowered to solve their own challenges, the solutions are more effective, sustainable, and culturally appropriate.</p>`
  },
  {
    title: "Youth Leadership in the 21st Century",
    category: "Youth Empowerment",
    excerpt: "How young people are driving innovation, social change, and creating new models of leadership for the future.",
    content: `<h1>Youth Leadership in the 21st Century</h1>
<p>Today's youth are not just leaders of tomorrow—they're leaders today, driving innovation and social change across all sectors.</p>

<h2>Characteristics of Modern Youth Leadership</h2>
<p>Young leaders today demonstrate:</p>
<ul>
  <li>Digital fluency and technological innovation</li>
  <li>Global perspective with local action</li>
  <li>Collaborative and inclusive approach</li>
  <li>Commitment to sustainability and social justice</li>
  <li>Entrepreneurial mindset</li>
</ul>

<h2>Supporting Youth Leadership</h2>
<p>To empower young leaders, we must:</p>
<ol>
  <li>Provide mentorship and guidance</li>
  <li>Create platforms for youth voices</li>
  <li>Offer resources and funding</li>
  <li>Trust young people's capabilities</li>
  <li>Remove barriers to participation</li>
</ol>

<blockquote>
  <p>"Young people are not the leaders of tomorrow. They are the leaders of today."</p>
</blockquote>

<h2>Youth-Led Initiatives</h2>
<p>From climate activism to tech innovation, young people are creating solutions to global challenges and building movements that inspire millions.</p>

<p>The future is being shaped by youth leadership, and our role is to support, amplify, and learn from their vision and energy.</p>`
  },
  {
    title: "Financial Inclusion: Banking the Unbanked",
    category: "Financial Inclusion",
    excerpt: "How fintech innovations are bringing financial services to underserved populations and creating economic opportunities.",
    content: `<h1>Financial Inclusion: Banking the Unbanked</h1>
<p>Over 1.7 billion adults worldwide lack access to formal financial services. Fintech innovations are changing this, creating pathways to economic empowerment.</p>

<h2>The Financial Inclusion Gap</h2>
<p>Barriers to financial access include:</p>
<ul>
  <li>Geographic distance from banks</li>
  <li>High minimum balance requirements</li>
  <li>Lack of documentation</li>
  <li>Limited financial literacy</li>
  <li>Distrust of formal institutions</li>
</ul>

<h2>Fintech Solutions</h2>
<p>Technology is addressing these barriers through:</p>
<ol>
  <li><strong>Mobile Banking:</strong> Banking via smartphones</li>
  <li><strong>Digital Wallets:</strong> Cashless transactions</li>
  <li><strong>Microfinance Platforms:</strong> Small loans for entrepreneurs</li>
  <li><strong>Blockchain:</strong> Transparent, low-cost transfers</li>
  <li><strong>AI Credit Scoring:</strong> Alternative credit assessment</li>
</ol>

<blockquote>
  <p>"Financial inclusion is not just about access to banking—it's about access to opportunity."</p>
</blockquote>

<h2>Impact Stories</h2>
<p>Communities with improved financial access show increased entrepreneurship, better education outcomes, improved health, and greater economic resilience.</p>

<p>Financial inclusion is a powerful tool for poverty reduction and economic development, and technology is making it increasingly accessible.</p>`
  },
  {
    title: "Sustainable Agriculture: Feeding the Future",
    category: "Agriculture",
    excerpt: "Innovative farming practices and technologies that ensure food security while protecting our planet's resources.",
    content: `<h1>Sustainable Agriculture: Feeding the Future</h1>
<p>As global population grows and climate change intensifies, sustainable agriculture is essential for food security and environmental protection.</p>

<h2>Principles of Sustainable Farming</h2>
<ul>
  <li><strong>Soil Health:</strong> Maintaining and improving soil quality</li>
  <li><strong>Water Conservation:</strong> Efficient irrigation and water management</li>
  <li><strong>Biodiversity:</strong> Protecting ecosystems and pollinators</li>
  <li><strong>Climate Resilience:</strong> Adapting to changing conditions</li>
  <li><strong>Fair Labor:</strong> Ensuring farmer livelihoods</li>
</ul>

<h2>Agricultural Innovation</h2>
<p>Modern sustainable farming incorporates:</p>
<ol>
  <li>Precision agriculture using sensors and data</li>
  <li>Vertical farming for urban areas</li>
  <li>Regenerative farming practices</li>
  <li>Drought-resistant crop varieties</li>
  <li>Integrated pest management</li>
</ol>

<blockquote>
  <p>"To forget how to dig the earth and to tend the soil is to forget ourselves." - Mahatma Gandhi</p>
</blockquote>

<h2>The Path Forward</h2>
<p>Sustainable agriculture requires collaboration between farmers, scientists, policymakers, and consumers. Supporting local farmers and choosing sustainable products creates market demand for better practices.</p>

<p>Our food system's future depends on agriculture that nourishes both people and planet.</p>`
  },
  {
    title: "Women in Leadership: Breaking Barriers",
    category: "Women Empowerment",
    excerpt: "Celebrating progress in women's leadership while addressing ongoing challenges and creating pathways for future generations.",
    content: `<h1>Women in Leadership: Breaking Barriers</h1>
<p>Women's leadership is essential for organizational success, innovation, and social progress. Yet barriers persist that prevent women from reaching their full potential.</p>

<h2>Current State of Women's Leadership</h2>
<p>Progress has been made, but challenges remain:</p>
<ul>
  <li>Women hold only 29% of senior management roles globally</li>
  <li>Gender pay gap persists across industries</li>
  <li>Work-life balance challenges disproportionately affect women</li>
  <li>Unconscious bias impacts hiring and promotion</li>
  <li>Limited access to mentorship and networks</li>
</ul>

<h2>Creating Change</h2>
<p>Advancing women's leadership requires:</p>
<ol>
  <li><strong>Mentorship Programs:</strong> Connecting women with role models</li>
  <li><strong>Flexible Work Policies:</strong> Supporting work-life integration</li>
  <li><strong>Bias Training:</strong> Addressing unconscious bias</li>
  <li><strong>Sponsorship:</strong> Advocating for women's advancement</li>
  <li><strong>Equal Pay:</strong> Ensuring compensation equity</li>
</ol>

<blockquote>
  <p>"There is no limit to what we, as women, can accomplish." - Michelle Obama</p>
</blockquote>

<h2>The Business Case</h2>
<p>Research consistently shows that diverse leadership teams outperform homogeneous ones. Gender diversity drives innovation, better decision-making, and improved financial performance.</p>

<p>Empowering women in leadership isn't just the right thing to do—it's essential for organizational and societal success.</p>`
  }
];

// Additional blog titles for variety (will use templates above as content base)
const ADDITIONAL_TITLES = [
  "Impact Investing: Aligning Profit with Purpose",
  "The Role of Design Thinking in Social Innovation",
  "Building Resilient Supply Chains in Uncertain Times",
  "Mental Health in the Workplace: A Growing Priority",
  "Circular Economy: Rethinking Waste and Resources",
  "Digital Literacy: Essential Skills for the Modern World",
  "Microfinance: Empowering Entrepreneurs at the Bottom of the Pyramid",
  "Smart Cities: Technology for Urban Sustainability",
  "Food Security in a Changing Climate",
  "The Power of Storytelling in Social Change",
  "Renewable Energy: Accelerating the Clean Energy Transition",
  "Social Media for Social Good: Amplifying Impact",
  "Inclusive Design: Creating Products for Everyone",
  "The Future of Work: Preparing for Tomorrow's Jobs",
  "Water Conservation: Innovative Solutions for a Precious Resource",
  "Entrepreneurship Education: Nurturing the Next Generation",
  "Public-Private Partnerships for Social Impact",
  "Measuring Impact: Metrics That Matter",
  "The Gig Economy and Worker Rights",
  "Blockchain for Social Good: Beyond Cryptocurrency",
  "Mental Health Apps: Digital Support for Wellbeing",
  "Affordable Housing: Innovative Models and Solutions",
  "The Role of Arts in Community Development",
  "Sustainable Fashion: Transforming the Textile Industry",
  "Food Waste Reduction: From Farm to Table",
  "Disability Inclusion: Creating Accessible Opportunities",
  "Elder Care Innovation: Supporting Aging Populations",
  "Ocean Conservation: Protecting Marine Ecosystems",
  "Refugee Integration: Building Inclusive Communities",
  "Urban Farming: Growing Food in Cities",
  "The Sharing Economy: Collaborative Consumption Models",
  "Clean Water Access: Technologies and Strategies",
  "Prison Reform: Rehabilitation and Reintegration",
  "Indigenous Knowledge: Learning from Traditional Wisdom",
  "Disaster Preparedness: Building Community Resilience",
  "Fair Trade: Ensuring Ethical Supply Chains",
  "Homelessness Solutions: Housing First Approaches",
  "Renewable Materials: Alternatives to Plastic",
  "Community Health Workers: Bridging Healthcare Gaps",
  "Participatory Budgeting: Democratic Resource Allocation"
];

// ============================================================================
// GENERATE BLOG DATA
// ============================================================================

function generateBlogPost(index, totalBlogs) {
  // Select template or create variation
  const template = index < BLOG_TEMPLATES.length
    ? BLOG_TEMPLATES[index]
    : {
      ...randomItem(BLOG_TEMPLATES),
      title: ADDITIONAL_TITLES[index - BLOG_TEMPLATES.length] || `Innovation in ${randomItem(BLOG_TOPICS).category} ${index}`
    };

  const topic = BLOG_TOPICS.find(t => t.category === template.category) || randomItem(BLOG_TOPICS);
  const publishedAt = randomPastDate(365); // Up to 1 year ago
  const views = generateViews();
  const likes = generateLikes(views);
  const dislikes = generateDislikes(views);
  const isPublished = Math.random() > 0.2; // 80% published

  return {
    title: template.title,
    slug: generateSlug(template.title),
    excerpt: template.excerpt,
    content: template.content,
    posterImage: generateImageUrl(topic.imageQuery),
    author: randomItem(AUTHORS),
    isPublished: isPublished,
    publishedAt: isPublished ? publishedAt : null,
    likes: isPublished ? likes : [],
    likeCount: isPublished ? likes.length : 0,
    dislikes: isPublished ? dislikes : [],
    comments: isPublished ? generateComments(views, publishedAt) : [],
    views: isPublished ? views : 0,
  };
}

// Generate 45 blog posts
const sampleBlogs = [];
const totalBlogs = 45;

for (let i = 0; i < totalBlogs; i++) {
  sampleBlogs.push(generateBlogPost(i, totalBlogs));
}

// ============================================================================
// DATABASE CONNECTION AND SEEDING
// ============================================================================

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set in .env.local');
  }

  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');
}

async function seedBlogs() {
  try {
    await connectDB();

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing blogs');

    // Insert sample blogs
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const blogData of sampleBlogs) {
      try {
        await Blog.create(blogData);
        console.log(`✅ Created: "${blogData.title}"`);
        successCount++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Skipped (duplicate): "${blogData.title}"`);
          skipCount++;
        } else {
          console.error(`❌ Error creating "${blogData.title}":`, error.message);
          errorCount++;
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Seeding Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully created: ${successCount}`);
    console.log(`⚠️  Skipped (duplicates): ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    const total = await Blog.countDocuments();
    const published = await Blog.countDocuments({ isPublished: true });
    const avgViews = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, avg: { $avg: '$views' } } }
    ]);
    const avgLikes = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, avg: { $avg: { $size: '$likes' } } } }
    ]);

    console.log(`\n📝 Database Status:`);
    console.log(`   Total blogs: ${total}`);
    console.log(`   Published: ${published}`);
    console.log(`   Drafts: ${total - published}`);
    console.log(`   Avg views: ${Math.round(avgViews[0]?.avg || 0)}`);
    console.log(`   Avg likes: ${Math.round(avgLikes[0]?.avg || 0)}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the seeder
seedBlogs()
  .then(() => {
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });