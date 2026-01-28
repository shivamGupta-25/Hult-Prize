// MagazineData.jsx

const magazineData = {
  hero: {
    title: "Praxeis",
    tagline: "The Panorama of Change",
    organization: "Hult Prize - Hansraj College",
    description: "Praxeis is the annual magazine of Hult Prize - Hansraj College, showcasing innovative ideas and stories that drive social impact and entrepreneurship.",
  },

  editions: [
    {
      id: "2025-edition",
      title: "Praxeis | 2025",
      volume: "issue 2",
      year: 2025,
      theme: "Innovation at the Intersection: Technology, Sustainability, and Social Impact",
      isCurrent: true,

      about: {
        description: "A magazine exploring the convergence of technology, sustainability, and social entrepreneurship in creating scalable solutions for global challenges.",
        focusAreas: [
          "Technology & Innovation",
          "Climate Action",
          "Impact Investing",
          "Social Equity",
        ],
      },

      people: {
        editors: [
          { name: "TBD", role: "Editor-in-Chief" },
          { name: "TBD", role: "Editor-in-Chief" },
        ],
        contributors: [
          // To be announced
        ],
      },

      assets: {
        coverImage: "/MagazinePoster/profile pic.jpg",
        downloadLink: "/MagazinePDF/2025-edition.pdf",
      },
    },
    {
      id: "2024-edition",
      title: "Praxeis | 2024",
      volume: "issue 1",
      year: 2024,
      theme: "Frontiers in Social Entrepreneurship: Catalysing Systemic Change through Sustainable Business Models",
      isCurrent: false,

      about: {
        description: "A magazine featuring social entrepreneurship and systemic change through sustainable business models.",
        focusAreas: [
          "Social Entrepreneurship",
          "Sustainable Business Models",
          "Systemic Change",
        ],
      },

      people: {
        editors: [
          { name: "Shivam Raj Gupta", role: "Editor-in-Chief" },
          { name: "Vartika Verma", role: "Editor-in-Chief" },
          { name: "Vishnupriya Saxena", role: "Editor-in-Chief" },
          { name: "Tanya", role: "Editor-in-Chief" },
        ],
        contributors: [
          "Garv Jain",
          "Ruby",
          "Harsh Kumar",
          "Sushrut Bhadani",
          "Tanish Sharma",
          "Arti Kumari",
          "Aditi Rawat",
          "Tuba Khan",
          "Vaibhav",
          "Yash Gupta",
          "Merryl Biju",
          "Shashwat Sharda",
          "Ankit",
          "Kumari Janawi",
          "Sania Khan",
          "Adhya Manocha",
          "Aryaman Pranav",
          "Aditya Khariwal",
          "Ayushman Dubey",
          "Kavya Bhatia",
          "Khushi Satwani",
          "Krish Grover",
          "Mahak Poswal",
          "Ridham Singla",
          "Sanya Jain",
        ],
      },
      assets: {
        coverImage: "/MagazinePoster/2024-edition.png",
        downloadLink: "/MagazinePDF/2024-edition.pdf",
      },
    },
  ],
};

export default magazineData;