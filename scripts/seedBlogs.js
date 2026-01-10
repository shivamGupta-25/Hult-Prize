import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

// Import models
import Blog from '../src/models/Blog.js';
import Comment from '../src/models/Comment.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Data for seeding
const blogs = [
  {
    title: 'The Future of Sustainable Tech in 2026',
    excerpt: 'Exploring how green technology is reshaping industries and our daily lives.',
    content: `
      <h2>The Green Revolution</h2>
      <p>As we step into 2026, the focus on sustainable technology has never been sharper. From biodegradable electronics to AI-optimized energy grids, the world is witnessing a paradigm shift.</p>
      <h3>Renewable Energy Integration</h3>
      <p>Solar and wind technologies have become more efficient and less intrusive. New transparent solar panels are turning skyscrapers into power plants.</p>
      <h3>Circular Economy</h3>
      <p>Tech giants are now designing products with 100% recyclability in mind. The "right to repair" movement has gained massive traction, forcing manufacturers to make modular devices.</p>
    `,
    author: 'Elena Rodriguez',
    isPublished: true,
    isFeatured: true,
    tags: ['sustainability', 'tech', 'future', 'green-energy'],
    views: 1250,
    posterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Mastering Remote Leadership',
    excerpt: 'Key strategies for managing distributed teams effectively in the modern era.',
    content: `
      <h2>Leadership Beyond Borders</h2>
      <p>Remote work is no longer a perk; it's a standard. But leading a team you rarely see in person requires a new set of skills.</p>
      <h3>Communication is Key</h3>
      <p>Over-communication is better than silence. Utilizing async tools effectively ensures that no one is left out of the loop, regardless of their time zone.</p>
      <h3>Trust and Autonomy</h3>
      <p>Micromanagement is the death of remote productivity. successful leaders build trust and focus on outcomes rather than hours logged.</p>
    `,
    author: 'David Chen',
    isPublished: true,
    isFeatured: false,
    tags: ['leadership', 'remote-work', 'management', 'business'],
    views: 890,
    posterImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Culinary Travels: Hidden Gems of Asia',
    excerpt: 'A journey through the street food markets of Vietnam, Thailand, and Japan.',
    content: `
      <h2>Taste the Culture</h2>
      <p>Food is the universal language. Traveling through Asia offers a sensory explosion that is unmatched anywhere else in the world.</p>
      <h3>Hanoi's Pho</h3>
      <p>Nothing beats a steaming bowl of Pho on a chilly morning in Hanoi. The broth, simmered for hours, tells a story of tradition.</p>
      <h3>Osaka's Takoyaki</h3>
      <p>Watching street vendors flip these octopus balls with lightning speed is mesmerizing. The taste? Absolute perfection.</p>
    `,
    author: 'Sarah Jenkins',
    isPublished: true,
    isFeatured: true,
    tags: ['travel', 'food', 'asia', 'culture'],
    views: 3400,
    posterImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'The Art of Mindfulness',
    excerpt: 'Practical tips for maintaining mental clarity in a chaotic world.',
    content: `
      <h2>Pause and Breathe</h2>
      <p>In our hyper-connected world, finding silence is a luxury. Mindfulness isn't just about meditation; it's about being present.</p>
      <h3>Daily Habits</h3>
      <p>Start your day with five minutes of no phone time. Drink your coffee slowly. Notice the texture of your clothes. These small acts ground you.</p>
    `,
    author: 'Marcus Aurelius (Modern)',
    isPublished: true,
    isFeatured: false,
    tags: ['mindfulness', 'health', 'wellness', 'self-care'],
    views: 560,
    posterImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Understanding Quantum Computing',
    excerpt: 'A beginner-friendly guide to the concepts behind the next big leap in computing.',
    content: `
      <h2>Beyond Binary</h2>
      <p>Classical computers use bits (0 or 1). Quantum computers use qubits, which can be both 0 and 1 simultaneously.</p>
      <h3>Superposition and Entanglement</h3>
      <p>These core principles allow quantum computers to solve complex problems in seconds that would take supercomputers thousands of years.</p>
    `,
    author: 'Dr. Emily Carter',
    isPublished: true,
    isFeatured: true,
    tags: ['science', 'quantum', 'technology', 'education'],
    views: 5000,
    posterImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Top 10 Hiking Trails in Europe',
    excerpt: 'Discover the most breathtaking views the European continent has to offer.',
    content: `
      <h2>The Great Outdoors</h2>
      <p>Europe's diverse landscape offers something for every hiker, from the Alps to the Mediterranean coast.</p>
      <h3>Tour du Mont Blanc</h3>
      <p>Passing through France, Italy, and Switzerland, this trail offers unrivaled views of the highest peak in the Alps.</p>
    `,
    author: 'Lars Jensen',
    isPublished: true,
    isFeatured: false,
    tags: ['travel', 'hiking', 'nature', 'europe'],
    views: 2100,
    posterImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Minimalist Living: Less is More',
    excerpt: 'How decluttering your physical space can lead to mental freedom.',
    content: `
      <h2>The Clutter Trap</h2>
      <p>We often define ourselves by our possessions. But do we own our things, or do they own us?</p>
      <h3>Steps to Minimalism</h3>
      <p>Start small. Clear one drawer. Ask yourself: "Does this spark joy?" or "Usefulness?" If not, let it go.</p>
    `,
    author: 'Yuki Tanaka',
    isPublished: true,
    isFeatured: false,
    tags: ['lifestyle', 'minimalism', 'organization'],
    views: 1800,
    posterImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'The Rise of E-Sports',
    excerpt: 'From basement tournaments to billion-dollar stadiums.',
    content: `
      <h2>Digital Athletes</h2>
      <p>E-sports requires reflexes, strategy, and teamwork comparable to traditional sports. It's time they get the same recognition.</p>
      <h3>Global Phenomenon</h3>
      <p>Events like "Worlds" draw more viewers than the Super Bowl. The industry is booming, and opportunities are endless.</p>
    `,
    author: 'Alex "ProGamer" Smith',
    isPublished: true,
    isFeatured: true,
    tags: ['gaming', 'esports', 'technology', 'entertainment'],
    views: 7500,
    posterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'DIY Home Decor on a Budget',
    excerpt: 'Transform your living space without breaking the bank.',
    content: `
      <h2>Creativity Over Cash</h2>
      <p>You don't need designer furniture to have a stylish home. A little paint and imagination go a long way.</p>
      <h3>Upcycling</h3>
      <p>Turn old crates into shelves. Reupholster that thrift store chair. The possibilities are limited only by your creativity.</p>
    `,
    author: 'Maria Garcia',
    isPublished: true,
    isFeatured: false,
    tags: ['diy', 'home-decor', 'lifestyle', 'budget'],
    views: 1500,
    posterImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'The Secret History of Coffee',
    excerpt: 'Tracing the origins of the world\'s favorite morning beverage.',
    content: `
      <h2>From Ethiopia to Starbucks</h2>
      <p>Legend has it that a goat herder named Kaldi discovered coffee when his goats became energetic after eating the berries.</p>
      <h3>The Coffee Houses</h3>
      <p>In the 17th century, coffee houses in London were known as "penny universities" where ideas were exchanged for the price of a cup.</p>
    `,
    author: 'James Brewster',
    isPublished: true,
    isFeatured: false,
    tags: ['history', 'coffee', 'food', 'culture'],
    views: 2200,
    posterImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Draft Blog: Upcoming Tech',
    excerpt: 'Notes on what is coming next year.',
    content: '<p>This is a draft post.</p>',
    author: 'Tech Insider',
    isPublished: false,
    isFeatured: false,
    tags: ['draft', 'tech'],
    views: 0,
    posterImage: '',
  }
];

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const blogsWithSlugs = blogs.map(blog => ({
  ...blog,
  slug: generateSlug(blog.title)
}));

