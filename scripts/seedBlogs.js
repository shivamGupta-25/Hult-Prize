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
  {
    title: "Funding Your Social Enterprise: A Guide to Impact Investment",
    slug: "funding-social-enterprise-guide-impact-investment",
    excerpt: "Navigate the world of impact investing and discover various funding options available for social entrepreneurs looking to scale their ventures.",
    content: `<h1>Funding Your Social Enterprise: A Guide to Impact Investment</h1>
<p>Securing funding is one of the biggest challenges for social entrepreneurs. Unlike traditional startups, social enterprises need investors who understand and value both <strong>financial returns and social impact</strong>.</p>

<h2>Types of Impact Funding</h2>
<p>There are several funding options available for social enterprises:</p>
<ul>
  <li><strong>Grants:</strong> Non-repayable funds from foundations and government programs</li>
  <li><strong>Impact Investing:</strong> Investments seeking both financial and social returns</li>
  <li><strong>Social Venture Capital:</strong> VC funds focused on social impact</li>
  <li><strong>Crowdfunding:</strong> Raising small amounts from many supporters</li>
  <li><strong>Revenue-Based Financing:</strong> Flexible repayment tied to revenue</li>
</ul>

<h2>Preparing for Investment</h2>
<p>Before seeking funding, make sure you have:</p>
<ol>
  <li>A clear impact thesis and measurable outcomes</li>
  <li>A solid business model with revenue projections</li>
  <li>A strong team with complementary skills</li>
  <li>Proof of concept or early traction</li>
  <li>Well-documented financials and impact metrics</li>
</ol>

<blockquote>
  <p>"Impact investors are looking for businesses that can scale both their impact and their revenue."</p>
</blockquote>

<h2>Finding the Right Investors</h2>
<p>Not all investors are created equal. Look for:</p>
<ul>
  <li>Investors who share your mission and values</li>
  <li>Those with experience in your sector</li>
  <li>Partners who can provide mentorship and connections</li>
  <li>Investors with patient capital aligned with your timeline</li>
</ul>

<h2>Pitching to Impact Investors</h2>
<p>When pitching, emphasize:</p>
<ol>
  <li>The social problem you're solving and its scale</li>
  <li>Your unique solution and competitive advantage</li>
  <li>Your business model and path to profitability</li>
  <li>Measurable impact metrics and outcomes</li>
  <li>Your team's ability to execute</li>
</ol>

<p>Remember, impact investors want to see that you can create both meaningful change and sustainable returns. Balance your pitch to show you understand both sides of the equation.</p>`,
    posterImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    author: "Rachel Kim",
    isPublished: true,
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9"],
    dislikes: [],
    comments: [
      {
        author: "Tom Anderson",
        content: "This is incredibly helpful! We're just starting to look for funding and this gives us a clear roadmap.",
        createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Jessica White",
        content: "The section on finding the right investors is spot on. We made the mistake of taking money from the wrong investor early on.",
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 312,
  },
  {
    title: "Leveraging Technology for Social Good: Digital Solutions That Scale",
    slug: "leveraging-technology-social-good-digital-solutions-scale",
    excerpt: "Explore how modern technology can amplify your social impact and help you reach more people with innovative digital solutions.",
    content: `<h1>Leveraging Technology for Social Good</h1>
<p>Technology has become a powerful enabler for social entrepreneurs, allowing them to <strong>scale impact</strong> in ways that were previously impossible. From mobile apps to AI-powered platforms, digital solutions are transforming how we address social challenges.</p>

<h2>Why Technology Matters</h2>
<p>Technology can help social enterprises:</p>
<ul>
  <li>Reach underserved communities at scale</li>
  <li>Reduce operational costs and increase efficiency</li>
  <li>Collect and analyze data for better decision-making</li>
  <li>Create innovative solutions to complex problems</li>
  <li>Connect stakeholders and build communities</li>
</ul>

<h2>Key Technologies for Social Impact</h2>
<ol>
  <li><strong>Mobile Technology:</strong> Reaching people where they are</li>
  <li><strong>Cloud Computing:</strong> Scalable infrastructure without high upfront costs</li>
  <li><strong>AI and Machine Learning:</strong> Personalized solutions and predictive analytics</li>
  <li><strong>Blockchain:</strong> Transparency and trust in transactions</li>
  <li><strong>IoT Sensors:</strong> Real-time monitoring and data collection</li>
</ol>

<blockquote>
  <p>"Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important." - Bill Gates</p>
</blockquote>

<h2>Building Digital Solutions</h2>
<p>When developing technology for social impact:</p>
<ul>
  <li>Start with the problem, not the technology</li>
  <li>Design with your users in mind (user-centered design)</li>
  <li>Consider accessibility and digital literacy</li>
  <li>Plan for scalability from the beginning</li>
  <li>Ensure data privacy and security</li>
</ul>

<h2>Real-World Examples</h2>
<p>Successful tech-enabled social enterprises include:</p>
<ul>
  <li>Mobile health platforms bringing healthcare to remote areas</li>
  <li>EdTech apps providing quality education to underserved students</li>
  <li>FinTech solutions enabling financial inclusion</li>
  <li>Platforms connecting volunteers with opportunities</li>
</ul>

<h2>Getting Started</h2>
<p>If you're considering technology for your social enterprise:</p>
<ol>
  <li>Identify where technology can amplify your impact</li>
  <li>Start with an MVP (Minimum Viable Product)</li>
  <li>Partner with tech experts if needed</li>
  <li>Test with real users early and often</li>
  <li>Iterate based on feedback</li>
</ol>

<p>Technology alone won't solve social problems, but when combined with a deep understanding of the communities you serve, it can be a powerful force for change.</p>`,
    posterImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    author: "Kevin Patel",
    isPublished: true,
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10", "user11"],
    dislikes: ["user12"],
    comments: [
      {
        author: "Nicole Garcia",
        content: "Great insights on leveraging technology! We're building a mobile app and this article gave us some important considerations we hadn't thought about.",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Mark Johnson",
        content: "The emphasis on starting with the problem rather than the technology is crucial. Too many startups make this mistake.",
        createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 456,
  },
  {
    title: "Networking for Social Entrepreneurs: Building Meaningful Connections",
    slug: "networking-social-entrepreneurs-building-meaningful-connections",
    excerpt: "Learn how to build a strong network that supports your social enterprise journey, from finding mentors to connecting with potential partners.",
    content: `<h1>Networking for Social Entrepreneurs</h1>
<p>Building a strong network is essential for social entrepreneurs. Your network can provide <strong>mentorship, funding, partnerships, and support</strong> throughout your journey. But effective networking is about quality, not just quantity.</p>

<h2>Why Networking Matters</h2>
<p>A strong network can help you:</p>
<ul>
  <li>Find mentors and advisors</li>
  <li>Connect with potential investors and funders</li>
  <li>Build strategic partnerships</li>
  <li>Learn from others' experiences</li>
  <li>Access resources and opportunities</li>
</ul>

<h2>Where to Network</h2>
<ol>
  <li><strong>Social Entrepreneurship Conferences:</strong> Events like SOCAP, Skoll World Forum</li>
  <li><strong>University Programs:</strong> Entrepreneurship centers and alumni networks</li>
  <li><strong>Online Communities:</strong> LinkedIn groups, Slack communities, forums</li>
  <li><strong>Local Meetups:</strong> Startup events and social impact gatherings</li>
  <li><strong>Accelerator Programs:</strong> Cohort-based programs with built-in networking</li>
</ol>

<blockquote>
  <p>"Your network is your net worth." - Porter Gale</p>
</blockquote>

<h2>How to Network Effectively</h2>
<p>Effective networking is about building genuine relationships:</p>
<ul>
  <li><strong>Be Authentic:</strong> Show genuine interest in others</li>
  <li><strong>Give Before You Ask:</strong> Offer value to others first</li>
  <li><strong>Follow Up:</strong> Maintain connections after initial meetings</li>
  <li><strong>Be Specific:</strong> Know what you're looking for and how others can help</li>
  <li><strong>Stay Connected:</strong> Regular check-ins, not just when you need something</li>
</ul>

<h2>Building Your Network Strategically</h2>
<p>Think about your network in layers:</p>
<ol>
  <li><strong>Core Advisors:</strong> 3-5 people who deeply understand your mission</li>
  <li><strong>Industry Experts:</strong> People with domain expertise in your sector</li>
  <li><strong>Peers:</strong> Other entrepreneurs facing similar challenges</li>
  <li><strong>Potential Partners:</strong> Organizations you might collaborate with</li>
  <li><strong>Investors and Funders:</strong> People who can provide capital</li>
</ol>

<h2>Maintaining Relationships</h2>
<p>Networking isn't a one-time activity:</p>
<ul>
  <li>Schedule regular check-ins with key contacts</li>
  <li>Share updates about your progress</li>
  <li>Offer help when you can</li>
  <li>Introduce people in your network to each other</li>
  <li>Celebrate others' successes</li>
</ul>

<p>Remember, the best networks are built on mutual respect and genuine relationships. Focus on building connections that matter, not just collecting business cards.</p>`,
    posterImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
    author: "Amanda Foster",
    isPublished: true,
    publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6"],
    dislikes: [],
    comments: [
      {
        author: "Ryan Mitchell",
        content: "The section on giving before asking really resonates. I've found that the best connections come from genuinely helping others.",
        createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 223,
  },
  {
    title: "Scaling Your Social Enterprise: Growth Strategies That Work",
    slug: "scaling-social-enterprise-growth-strategies-that-work",
    excerpt: "Discover proven strategies for scaling your social enterprise while maintaining your mission and maximizing your impact.",
    content: `<h1>Scaling Your Social Enterprise: Growth Strategies That Work</h1>
<p>Scaling a social enterprise is different from scaling a traditional business. You need to grow not just your revenue, but also your <strong>social impact</strong>—and often these two goals need to be balanced carefully.</p>

<h2>What Does Scaling Mean for Social Enterprises?</h2>
<p>Scaling can mean different things:</p>
<ul>
  <li><strong>Geographic Expansion:</strong> Reaching new regions or countries</li>
  <li><strong>Impact Scaling:</strong> Serving more people or creating deeper impact</li>
  <li><strong>Revenue Scaling:</strong> Growing your financial sustainability</li>
  <li><strong>Model Replication:</strong> Adapting your model to new contexts</li>
</ul>

<h2>Key Principles for Scaling</h2>
<ol>
  <li><strong>Maintain Mission Alignment:</strong> Don't compromise your social mission for growth</li>
  <li><strong>Build Strong Systems:</strong> Create processes that can scale</li>
  <li><strong>Invest in Your Team:</strong> Your people are your most important asset</li>
  <li><strong>Measure Everything:</strong> Track both impact and financial metrics</li>
  <li><strong>Stay Flexible:</strong> Be ready to adapt your model</li>
</ol>

<blockquote>
  <p>"Scale is not about size. It's about impact." - Muhammad Yunus</p>
</blockquote>

<h2>Scaling Strategies</h2>
<p>Common approaches to scaling include:</p>
<ul>
  <li><strong>Franchising:</strong> Replicating your model through partners</li>
  <li><strong>Licensing:</strong> Allowing others to use your methodology</li>
  <li><strong>Partnerships:</strong> Collaborating with larger organizations</li>
  <li><strong>Technology:</strong> Using digital tools to reach more people</li>
  <li><strong>Advocacy:</strong> Influencing policy to create systemic change</li>
</ul>

<h2>Challenges of Scaling</h2>
<p>Be prepared for these common challenges:</p>
<ul>
  <li>Maintaining quality as you grow</li>
  <li>Preserving your organizational culture</li>
  <li>Securing adequate funding for growth</li>
  <li>Adapting to new markets and contexts</li>
  <li>Balancing impact and financial sustainability</li>
</ul>

<h2>When to Scale</h2>
<p>Consider scaling when:</p>
<ol>
  <li>You have a proven, replicable model</li>
  <li>You've achieved product-market fit</li>
  <li>You have strong systems and processes</li>
  <li>You have the right team in place</li>
  <li>You have access to necessary resources</li>
</ol>

<h2>Getting Started</h2>
<p>If you're ready to scale:</p>
<ol>
  <li>Define what scaling means for your organization</li>
  <li>Assess your readiness across all dimensions</li>
  <li>Develop a scaling strategy aligned with your mission</li>
  <li>Secure the necessary resources</li>
  <li>Start small and test your approach</li>
</ol>

<p>Remember, scaling is a journey, not a destination. Focus on sustainable growth that amplifies your impact while maintaining the integrity of your mission.</p>`,
    posterImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    author: "Carlos Rodriguez",
    isPublished: true,
    publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"],
    dislikes: [],
    comments: [
      {
        author: "Laura Chen",
        content: "This article came at the perfect time! We're just starting to think about scaling and this gives us a great framework.",
        createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Michael Brown",
        content: "The balance between impact and financial sustainability is so challenging. Great insights on how to approach this.",
        createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 367,
  },
  {
    title: "Design Thinking for Social Innovation: A Human-Centered Approach",
    slug: "design-thinking-social-innovation-human-centered-approach",
    excerpt: "Learn how to apply design thinking principles to create solutions that truly address the needs of the communities you serve.",
    content: `<h1>Design Thinking for Social Innovation</h1>
<p>Design thinking is a powerful methodology for social entrepreneurs. It puts <strong>people at the center</strong> of the problem-solving process, ensuring that solutions are not just innovative, but also truly meet the needs of those you're trying to help.</p>

<h2>What is Design Thinking?</h2>
<p>Design thinking is an iterative process that involves:</p>
<ul>
  <li>Understanding the human needs involved</li>
  <li>Redefining problems in human-centric ways</li>
  <li>Creating many ideas in brainstorming sessions</li>
  <li>Adopting a hands-on approach to prototyping and testing</li>
</ul>

<h2>The Design Thinking Process</h2>
<ol>
  <li><strong>Empathize:</strong> Understand your users' needs, experiences, and motivations</li>
  <li><strong>Define:</strong> Synthesize your findings into a clear problem statement</li>
  <li><strong>Ideate:</strong> Brainstorm creative solutions without constraints</li>
  <li><strong>Prototype:</strong> Build low-fidelity versions of your solutions</li>
  <li><strong>Test:</strong> Try your prototypes with real users and gather feedback</li>
</ol>

<blockquote>
  <p>"Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs</p>
</blockquote>

<h2>Why It Works for Social Innovation</h2>
<p>Design thinking is particularly effective for social enterprises because:</p>
<ul>
  <li>It ensures solutions are truly user-centered</li>
  <li>It helps avoid assumptions about what people need</li>
  <li>It encourages testing before large-scale implementation</li>
  <li>It promotes empathy and understanding</li>
  <li>It leads to more sustainable and appropriate solutions</li>
</ul>

<h2>Key Principles</h2>
<p>When applying design thinking to social innovation:</p>
<ul>
  <li><strong>Start with People:</strong> Always begin by understanding your users</li>
  <li><strong>Embrace Ambiguity:</strong> Be comfortable with uncertainty</li>
  <li><strong>Fail Fast, Learn Fast:</strong> Test ideas quickly and cheaply</li>
  <li><strong>Collaborate:</strong> Work with diverse teams and stakeholders</li>
  <li><strong>Iterate:</strong> Refine solutions based on feedback</li>
</ul>

<h2>Common Pitfalls to Avoid</h2>
<p>Watch out for these mistakes:</p>
<ul>
  <li>Assuming you know what users need without research</li>
  <li>Skipping the empathy phase</li>
  <li>Falling in love with your first idea</li>
  <li>Testing with the wrong users</li>
  <li>Not iterating based on feedback</li>
</ul>

<h2>Getting Started</h2>
<p>To apply design thinking to your social enterprise:</p>
<ol>
  <li>Spend time with your target community</li>
  <li>Observe and listen without judgment</li>
  <li>Define the problem from their perspective</li>
  <li>Brainstorm widely before narrowing down</li>
  <li>Build simple prototypes and test early</li>
</ol>

<p>Design thinking isn't just a process—it's a mindset. It's about staying curious, being empathetic, and always putting the people you serve at the center of everything you do.</p>`,
    posterImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    author: "Priya Sharma",
    isPublished: true,
    publishedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7"],
    dislikes: [],
    comments: [
      {
        author: "Emma Davis",
        content: "We've been using design thinking in our work and it's made such a difference! This article captures the essence perfectly.",
        createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "John Martinez",
        content: "The emphasis on empathy is so important. Too often we think we know what people need without actually asking them.",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 289,
  },
  {
    title: "Storytelling for Social Change: How to Communicate Your Mission",
    slug: "storytelling-social-change-communicate-mission",
    excerpt: "Master the art of storytelling to effectively communicate your social enterprise's mission, impact, and vision to stakeholders, funders, and communities.",
    content: `<h1>Storytelling for Social Change</h1>
<p>Stories have the power to inspire, connect, and drive action. For social entrepreneurs, <strong>effective storytelling</strong> is essential for communicating your mission, attracting support, and creating lasting change.</p>

<h2>Why Stories Matter</h2>
<p>Stories can:</p>
<ul>
  <li>Make your mission memorable and relatable</li>
  <li>Connect emotionally with your audience</li>
  <li>Illustrate your impact in concrete terms</li>
  <li>Inspire action and support</li>
  <li>Build a community around your cause</li>
</ul>

<h2>Elements of a Compelling Story</h2>
<p>Every great story has:</p>
<ol>
  <li><strong>A Hero:</strong> The person or community you're helping</li>
  <li><strong>A Challenge:</strong> The problem they face</li>
  <li><strong>A Journey:</strong> How your solution helps them</li>
  <li><strong>A Transformation:</strong> The change that results</li>
  <li><strong>A Call to Action:</strong> What you want your audience to do</li>
</ol>

<blockquote>
  <p>"Stories are the most powerful tool we have for changing the world." - Anonymous</p>
</blockquote>

<h2>Types of Stories to Tell</h2>
<p>Different stories serve different purposes:</p>
<ul>
  <li><strong>Origin Stories:</strong> Why you started your enterprise</li>
  <li><strong>Impact Stories:</strong> How you've changed someone's life</li>
  <li><strong>Team Stories:</strong> The people behind your mission</li>
  <li><strong>Challenge Stories:</strong> Obstacles you've overcome</li>
  <li><strong>Vision Stories:</strong> The future you're working toward</li>
</ul>

<h2>Storytelling Best Practices</h2>
<p>To tell effective stories:</p>
<ul>
  <li><strong>Be Authentic:</strong> Share real experiences and emotions</li>
  <li><strong>Show, Don't Tell:</strong> Use specific details and examples</li>
  <li><strong>Keep It Simple:</strong> Focus on one clear message</li>
  <li><strong>Make It Personal:</strong> Connect to universal human experiences</li>
  <li><strong>Include Data:</strong> Support stories with facts and numbers</li>
</ul>

<h2>Where to Share Your Stories</h2>
<p>Tell your stories across multiple channels:</p>
<ol>
  <li>Your website and blog</li>
  <li>Social media platforms</li>
  <li>Pitch presentations and investor meetings</li>
  <li>Annual reports and impact assessments</li>
  <li>Speaking engagements and conferences</li>
</ol>

<h2>Common Mistakes to Avoid</h2>
<p>Watch out for these pitfalls:</p>
<ul>
  <li>Making yourself the hero instead of the people you serve</li>
  <li>Using jargon that your audience doesn't understand</li>
  <li>Telling stories that aren't aligned with your mission</li>
  <li>Forgetting to include a clear call to action</li>
  <li>Sharing stories without permission from those involved</li>
</ul>

<h2>Getting Started</h2>
<p>To improve your storytelling:</p>
<ol>
  <li>Collect stories from your work regularly</li>
  <li>Practice telling stories to different audiences</li>
  <li>Get feedback and refine your approach</li>
  <li>Build a library of stories for different contexts</li>
  <li>Always get consent before sharing personal stories</li>
</ol>

<p>Remember, the best stories are those that are true, meaningful, and inspire others to join you in creating change. Your story is your most powerful tool—use it wisely.</p>`,
    posterImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop",
    author: "Sophie Williams",
    isPublished: true,
    publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9"],
    dislikes: [],
    comments: [
      {
        author: "Alex Thompson",
        content: "This is so helpful! We've been struggling with how to communicate our impact, and storytelling is clearly the answer.",
        createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "Maya Patel",
        content: "The reminder to make the people we serve the heroes, not ourselves, is so important. Great article!",
        createdAt: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 401,
  },
  {
    title: "Financial Sustainability in Social Enterprises: Beyond Grants and Donations",
    slug: "financial-sustainability-social-enterprises-beyond-grants-donations",
    excerpt: "Learn how to build a financially sustainable social enterprise with diverse revenue streams that support both your mission and your operations.",
    content: `<h1>Financial Sustainability in Social Enterprises</h1>
<p>Financial sustainability is crucial for social enterprises. While grants and donations can get you started, building <strong>diverse revenue streams</strong> ensures you can continue creating impact long-term.</p>

<h2>Why Financial Sustainability Matters</h2>
<p>Sustainable revenue allows you to:</p>
<ul>
  <li>Plan for the long term without constant fundraising</li>
  <li>Invest in growth and scaling</li>
  <li>Attract and retain talented team members</li>
  <li>Maintain independence and mission focus</li>
  <li>Weather economic downturns</li>
</ul>

<h2>Revenue Models for Social Enterprises</h2>
<p>Common revenue models include:</p>
<ol>
  <li><strong>Fee-for-Service:</strong> Charging for products or services</li>
  <li><strong>Cross-Subsidization:</strong> Higher prices for some, lower for others</li>
  <li><strong>Membership/Subscription:</strong> Recurring revenue from members</li>
  <li><strong>Licensing:</strong> Licensing your methodology or IP</li>
  <li><strong>Social Enterprise Products:</strong> Selling products that fund your mission</li>
</ol>

<blockquote>
  <p>"The best way to predict the future is to create it—and that requires financial sustainability."</p>
</blockquote>

<h2>Building Diverse Revenue Streams</h2>
<p>Don't rely on a single source of revenue:</p>
<ul>
  <li>Mix earned revenue with grants and donations</li>
  <li>Develop multiple products or services</li>
  <li>Serve different customer segments</li>
  <li>Create recurring revenue where possible</li>
  <li>Build reserves for stability</li>
</ul>

<h2>Pricing Strategies</h2>
<p>Pricing for social enterprises requires balance:</p>
<ul>
  <li><strong>Value-Based Pricing:</strong> Price based on value delivered</li>
  <li><strong>Sliding Scale:</strong> Adjust prices based on ability to pay</li>
  <li><strong>Bundling:</strong> Combine products/services for better value</li>
  <li><strong>Freemium Models:</strong> Free basic, paid premium</li>
  <li><strong>Impact Pricing:</strong> Link price to impact achieved</li>
</ul>

<h2>Financial Planning</h2>
<p>Effective financial planning includes:</p>
<ol>
  <li>Creating realistic revenue projections</li>
  <li>Tracking key financial metrics</li>
  <li>Building cash reserves (3-6 months)</li>
  <li>Managing cash flow carefully</li>
  <li>Regular financial reviews and adjustments</li>
</ol>

<h2>Common Challenges</h2>
<p>Be prepared for these challenges:</p>
<ul>
  <li>Balancing affordability with sustainability</li>
  <li>Convincing stakeholders of earned revenue models</li>
  <li>Managing multiple revenue streams</li>
  <li>Seasonal fluctuations in revenue</li>
  <li>Investing in revenue-generating activities</li>
</ul>

<h2>Getting Started</h2>
<p>To build financial sustainability:</p>
<ol>
  <li>Assess your current revenue model</li>
  <li>Identify opportunities for earned revenue</li>
  <li>Test new revenue streams on a small scale</li>
  <li>Diversify gradually, not all at once</li>
  <li>Monitor and adjust based on results</li>
</ol>

<p>Remember, financial sustainability doesn't mean abandoning your social mission—it means finding ways to fund that mission that are sustainable and scalable. The most successful social enterprises combine mission and money effectively.</p>`,
    posterImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop",
    author: "David Lee",
    isPublished: true,
    publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    likes: ["user1", "user2", "user3", "user4", "user5", "user6", "user7"],
    dislikes: [],
    comments: [
      {
        author: "Sarah Kim",
        content: "This is exactly what we needed! We've been too dependent on grants and need to build more sustainable revenue.",
        createdAt: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
      {
        author: "James Wilson",
        content: "The section on pricing strategies is really helpful. We've been struggling with how to price our services.",
        createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
        isApproved: true,
      },
    ],
    views: 334,
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