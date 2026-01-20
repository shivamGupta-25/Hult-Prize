import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Warning: Could not load .env.local file');
}

// Import models and utilities
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas inline to avoid import issues
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    posterImage: { type: String, default: '' },
    author: { type: String, required: true, trim: true },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CommentSchema = new mongoose.Schema(
  {
    blogSlug: { type: String, required: true, index: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', index: true },
    author: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

// Helper function to generate random user IDs for likes/dislikes
const generateUserIds = (count) => {
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(`user_${Math.random().toString(36).substr(2, 9)}`);
  }
  return ids;
};

// Helper function to get a date in the past
const getPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Rich blog content data
const blogsData = [
  {
    title: 'The Future of AI in Social Impact: Transforming Communities Through Technology',
    slug: 'future-of-ai-social-impact',
    excerpt: 'Exploring how artificial intelligence is revolutionizing social entrepreneurship and creating sustainable solutions for global challenges.',
    content: `
      <h2>Introduction</h2>
      <p>Artificial Intelligence is no longer just a buzzword in the tech industry—it's becoming a powerful tool for social change. From predicting climate patterns to optimizing resource distribution in underserved communities, AI is transforming how we approach social impact.</p>
      
      <h2>AI-Powered Solutions for Global Challenges</h2>
      <p>Social entrepreneurs are leveraging machine learning algorithms to tackle some of humanity's most pressing issues:</p>
      <ul>
        <li><strong>Healthcare Access:</strong> AI-powered diagnostic tools are bringing medical expertise to remote areas</li>
        <li><strong>Education Equity:</strong> Personalized learning platforms are adapting to individual student needs</li>
        <li><strong>Food Security:</strong> Predictive analytics help optimize crop yields and reduce waste</li>
        <li><strong>Climate Action:</strong> Machine learning models predict environmental changes and guide sustainable practices</li>
      </ul>
      
      <h2>Case Study: AI in Agriculture</h2>
      <p>In rural India, farmers are using AI-powered mobile apps to detect crop diseases early, receive weather predictions, and access market prices in real-time. This technology has increased crop yields by 30% while reducing pesticide use by 40%.</p>
      
      <h2>Ethical Considerations</h2>
      <p>As we embrace AI for social good, we must address critical questions about data privacy, algorithmic bias, and equitable access to technology. The future of AI in social impact depends on our commitment to inclusive and ethical innovation.</p>
      
      <h2>Conclusion</h2>
      <p>The intersection of AI and social entrepreneurship presents unprecedented opportunities to create scalable, sustainable solutions. As we move forward, collaboration between technologists, social entrepreneurs, and communities will be key to realizing AI's full potential for positive change.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    author: 'Dr. Priya Sharma',
    isPublished: true,
    isFeatured: true,
    publishedAt: getPastDate(5),
    likes: generateUserIds(127),
    dislikes: generateUserIds(8),
    views: 2847,
    commentCount: 0,
  },
  {
    title: 'Building Sustainable Startups: Lessons from Hult Prize Winners',
    slug: 'sustainable-startups-hult-prize-lessons',
    excerpt: 'Key insights and strategies from successful Hult Prize teams on creating businesses that balance profit with purpose.',
    content: `
      <h2>The Hult Prize Journey</h2>
      <p>Every year, thousands of students compete in the Hult Prize, the world's largest student competition for social good. But what separates the winners from the rest? We spoke with past champions to uncover their secrets to success.</p>
      
      <h2>1. Start with a Real Problem</h2>
      <p>Don't create solutions looking for problems. The most successful social enterprises emerge from deep understanding of community needs. Spend time in the field, listen to stakeholders, and validate your assumptions before building.</p>
      
      <h2>2. Design for Scalability from Day One</h2>
      <p>Winners think beyond pilot projects. They design business models that can scale across regions and adapt to different contexts while maintaining their core impact.</p>
      <blockquote>
        "We didn't just want to help one village—we wanted to create a model that could transform thousands of communities." - 2022 Hult Prize Winner
      </blockquote>
      
      <h2>3. Measure Impact Rigorously</h2>
      <p>Successful teams track both financial metrics and social impact indicators. They use data to iterate, improve, and demonstrate value to investors and beneficiaries alike.</p>
      
      <h2>4. Build Diverse Teams</h2>
      <p>The best solutions come from diverse perspectives. Winning teams combine technical expertise, business acumen, cultural understanding, and lived experience.</p>
      
      <h2>5. Embrace Failure as Learning</h2>
      <p>Every Hult Prize winner has faced setbacks. The difference is how they respond—treating failures as valuable data points rather than dead ends.</p>
      
      <h2>Your Turn</h2>
      <p>Whether you're preparing for the Hult Prize or building your own social venture, these principles can guide your journey. Remember: sustainable impact requires sustainable business models.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    author: 'Rajesh Kumar',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(12),
    likes: generateUserIds(94),
    dislikes: generateUserIds(3),
    views: 1923,
    commentCount: 0,
  },
  {
    title: 'Circular Economy: Redesigning Business for Zero Waste',
    slug: 'circular-economy-zero-waste-business',
    excerpt: 'How innovative companies are transforming waste into resources and building regenerative business models.',
    content: `
      <h2>Beyond Recycling: The Circular Economy Vision</h2>
      <p>The circular economy represents a fundamental shift from our traditional "take-make-dispose" model to one where waste is designed out of the system entirely. Products are created to be reused, repaired, and regenerated.</p>
      
      <h2>Real-World Examples</h2>
      <h3>Fashion Industry Transformation</h3>
      <p>Companies like Patagonia and Eileen Fisher are pioneering take-back programs, turning old garments into new products. This closes the loop and reduces textile waste that would otherwise end up in landfills.</p>
      
      <h3>Food Waste Innovation</h3>
      <p>Startups are converting food waste into valuable products: animal feed, bioplastics, and even building materials. One company in Singapore turns spent coffee grounds into sustainable furniture.</p>
      
      <h3>Electronics Refurbishment</h3>
      <p>The electronics industry is embracing modular design, making devices easier to repair and upgrade. This extends product lifecycles and reduces e-waste.</p>
      
      <h2>Business Benefits</h2>
      <ul>
        <li>Reduced material costs through resource efficiency</li>
        <li>New revenue streams from waste valorization</li>
        <li>Enhanced brand reputation and customer loyalty</li>
        <li>Resilience against resource scarcity and price volatility</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Transitioning to a circular model doesn't happen overnight. Start by:</p>
      <ol>
        <li>Mapping your material flows and identifying waste streams</li>
        <li>Designing products for longevity and disassembly</li>
        <li>Creating reverse logistics systems</li>
        <li>Partnering with other businesses to close loops</li>
      </ol>
      
      <h2>The Path Forward</h2>
      <p>The circular economy isn't just environmentally necessary—it's economically advantageous. As resources become scarcer and regulations tighten, circular business models will become the competitive advantage.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=600&fit=crop',
    author: 'Sarah Chen',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(20),
    likes: generateUserIds(76),
    dislikes: generateUserIds(5),
    views: 1456,
    commentCount: 0,
  },
  {
    title: 'Fintech for Financial Inclusion: Banking the Unbanked',
    slug: 'fintech-financial-inclusion-unbanked',
    excerpt: 'Digital financial services are bringing banking to billions of people previously excluded from the formal financial system.',
    content: `
      <h2>The Financial Inclusion Gap</h2>
      <p>Globally, 1.4 billion adults remain unbanked, lacking access to basic financial services. This exclusion perpetuates poverty cycles and limits economic opportunities. Fintech is changing this landscape dramatically.</p>
      
      <h2>Mobile Money Revolution</h2>
      <p>In Kenya, M-Pesa transformed financial access for millions. Today, similar platforms across Africa and Asia enable people to save, send money, and access credit using just a mobile phone—no bank account required.</p>
      
      <h2>Key Innovations</h2>
      <h3>Alternative Credit Scoring</h3>
      <p>Traditional banks rely on credit history that many people lack. Fintech companies use alternative data—mobile phone usage, utility payments, social connections—to assess creditworthiness and extend loans to previously "unbankable" individuals.</p>
      
      <h3>Micro-Savings Platforms</h3>
      <p>Apps that allow people to save tiny amounts—even a few cents—are building financial resilience in low-income communities. Automated savings features help users build emergency funds without thinking about it.</p>
      
      <h3>Blockchain for Remittances</h3>
      <p>Cryptocurrency and blockchain technology are reducing the cost of international remittances, which are a lifeline for many families in developing countries. Traditional services charge 6-10%; blockchain solutions can reduce this to under 2%.</p>
      
      <h2>Challenges and Considerations</h2>
      <ul>
        <li><strong>Digital Literacy:</strong> Technology alone isn't enough; users need education and support</li>
        <li><strong>Regulation:</strong> Balancing innovation with consumer protection</li>
        <li><strong>Infrastructure:</strong> Reliable internet and electricity access remain barriers</li>
        <li><strong>Trust:</strong> Building confidence in digital financial services</li>
      </ul>
      
      <h2>Impact Stories</h2>
      <p>Maria, a small business owner in rural Philippines, used a micro-loan accessed through her phone to expand her sari-sari store. Within a year, her income doubled, and she's now employing two neighbors.</p>
      
      <h2>The Future</h2>
      <p>As smartphone penetration increases and fintech solutions become more sophisticated, we're moving toward a world where everyone has access to affordable, convenient financial services. This isn't just about banking—it's about economic empowerment and opportunity.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
    author: 'Michael Okonkwo',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(28),
    likes: generateUserIds(103),
    dislikes: generateUserIds(7),
    views: 2134,
    commentCount: 0,
  },
  {
    title: 'Climate Tech Innovations: Solutions for a Warming Planet',
    slug: 'climate-tech-innovations-warming-planet',
    excerpt: 'From carbon capture to renewable energy storage, breakthrough technologies are emerging to combat climate change.',
    content: `
      <h2>The Climate Crisis Demands Innovation</h2>
      <p>With global temperatures rising and extreme weather events becoming more frequent, the need for climate solutions has never been more urgent. Fortunately, a new generation of climate tech startups is rising to the challenge.</p>
      
      <h2>Carbon Capture and Removal</h2>
      <p>Direct air capture technology is maturing rapidly. Companies like Climeworks are building facilities that pull CO2 directly from the atmosphere and store it underground or convert it into useful products.</p>
      
      <h2>Next-Generation Energy Storage</h2>
      <p>The renewable energy transition depends on solving the storage problem. Innovations include:</p>
      <ul>
        <li><strong>Solid-state batteries:</strong> Safer, more efficient than lithium-ion</li>
        <li><strong>Gravity storage:</strong> Using excess energy to lift heavy blocks, releasing it when needed</li>
        <li><strong>Green hydrogen:</strong> Storing energy in hydrogen fuel for industrial applications</li>
        <li><strong>Thermal storage:</strong> Storing heat in molten salt for 24/7 solar power</li>
      </ul>
      
      <h2>Sustainable Agriculture Tech</h2>
      <p>Agriculture contributes 25% of global emissions. Climate-smart solutions include:</p>
      <ul>
        <li>Precision agriculture using AI and IoT to optimize inputs</li>
        <li>Vertical farming reducing land use and water consumption</li>
        <li>Alternative proteins (plant-based and cultivated meat)</li>
        <li>Regenerative farming practices that sequester carbon in soil</li>
      </ul>
      
      <h2>Clean Transportation</h2>
      <p>Beyond electric cars, innovations include electric aviation, hydrogen-powered ships, and hyperloop systems that could revolutionize long-distance travel.</p>
      
      <h2>Building Materials Innovation</h2>
      <p>Cement production alone accounts for 8% of global CO2 emissions. Startups are developing carbon-negative concrete, mass timber construction, and other sustainable building materials.</p>
      
      <h2>The Investment Opportunity</h2>
      <p>Climate tech is attracting record investment—over $40 billion in 2023. This isn't just about saving the planet; it's about building the infrastructure for a sustainable economy.</p>
      
      <h2>What You Can Do</h2>
      <p>Whether you're an entrepreneur, investor, or concerned citizen, there are ways to contribute to climate solutions. The transition to a sustainable future will create millions of jobs and countless opportunities for innovation.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop',
    author: 'Dr. Elena Rodriguez',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(35),
    likes: generateUserIds(156),
    dislikes: generateUserIds(12),
    views: 3421,
    commentCount: 0,
  },
  {
    title: 'EdTech Revolution: Democratizing Quality Education',
    slug: 'edtech-revolution-democratizing-education',
    excerpt: 'Technology is breaking down barriers to education, making world-class learning accessible to anyone with an internet connection.',
    content: `
      <h2>Education as a Human Right</h2>
      <p>Quality education shouldn't be a privilege reserved for the wealthy. EdTech is making it possible for anyone, anywhere to access world-class learning resources.</p>
      
      <h2>The MOOC Movement</h2>
      <p>Massive Open Online Courses from platforms like Coursera, edX, and Khan Academy have brought university-level education to millions. A student in rural India can now take courses from MIT, Stanford, or Harvard—often for free.</p>
      
      <h2>Personalized Learning</h2>
      <p>AI-powered platforms adapt to individual learning styles and paces. Instead of one-size-fits-all education, students receive customized content and support based on their unique needs and progress.</p>
      
      <h2>Gamification and Engagement</h2>
      <p>Apps like Duolingo have proven that learning can be fun and addictive. By incorporating game mechanics—points, levels, streaks—educational apps keep students motivated and engaged.</p>
      
      <h2>Virtual and Augmented Reality</h2>
      <p>Imagine learning about ancient Rome by walking through a virtual reconstruction, or understanding molecular biology by manipulating 3D molecules with your hands. VR and AR are making abstract concepts tangible.</p>
      
      <h2>Bridging the Skills Gap</h2>
      <p>Traditional education often lags behind industry needs. Online bootcamps and micro-credentials allow people to quickly gain in-demand skills in areas like coding, data science, and digital marketing.</p>
      
      <h2>Challenges to Address</h2>
      <ul>
        <li><strong>Digital Divide:</strong> Not everyone has reliable internet access</li>
        <li><strong>Quality Control:</strong> Ensuring educational content is accurate and effective</li>
        <li><strong>Completion Rates:</strong> Online courses have high dropout rates</li>
        <li><strong>Recognition:</strong> Getting employers to value online credentials</li>
      </ul>
      
      <h2>Success Stories</h2>
      <p>Ahmed, a refugee in Jordan, learned web development through free online courses. Today, he works remotely for a European company, supporting his family and building a new life.</p>
      
      <h2>The Future of Learning</h2>
      <p>As EdTech continues to evolve, we're moving toward a world where education is truly lifelong, accessible, and tailored to individual needs. This transformation has the potential to unlock human potential on an unprecedented scale.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop',
    author: 'Aisha Patel',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(42),
    likes: generateUserIds(88),
    dislikes: generateUserIds(4),
    views: 1678,
    commentCount: 0,
  },
  {
    title: 'Social Entrepreneurship 101: Getting Started Guide',
    slug: 'social-entrepreneurship-101-getting-started',
    excerpt: 'A comprehensive guide for aspiring social entrepreneurs on turning your passion for change into a sustainable venture.',
    content: `
      <h2>What is Social Entrepreneurship?</h2>
      <p>Social entrepreneurship combines the passion of a social mission with business discipline, innovation, and determination. It's about creating sustainable solutions to social problems.</p>
      
      <h2>Step 1: Identify Your Cause</h2>
      <p>Start with what you care about deeply. What social or environmental problem keeps you up at night? Your passion will sustain you through the inevitable challenges ahead.</p>
      
      <h2>Step 2: Understand the Problem</h2>
      <p>Don't assume you know the solution. Spend time with the communities you want to serve. Listen more than you talk. Understand root causes, not just symptoms.</p>
      
      <h2>Step 3: Design Your Solution</h2>
      <p>Think creatively about how to address the problem. Consider:</p>
      <ul>
        <li>What already exists? How can you improve or scale it?</li>
        <li>What resources are available in the community?</li>
        <li>How can technology amplify your impact?</li>
        <li>What makes your approach unique?</li>
      </ul>
      
      <h2>Step 4: Build a Sustainable Business Model</h2>
      <p>Impact without sustainability is just charity. You need a model that generates revenue to sustain and scale your work. Options include:</p>
      <ul>
        <li><strong>Fee-for-service:</strong> Customers pay for your product/service</li>
        <li><strong>Cross-subsidy:</strong> Profitable customers subsidize services for those who can't pay</li>
        <li><strong>Hybrid:</strong> Mix of earned revenue and grants/donations</li>
      </ul>
      
      <h2>Step 5: Measure Your Impact</h2>
      <p>Define clear metrics for both social impact and financial performance. Track them rigorously. Use data to improve and demonstrate value to stakeholders.</p>
      
      <h2>Step 6: Build Your Team</h2>
      <p>You can't do it alone. Surround yourself with people who complement your skills and share your values. Diverse teams create better solutions.</p>
      
      <h2>Step 7: Secure Funding</h2>
      <p>Explore multiple funding sources:</p>
      <ul>
        <li>Impact investors and venture philanthropy</li>
        <li>Grants from foundations and government</li>
        <li>Crowdfunding and community investment</li>
        <li>Revenue from operations</li>
      </ul>
      
      <h2>Common Pitfalls to Avoid</h2>
      <ul>
        <li>Falling in love with your solution instead of the problem</li>
        <li>Trying to do too much too fast</li>
        <li>Neglecting financial sustainability</li>
        <li>Not involving beneficiaries in design</li>
        <li>Giving up too soon</li>
      </ul>
      
      <h2>Resources for Learning More</h2>
      <p>Join communities like Ashoka, Echoing Green, and your local social enterprise network. Participate in competitions like the Hult Prize. Read case studies and learn from those who've walked this path before.</p>
      
      <h2>Your Journey Starts Now</h2>
      <p>The world needs more people willing to tackle tough problems with innovative solutions. Whether you're a student, professional, or retiree, it's never too early or too late to become a social entrepreneur.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop',
    author: 'James Wilson',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(50),
    likes: generateUserIds(112),
    dislikes: generateUserIds(6),
    views: 2567,
    commentCount: 0,
  },
  {
    title: 'Blockchain Beyond Cryptocurrency: Real-World Applications',
    slug: 'blockchain-beyond-cryptocurrency-applications',
    excerpt: 'Exploring how blockchain technology is solving real problems in supply chain, healthcare, voting, and more.',
    content: `
      <h2>Understanding Blockchain</h2>
      <p>At its core, blockchain is a distributed ledger technology that creates transparent, tamper-proof records. While cryptocurrency gets most of the attention, blockchain's potential extends far beyond digital money.</p>
      
      <h2>Supply Chain Transparency</h2>
      <p>Walmart uses blockchain to track food from farm to store, reducing the time to trace contamination from days to seconds. This saves lives and reduces waste.</p>
      <p>In the diamond industry, blockchain verifies that gems are conflict-free, giving consumers confidence in their purchases.</p>
      
      <h2>Healthcare Records</h2>
      <p>Blockchain can give patients control over their medical records while ensuring data integrity and privacy. Doctors can access complete, accurate patient histories, improving care quality.</p>
      
      <h2>Digital Identity</h2>
      <p>For the 1 billion people without official identification, blockchain-based digital IDs can provide access to services, banking, and legal rights. Estonia has already implemented this nationwide.</p>
      
      <h2>Voting Systems</h2>
      <p>Blockchain-based voting could increase transparency, reduce fraud, and make elections more accessible. Several countries are piloting these systems.</p>
      
      <h2>Intellectual Property</h2>
      <p>Artists and creators can use blockchain to prove ownership, track usage, and receive automatic royalty payments through smart contracts.</p>
      
      <h2>Challenges and Limitations</h2>
      <ul>
        <li><strong>Scalability:</strong> Many blockchain networks are slow and expensive</li>
        <li><strong>Energy consumption:</strong> Some consensus mechanisms use enormous amounts of electricity</li>
        <li><strong>Regulation:</strong> Legal frameworks are still evolving</li>
        <li><strong>Complexity:</strong> The technology is difficult for non-experts to understand and use</li>
      </ul>
      
      <h2>The Path Forward</h2>
      <p>As blockchain technology matures and becomes more user-friendly, we'll see increasing adoption in areas where transparency, security, and decentralization add real value. The key is focusing on problems where blockchain is the best solution, not forcing it where simpler technologies would suffice.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
    author: 'Dr. Priya Sharma',
    isPublished: false,
    isFeatured: false,
    publishedAt: null,
    likes: generateUserIds(15),
    dislikes: generateUserIds(2),
    views: 234,
    commentCount: 0,
  },
  {
    title: 'Women in Tech: Breaking Barriers and Building the Future',
    slug: 'women-in-tech-breaking-barriers',
    excerpt: 'Celebrating women leaders in technology and addressing the persistent gender gap in STEM fields.',
    content: `
      <h2>The Gender Gap in Tech</h2>
      <p>Despite making up half the population, women hold only 28% of computing jobs. This gap represents not just a fairness issue, but a massive loss of talent and perspective in one of the world's most influential industries.</p>
      
      <h2>Barriers Women Face</h2>
      <h3>Educational Pipeline</h3>
      <p>Girls are often discouraged from pursuing STEM from an early age. Stereotypes about who "belongs" in tech create a self-fulfilling prophecy.</p>
      
      <h3>Workplace Culture</h3>
      <p>Many tech companies have cultures that feel unwelcoming to women. From unconscious bias in hiring to lack of mentorship and sponsorship, women face obstacles at every career stage.</p>
      
      <h3>Work-Life Balance</h3>
      <p>The tech industry's demanding culture can be particularly challenging for women, who still shoulder most caregiving responsibilities.</p>
      
      <h2>Inspiring Women Leaders</h2>
      <p>Despite these challenges, women are making incredible contributions to technology:</p>
      <ul>
        <li><strong>Reshma Saujani</strong> founded Girls Who Code, teaching programming to hundreds of thousands of girls</li>
        <li><strong>Fei-Fei Li</strong> pioneered AI research and advocates for ethical AI development</li>
        <li><strong>Susan Wojcicki</strong> led YouTube's growth into a global platform</li>
        <li><strong>Kimberly Bryant</strong> created Black Girls CODE to increase diversity in tech</li>
      </ul>
      
      <h2>Why Diversity Matters</h2>
      <p>Diverse teams build better products. When women are involved in designing technology, we get:</p>
      <ul>
        <li>AI systems that are less biased</li>
        <li>Products that serve all users, not just male ones</li>
        <li>More innovative solutions to complex problems</li>
        <li>Better business outcomes (companies with diverse leadership are more profitable)</li>
      </ul>
      
      <h2>Creating Change</h2>
      <h3>For Organizations</h3>
      <ul>
        <li>Implement blind resume screening</li>
        <li>Set diversity targets and track progress</li>
        <li>Create mentorship and sponsorship programs</li>
        <li>Offer flexible work arrangements</li>
        <li>Address pay equity</li>
      </ul>
      
      <h3>For Individuals</h3>
      <ul>
        <li>Mentor young women interested in tech</li>
        <li>Amplify women's voices and contributions</li>
        <li>Call out bias when you see it</li>
        <li>Support women-led startups and initiatives</li>
      </ul>
      
      <h2>The Future is Female (and Male, and Non-Binary)</h2>
      <p>True progress means creating a tech industry where everyone can thrive, regardless of gender. We need all hands on deck to solve the world's biggest challenges. The future of tech must be inclusive.</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop',
    author: 'Sarah Chen',
    isPublished: false,
    isFeatured: false,
    publishedAt: null,
    likes: generateUserIds(8),
    dislikes: generateUserIds(1),
    views: 156,
    commentCount: 0,
  },
  {
    title: 'Recap: Hult Prize 2024 Campus Event - Innovation Meets Impact',
    slug: 'hult-prize-2024-campus-event-recap',
    excerpt: 'Highlights from our recent Hult Prize campus competition where student teams pitched innovative solutions to global challenges.',
    content: `
      <h2>An Incredible Day of Innovation</h2>
      <p>Last Saturday, our campus came alive with the energy of social entrepreneurship as 12 teams competed in the Hult Prize campus round. The theme this year: "Reimagining Fashion for a Sustainable Future."</p>
      
      <h2>The Winning Team: EcoThread</h2>
      <p>Congratulations to Team EcoThread for their innovative solution to textile waste! Their platform connects fashion brands with recycling facilities and creates a marketplace for upcycled materials.</p>
      
      <h3>The Pitch</h3>
      <p>EcoThread's solution addresses the 92 million tons of textile waste generated annually. By creating a digital infrastructure for textile recycling, they make it easy and profitable for brands to embrace circular fashion.</p>
      
      <h3>Business Model</h3>
      <ul>
        <li>Transaction fees on material marketplace</li>
        <li>SaaS platform for brands to track their circularity metrics</li>
        <li>Consulting services for circular fashion transformation</li>
      </ul>
      
      <h2>Other Outstanding Teams</h2>
      
      <h3>Runner-Up: FitForAll</h3>
      <p>An AI-powered sizing solution that reduces returns and waste in online fashion retail. Their technology could prevent millions of garments from ending up in landfills.</p>
      
      <h3>People's Choice: Stitch Stories</h3>
      <p>A platform connecting consumers with local tailors for clothing repairs and alterations, extending garment lifecycles while supporting local artisans.</p>
      
      <h2>Judge's Insights</h2>
      <p>Our panel of judges—including a venture capitalist, a sustainable fashion entrepreneur, and a Hult Prize alum—emphasized the importance of:</p>
      <ul>
        <li><strong>Scalability:</strong> Solutions that can grow beyond local markets</li>
        <li><strong>Measurable Impact:</strong> Clear metrics for environmental and social outcomes</li>
        <li><strong>Financial Viability:</strong> Business models that don't rely solely on grants</li>
        <li><strong>Team Dynamics:</strong> Diverse skills and genuine passion</li>
      </ul>
      
      <h2>Workshop Highlights</h2>
      <p>Before the competition, teams participated in workshops on:</p>
      <ul>
        <li>Pitch deck design and storytelling</li>
        <li>Impact measurement and social return on investment</li>
        <li>Fundraising strategies for social ventures</li>
        <li>Building sustainable business models</li>
      </ul>
      
      <h2>What's Next?</h2>
      <p>Team EcoThread will represent our campus at the regional finals in March. They'll compete against winners from 50+ other campuses for a chance to advance to the global finals and compete for the $1 million prize.</p>
      
      <h2>Thank You</h2>
      <p>Huge thanks to our sponsors, judges, mentors, and all the teams who participated. Your passion for creating positive change is inspiring. Whether you won or not, keep building, keep iterating, and keep pushing for a better world.</p>
      
      <h2>Get Involved</h2>
      <p>Interested in participating next year? Join our Hult Prize club, attend our monthly social entrepreneurship meetups, and start thinking about the problems you want to solve. The world needs your ideas!</p>
    `,
    posterImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    author: 'Rajesh Kumar',
    isPublished: true,
    isFeatured: false,
    publishedAt: getPastDate(3),
    likes: generateUserIds(203),
    dislikes: generateUserIds(4),
    views: 4892,
    commentCount: 0,
  },
];

// Comments data - will be populated after blogs are inserted
const getCommentsData = (blogIds, blogSlugs) => {
  const comments = [];

  // Helper to get a blog by slug
  const getBlogData = (slug) => {
    const index = blogSlugs.indexOf(slug);
    return index !== -1 ? { id: blogIds[index], slug: blogSlugs[index] } : null;
  };

  // Comments for "The Future of AI in Social Impact"
  const aiBlog = getBlogData('future-of-ai-social-impact');
  if (aiBlog) {
    comments.push(
      {
        blogSlug: aiBlog.slug,
        blogId: aiBlog.id,
        author: 'Amit Verma',
        content: 'Excellent article! I\'m particularly interested in the healthcare applications. We\'re working on a similar project in rural Maharashtra. Would love to connect and share insights.',
        isApproved: true,
        createdAt: getPastDate(4),
      },
      {
        blogSlug: aiBlog.slug,
        blogId: aiBlog.id,
        author: 'Lisa Thompson',
        content: 'Great overview of AI for social good. One thing I\'d add is the importance of local context - AI solutions need to be adapted to cultural and linguistic nuances to be truly effective.',
        isApproved: true,
        createdAt: getPastDate(3),
      },
      {
        blogSlug: aiBlog.slug,
        blogId: aiBlog.id,
        author: 'Carlos Rodriguez',
        content: 'The ethical considerations section is crucial. We need more discussion about algorithmic bias and data privacy in social impact applications. Thanks for highlighting this!',
        isApproved: true,
        createdAt: getPastDate(2),
      },
      {
        blogSlug: aiBlog.slug,
        blogId: aiBlog.id,
        author: 'Fatima Hassan',
        content: 'As someone working in agriculture tech in Kenya, I can confirm the impact AI is having. Farmers are seeing real results. The challenge now is scaling these solutions sustainably.',
        isApproved: true,
        createdAt: getPastDate(1),
      }
    );
  }

  // Comments for "Building Sustainable Startups"
  const startupBlog = getBlogData('sustainable-startups-hult-prize-lessons');
  if (startupBlog) {
    comments.push(
      {
        blogSlug: startupBlog.slug,
        blogId: startupBlog.id,
        author: 'Jennifer Lee',
        content: 'This is exactly what I needed to read! Our team is preparing for this year\'s Hult Prize and the "design for scalability" point really resonates. Going to revisit our business model.',
        isApproved: true,
        createdAt: getPastDate(10),
      },
      {
        blogSlug: startupBlog.slug,
        blogId: startupBlog.id,
        author: 'Mohammed Al-Rashid',
        content: 'The emphasis on measuring impact is so important. Investors want to see data, not just good intentions. We learned this the hard way in our first funding round.',
        isApproved: true,
        createdAt: getPastDate(9),
      },
      {
        blogSlug: startupBlog.slug,
        blogId: startupBlog.id,
        author: 'Sophie Martin',
        content: 'Love the quote about not just helping one village. That mindset shift from project to platform is what separates successful social enterprises from well-meaning but limited initiatives.',
        isApproved: true,
        createdAt: getPastDate(8),
      },
      {
        blogSlug: startupBlog.slug,
        blogId: startupBlog.id,
        author: 'David Kim',
        content: 'Could you elaborate more on the diverse team composition? What specific skills should a Hult Prize team have?',
        isApproved: true,
        createdAt: getPastDate(7),
      },
      {
        blogSlug: startupBlog.slug,
        blogId: startupBlog.id,
        author: 'Priya Nair',
        content: 'The "embrace failure" point is underrated. Our team pivoted three times before finding our winning idea. Persistence and learning from mistakes is key!',
        isApproved: true,
        createdAt: getPastDate(6),
      }
    );
  }

  // Comments for "Circular Economy"
  const circularBlog = getBlogData('circular-economy-zero-waste-business');
  if (circularBlog) {
    comments.push(
      {
        blogSlug: circularBlog.slug,
        blogId: circularBlog.id,
        author: 'Emma Wilson',
        content: 'The coffee grounds furniture example is fascinating! Do you have more information about that company? I\'d love to learn more about their process.',
        isApproved: true,
        createdAt: getPastDate(18),
      },
      {
        blogSlug: circularBlog.slug,
        blogId: circularBlog.id,
        author: 'Raj Patel',
        content: 'We\'re implementing circular principles in our manufacturing business. The initial investment is significant, but the long-term savings and brand benefits are worth it.',
        isApproved: true,
        createdAt: getPastDate(16),
      },
      {
        blogSlug: circularBlog.slug,
        blogId: circularBlog.id,
        author: 'Nina Kowalski',
        content: 'Great article! I\'d add that consumer education is crucial. People need to understand the value of circular products and be willing to participate in take-back programs.',
        isApproved: true,
        createdAt: getPastDate(15),
      }
    );
  }

  // Comments for "Fintech for Financial Inclusion"
  const fintechBlog = getBlogData('fintech-financial-inclusion-unbanked');
  if (fintechBlog) {
    comments.push(
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'James Ochieng',
        content: 'M-Pesa truly transformed Kenya. I remember when my mother had to travel hours to send money to family. Now it takes seconds from her phone. This is real impact.',
        isApproved: true,
        createdAt: getPastDate(26),
      },
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'Ana Silva',
        content: 'The alternative credit scoring is a game-changer. Traditional banks rejected my loan application, but a fintech lender approved me based on my payment history. Now my business is thriving!',
        isApproved: true,
        createdAt: getPastDate(25),
      },
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'Robert Chen',
        content: 'Important to note the regulatory challenges. Many countries are struggling to balance innovation with consumer protection. We need smart regulation, not just more regulation.',
        isApproved: true,
        createdAt: getPastDate(24),
      },
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'Zainab Ahmed',
        content: 'Maria\'s story is inspiring! These aren\'t just statistics - they\'re real people whose lives are being transformed. That\'s what motivates me to work in this space.',
        isApproved: true,
        createdAt: getPastDate(23),
      },
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'Marcus Johnson',
        content: 'The blockchain for remittances section is spot on. My family sends money to Nigeria and the fees from traditional services are outrageous. Crypto is a real solution here.',
        isApproved: true,
        createdAt: getPastDate(22),
      },
      {
        blogSlug: fintechBlog.slug,
        blogId: fintechBlog.id,
        author: 'Lakshmi Reddy',
        content: 'Digital literacy is the biggest barrier in rural India. We need to invest in education alongside technology deployment. Otherwise, we risk creating a new form of exclusion.',
        isApproved: true,
        createdAt: getPastDate(21),
      }
    );
  }

  // Comments for "Climate Tech Innovations"
  const climateBlog = getBlogData('climate-tech-innovations-warming-planet');
  if (climateBlog) {
    comments.push(
      {
        blogSlug: climateBlog.slug,
        blogId: climateBlog.id,
        author: 'Thomas Anderson',
        content: 'The scale of investment in climate tech is encouraging, but we need to move faster. The climate crisis won\'t wait for perfect solutions - we need to deploy what works now.',
        isApproved: true,
        createdAt: getPastDate(33),
      },
      {
        blogSlug: climateBlog.slug,
        blogId: climateBlog.id,
        author: 'Isabella Rossi',
        content: 'I\'m working on a vertical farming startup and can confirm the potential. We use 95% less water than traditional farming and can grow year-round. The future of food is vertical!',
        isApproved: true,
        createdAt: getPastDate(32),
      },
      {
        blogSlug: climateBlog.slug,
        blogId: climateBlog.id,
        author: 'Kwame Mensah',
        content: 'Great overview! I\'d love to see more discussion about climate solutions designed FOR and BY the Global South. We\'re on the frontlines of climate change but often excluded from solution design.',
        isApproved: true,
        createdAt: getPastDate(31),
      },
      {
        blogSlug: climateBlog.slug,
        blogId: climateBlog.id,
        author: 'Yuki Tanaka',
        content: 'The green hydrogen section is interesting. Japan is investing heavily in this. The challenge is building the infrastructure for production, storage, and distribution at scale.',
        isApproved: true,
        createdAt: getPastDate(30),
      },
      {
        blogSlug: climateBlog.slug,
        blogId: climateBlog.id,
        author: 'Maria Gonzalez',
        content: 'Carbon-negative concrete is fascinating! Construction is such a huge emissions source. If we can make building materials part of the climate solution, that\'s a massive win.',
        isApproved: true,
        createdAt: getPastDate(29),
      }
    );
  }

  // Comments for "EdTech Revolution"
  const edtechBlog = getBlogData('edtech-revolution-democratizing-education');
  if (edtechBlog) {
    comments.push(
      {
        blogSlug: edtechBlog.slug,
        blogId: edtechBlog.id,
        author: 'Hassan Ibrahim',
        content: 'Ahmed\'s story resonates with me. I\'m also a refugee who learned coding online. Education truly is the great equalizer when it\'s accessible to everyone.',
        isApproved: true,
        createdAt: getPastDate(40),
      },
      {
        blogSlug: edtechBlog.slug,
        blogId: edtechBlog.id,
        author: 'Rachel Green',
        content: 'As a teacher, I see both the promise and challenges of EdTech. Technology is a tool, not a replacement for good teaching. We need to focus on pedagogy, not just platforms.',
        isApproved: true,
        createdAt: getPastDate(39),
      },
      {
        blogSlug: edtechBlog.slug,
        blogId: edtechBlog.id,
        author: 'Vikram Singh',
        content: 'The completion rate issue is real. I\'ve started dozens of online courses but finished only a few. We need better mechanisms for accountability and community support.',
        isApproved: true,
        createdAt: getPastDate(38),
      },
      {
        blogSlug: edtechBlog.slug,
        blogId: edtechBlog.id,
        author: 'Sophie Dubois',
        content: 'VR for education is incredible! I used a VR chemistry lab and finally understood concepts I struggled with for years. Experiential learning is so much more effective than lectures.',
        isApproved: true,
        createdAt: getPastDate(37),
      }
    );
  }

  // Comments for "Social Entrepreneurship 101"
  const seBlog = getBlogData('social-entrepreneurship-101-getting-started');
  if (seBlog) {
    comments.push(
      {
        blogSlug: seBlog.slug,
        blogId: seBlog.id,
        author: 'Alex Turner',
        content: 'This is the guide I wish I had when I started! The "listen more than you talk" advice is gold. So many social ventures fail because they don\'t truly understand their beneficiaries.',
        isApproved: true,
        createdAt: getPastDate(48),
      },
      {
        blogSlug: seBlog.slug,
        blogId: seBlog.id,
        author: 'Nadia Osman',
        content: 'The business model section is crucial. I\'ve seen too many great ideas fail because they couldn\'t figure out sustainability. Impact + sustainability = lasting change.',
        isApproved: true,
        createdAt: getPastDate(47),
      },
      {
        blogSlug: seBlog.slug,
        blogId: seBlog.id,
        author: 'Chris Martinez',
        content: 'Bookmarking this for my students! I teach social entrepreneurship and this is a perfect overview. Clear, practical, and inspiring. Thank you!',
        isApproved: true,
        createdAt: getPastDate(46),
      },
      {
        blogSlug: seBlog.slug,
        blogId: seBlog.id,
        author: 'Kenji Yamamoto',
        content: 'The common pitfalls section is spot on. I fell in love with my solution and ignored feedback. Had to pivot completely. Ego is the enemy of good social entrepreneurship.',
        isApproved: true,
        createdAt: getPastDate(45),
      },
      {
        blogSlug: seBlog.slug,
        blogId: seBlog.id,
        author: 'Olivia Brown',
        content: 'Question: How do you balance the social mission with the need to generate revenue? Sometimes these seem to be in tension. Any advice?',
        isApproved: true,
        createdAt: getPastDate(44),
      }
    );
  }

  // Comments for "Hult Prize 2024 Campus Event Recap"
  const hultBlog = getBlogData('hult-prize-2024-campus-event-recap');
  if (hultBlog) {
    comments.push(
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Team EcoThread',
        content: 'Thank you for this amazing recap! We\'re so grateful for the opportunity and excited to represent our campus at regionals. The competition and workshops were invaluable. 🙏',
        isApproved: true,
        createdAt: getPastDate(2),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Sarah Kim',
        content: 'Congratulations to all the teams! The energy that day was incredible. Even though we didn\'t win, we learned so much and made great connections. Already working on our idea for next year!',
        isApproved: true,
        createdAt: getPastDate(2),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Professor Anderson',
        content: 'So proud of all our students! The quality of ideas and presentations was outstanding. This is the future of business - purpose-driven and innovative. Keep pushing boundaries!',
        isApproved: true,
        createdAt: getPastDate(2),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Maya Patel',
        content: 'I was on Team FitForAll. Huge congrats to EcoThread - they absolutely deserved the win! The judges\' feedback was so valuable. We\'re going to iterate and come back stronger.',
        isApproved: true,
        createdAt: getPastDate(1),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'John Davis',
        content: 'Attended as a spectator and was blown away by the talent. These students are solving real problems with innovative solutions. The future is in good hands!',
        isApproved: true,
        createdAt: getPastDate(1),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Lisa Wang',
        content: 'The workshop on impact measurement was eye-opening. I never realized how important it is to quantify social outcomes. This will help us in all our future projects, not just Hult Prize.',
        isApproved: true,
        createdAt: getPastDate(1),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Ahmed Hassan',
        content: 'When are applications opening for next year? I\'m a freshman and want to start preparing now. This event inspired me to pursue social entrepreneurship!',
        isApproved: true,
        createdAt: getPastDate(0),
      },
      {
        blogSlug: hultBlog.slug,
        blogId: hultBlog.id,
        author: 'Emily Rodriguez',
        content: 'Shoutout to the organizers for putting together such a professional event! The venue, the judges, the workshops - everything was top-notch. Can\'t wait for next year!',
        isApproved: true,
        createdAt: getPastDate(0),
      }
    );
  }

  return comments;
};

// Main seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting blog seed script...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Comment.deleteMany({});
    console.log('   ✓ Deleted all comments');
    await Blog.deleteMany({});
    console.log('   ✓ Deleted all blogs\n');

    // Insert blogs
    console.log('📝 Seeding blog posts...');
    const insertedBlogs = await Blog.insertMany(blogsData);
    console.log(`   ✓ Created ${insertedBlogs.length} blog posts\n`);

    // Extract blog IDs and slugs for comment references
    const blogIds = insertedBlogs.map(blog => blog._id);
    const blogSlugs = insertedBlogs.map(blog => blog.slug);

    // Generate and insert comments
    console.log('💬 Seeding comments...');
    const commentsData = getCommentsData(blogIds, blogSlugs);
    const insertedComments = await Comment.insertMany(commentsData);
    console.log(`   ✓ Created ${insertedComments.length} comments\n`);

    // Update comment counts on blogs
    console.log('🔄 Updating comment counts...');
    for (const blog of insertedBlogs) {
      const commentCount = commentsData.filter(c => c.blogSlug === blog.slug).length;
      await Blog.updateOne({ _id: blog._id }, { commentCount });
    }
    console.log('   ✓ Updated comment counts\n');

    // Summary
    console.log('✅ Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Blogs created: ${insertedBlogs.length}`);
    console.log(`   • Published blogs: ${insertedBlogs.filter(b => b.isPublished).length}`);
    console.log(`   • Draft blogs: ${insertedBlogs.filter(b => !b.isPublished).length}`);
    console.log(`   • Featured blogs: ${insertedBlogs.filter(b => b.isFeatured).length}`);
    console.log(`   • Comments created: ${insertedComments.length}`);
    console.log(`   • Total views: ${insertedBlogs.reduce((sum, b) => sum + b.views, 0)}`);
    console.log(`   • Total likes: ${insertedBlogs.reduce((sum, b) => sum + b.likes.length, 0)}\n`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
