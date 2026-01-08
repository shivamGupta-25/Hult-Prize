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
  dislikes: [String],
  comments: [CommentSchema],
  views: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// Sample blog data
const sampleBlogs = [
  {
    title: "The Future of Social Entrepreneurship: Trends and Opportunities",
    slug: "future-of-social-entrepreneurship-trends-opportunities",
    excerpt: "Exploring the evolving landscape of social entrepreneurship and the emerging opportunities for young innovators to create meaningful impact.",
    content: `<h1>The Future of Social Entrepreneurship</h1>
<p>Social entrepreneurship has evolved significantly over the past decade, transforming from a niche concept to a mainstream movement that's reshaping how we approach business and social change.</p>

<h2>Emerging Trends</h2>
<p>One of the most exciting trends we're seeing is the integration of <strong>technology and social impact</strong>. Young entrepreneurs are leveraging AI, blockchain, and other cutting-edge technologies to solve complex social problems.</p>

<blockquote>
  <p>"The best way to predict the future is to create it." - Peter Drucker</p>
</blockquote>

<h2>Key Opportunities</h2>
<ul>
  <li><strong>Sustainability:</strong> Climate change solutions are in high demand</li>
  <li><strong>Education:</strong> EdTech platforms are democratizing access to quality education</li>
  <li><strong>Healthcare:</strong> Telemedicine and health tech are revolutionizing care delivery</li>
  <li><strong>Financial Inclusion:</strong> FinTech solutions are bringing banking to underserved communities</li>
</ul>

<h2>Getting Started</h2>
<p>If you're interested in starting your own social enterprise, here are some steps to consider:</p>
<ol>
  <li>Identify a social problem you're passionate about</li>
  <li>Research existing solutions and find your unique angle</li>
  <li>Build a sustainable business model</li>
  <li>Connect with mentors and the social entrepreneurship community</li>
</ol>

<p>The future is bright for social entrepreneurs who are willing to think creatively and work collaboratively to address the world's most pressing challenges.</p>`,
    posterImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    author: "Sarah Johnson",
    isPublished: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7"],
    dislikes: ["user8"],
    comments: [
      {
        author: "Alex Chen",
        content: "Great insights! I'm particularly interested in the EdTech opportunities mentioned.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Maria Rodriguez",
        content: "This article really opened my eyes to the potential of social entrepreneurship. Thank you!",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 245,
  },
  {
    title: "How to Build a Winning Hult Prize Pitch: A Step-by-Step Guide",
    slug: "how-to-build-winning-hult-prize-pitch-step-by-step-guide",
    excerpt: "Learn the essential elements of a compelling Hult Prize pitch that can help your team stand out in the competition.",
    content: `<h1>Building a Winning Hult Prize Pitch</h1>
<p>Competing in the Hult Prize is an incredible opportunity, but standing out requires more than just a good idea. You need a <strong>compelling pitch</strong> that tells your story effectively.</p>

<h2>The Foundation: Your Problem Statement</h2>
<p>Every great pitch starts with a clear, compelling problem statement. Make sure you:</p>
<ul>
  <li>Define the problem clearly and concisely</li>
  <li>Show the scale and impact of the problem</li>
  <li>Demonstrate why this problem matters now</li>
</ul>

<h2>Crafting Your Solution</h2>
<p>Your solution should be:</p>
<ol>
  <li><strong>Innovative:</strong> Offer something new or a unique approach</li>
  <li><strong>Scalable:</strong> Show how it can grow and reach more people</li>
  <li><strong>Sustainable:</strong> Demonstrate a viable business model</li>
  <li><strong>Impactful:</strong> Clearly show the social or environmental benefit</li>
</ol>

<blockquote>
  <p>"Your pitch is not just about your idea—it's about your ability to execute and create change."</p>
</blockquote>

<h2>Presentation Tips</h2>
<p>When presenting your pitch:</p>
<ul>
  <li>Keep slides clean and visual</li>
  <li>Practice your timing (usually 6-8 minutes)</li>
  <li>Tell a story that connects emotionally</li>
  <li>Be prepared for tough questions</li>
</ul>

<p>Remember, the judges are looking for teams that can not only identify problems but also execute solutions that create real, measurable impact.</p>`,
    posterImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    author: "Michael Thompson",
    isPublished: true,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10"],
    dislikes: [],
    comments: [
      {
        author: "David Kim",
        content: "This guide is exactly what our team needed! The step-by-step approach is very helpful.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Emily Watson",
        content: "The presentation tips section is gold. Thanks for sharing!",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "James Wilson",
        content: "Great article! Would love to see more examples of successful pitches.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 389,
  },
  {
    title: "Sustainable Innovation: Creating Products That Matter",
    slug: "sustainable-innovation-creating-products-that-matter",
    excerpt: "Discover how to build products that not only succeed in the market but also contribute positively to society and the environment.",
    content: `<h1>Sustainable Innovation: Creating Products That Matter</h1>
<p>In today's world, innovation isn't just about creating something new—it's about creating something that <strong>matters</strong>. Sustainable innovation combines business success with positive social and environmental impact.</p>

<h2>What is Sustainable Innovation?</h2>
<p>Sustainable innovation refers to the development of products, services, or processes that:</p>
<ul>
  <li>Meet current needs without compromising future generations</li>
  <li>Create economic value while addressing social challenges</li>
  <li>Minimize environmental impact throughout the product lifecycle</li>
</ul>

<h2>Principles of Sustainable Design</h2>
<ol>
  <li><strong>Circular Economy:</strong> Design for reuse and recycling</li>
  <li><strong>Resource Efficiency:</strong> Minimize waste and maximize value</li>
  <li><strong>Social Impact:</strong> Consider the needs of all stakeholders</li>
  <li><strong>Long-term Thinking:</strong> Plan for sustainability over time</li>
</ol>

<blockquote>
  <p>"We don't inherit the earth from our ancestors; we borrow it from our children." - Native American Proverb</p>
</blockquote>

<h2>Real-World Examples</h2>
<p>Many successful companies are leading the way in sustainable innovation:</p>
<ul>
  <li>Companies using renewable materials in their products</li>
  <li>Businesses creating circular supply chains</li>
  <li>Startups developing solutions for clean energy</li>
</ul>

<h2>Getting Started</h2>
<p>If you want to incorporate sustainability into your innovation process:</p>
<ol>
  <li>Assess the environmental and social impact of your ideas</li>
  <li>Engage with stakeholders to understand their needs</li>
  <li>Design with sustainability in mind from the start</li>
  <li>Measure and track your impact</li>
</ol>

<p>Sustainable innovation isn't just good for the planet—it's also good for business. Consumers and investors are increasingly looking for companies that prioritize sustainability.</p>`,
    posterImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    author: "Lisa Anderson",
    isPublished: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5"],
    dislikes: ["user6"],
    comments: [
      {
        author: "Robert Taylor",
        content: "Excellent article on sustainable innovation. The principles outlined here are very practical.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 156,
  },
  {
    title: "Building Your Team: Finding the Right Co-Founders",
    slug: "building-your-team-finding-right-co-founders",
    excerpt: "Learn how to identify, attract, and work with the right co-founders to build a successful social enterprise.",
    content: `<h1>Building Your Team: Finding the Right Co-Founders</h1>
<p>Your team is one of the most critical factors in your startup's success. Finding the right co-founders can make or break your venture.</p>

<h2>What to Look For</h2>
<p>When searching for co-founders, consider these qualities:</p>
<ul>
  <li><strong>Complementary Skills:</strong> Look for people with different strengths</li>
  <li><strong>Shared Values:</strong> Alignment on mission and vision is crucial</li>
  <li><strong>Commitment:</strong> Find people who are as dedicated as you are</li>
  <li><strong>Communication:</strong> Ability to work through disagreements constructively</li>
</ul>

<h2>Where to Find Co-Founders</h2>
<ol>
  <li>University entrepreneurship programs and clubs</li>
  <li>Hackathons and startup competitions</li>
  <li>Online platforms like LinkedIn and founder matching services</li>
  <li>Networking events and conferences</li>
</ol>

<blockquote>
  <p>"If you want to go fast, go alone. If you want to go far, go together." - African Proverb</p>
</blockquote>

<h2>Building the Relationship</h2>
<p>Once you've found potential co-founders:</p>
<ul>
  <li>Start with a small project to test compatibility</li>
  <li>Have honest conversations about expectations</li>
  <li>Define roles and responsibilities clearly</li>
  <li>Create a founders' agreement early on</li>
</ul>

<p>Remember, building a startup is a marathon, not a sprint. Choose co-founders you can see yourself working with for years to come.</p>`,
    posterImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    author: "Jennifer Martinez",
    isPublished: true,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"],
    dislikes: [],
    comments: [
      {
        author: "Chris Brown",
        content: "This is so helpful! I've been struggling to find the right co-founder. The tips about starting with a small project are spot on.",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Amanda Lee",
        content: "Great advice on defining roles early. That's something we learned the hard way!",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 298,
  },
  {
    title: "Measuring Impact: Metrics That Matter for Social Enterprises",
    slug: "measuring-impact-metrics-that-matter-social-enterprises",
    excerpt: "Understanding how to measure and communicate the social impact of your enterprise is crucial for growth and funding.",
    content: `<h1>Measuring Impact: Metrics That Matter</h1>
<p>For social enterprises, success isn't just measured in revenue—it's measured in <strong>impact</strong>. But how do you quantify social change?</p>

<h2>Why Impact Measurement Matters</h2>
<p>Effective impact measurement helps you:</p>
<ul>
  <li>Understand if you're achieving your mission</li>
  <li>Make data-driven decisions</li>
  <li>Attract investors and funders</li>
  <li>Improve your programs and services</li>
</ul>

<h2>Key Metrics to Track</h2>
<ol>
  <li><strong>Output Metrics:</strong> What you deliver (e.g., number of people served)</li>
  <li><strong>Outcome Metrics:</strong> The change you create (e.g., improved quality of life)</li>
  <li><strong>Impact Metrics:</strong> Long-term effects (e.g., systemic change)</li>
</ol>

<blockquote>
  <p>"What gets measured gets managed." - Peter Drucker</p>
</blockquote>

<h2>Tools and Frameworks</h2>
<p>Several frameworks can help you structure your impact measurement:</p>
<ul>
  <li><strong>Theory of Change:</strong> Map your pathway to impact</li>
  <li><strong>Logic Models:</strong> Connect activities to outcomes</li>
  <li><strong>SDG Alignment:</strong> Link to UN Sustainable Development Goals</li>
  <li><strong>IRIS Metrics:</strong> Standardized impact measurement</li>
</ul>

<h2>Getting Started</h2>
<p>To begin measuring your impact:</p>
<ol>
  <li>Define your theory of change</li>
  <li>Identify key metrics aligned with your mission</li>
  <li>Set up data collection systems</li>
  <li>Regularly review and adjust your approach</li>
</ol>

<p>Remember, impact measurement is an ongoing process. Start simple and build your measurement capabilities over time.</p>`,
    posterImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    author: "Daniel Park",
    isPublished: true,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4"],
    dislikes: [],
    comments: [
      {
        author: "Sophie Green",
        content: "This is exactly what I needed! We've been struggling with how to measure our impact effectively.",
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 187,
  },
];

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
    console.log(`\n📝 Database Status:`);
    console.log(`   Total blogs: ${total}`);
    console.log(`   Published: ${published}`);
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