// Migration Logic
const migrateDB = async () => {
  console.log('🔄 Starting migration: Unsetting likeCount field from all blogs...');
  const result = await Blog.updateMany(
    {},
    { $unset: { likeCount: "" } }
  );
  console.log(`✅ Migration complete. Matched ${result.matchedCount} documents, modified ${result.modifiedCount} documents.`);
};

// Seed Logic
const seedDB = async () => {
  console.log('🧹 Clearing existing data...');
  await Blog.deleteMany({});
  await Comment.deleteMany({});
  console.log('✅ Data cleared');

  console.log('📝 Seeding blogs...');

  // Add fake likes to blogs
  const blogsWithLikes = blogsWithSlugs.map(blog => {
    // Generate a random number of likes between 10 and 100 for each blog
    const numLikes = Math.floor(Math.random() * 90) + 10;
    const likes = Array.from({ length: numLikes }, () => `user_${Math.random().toString(36).substring(7)}`);
    return {
      ...blog,
      likes
    };
  });

  const createdBlogs = await Blog.insertMany(blogsWithLikes);
  console.log(`✅ Inserted ${createdBlogs.length} blogs`);

  console.log('💬 Seeding comments...');
  const comments = [];
  for (const blog of createdBlogs) {
    if (!blog.isPublished) continue;

    // Add random comments to published blogs
    const numComments = Math.floor(Math.random() * 5); // 0-4 comments
    for (let i = 0; i < numComments; i++) {
      comments.push({
        blogSlug: blog.slug,
        blogId: blog._id,
        author: `User${Math.floor(Math.random() * 1000)}`,
        content: `Great post! I really enjoyed reading about ${blog.title}.`,
        isApproved: true
      });
    }
  }

  if (comments.length > 0) {
    await Comment.insertMany(comments);
    console.log(`✅ Inserted ${comments.length} comments`);

    // Update comment counts on blogs
    for (const blog of createdBlogs) {
      const count = comments.filter(c => c.blogId.toString() === blog._id.toString()).length;
      if (count > 0) {
        await Blog.findByIdAndUpdate(blog._id, { commentCount: count });
      }
    }
    console.log('✅ Updated blog comment counts');
  }
  console.log('✨ Seeding completed successfully!');
};

// Main Execution
const main = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const args = process.argv.slice(2);

    if (args.includes('--migrate')) {
      await migrateDB();
    } else {
      // Default behavior: Seed (which wipes data)
      await seedDB();
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Operation failed:', err);
    process.exit(1);
  }
};

main();
