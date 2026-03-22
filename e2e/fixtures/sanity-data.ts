// Mock Sanity API data for Playwright tests

export const mockBioText = {
  _id: 'bio-1',
  label: 'bio',
  content: [
    {
      _type: 'block',
      _key: 'bio-block-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'bio-span-1',
          text: 'I am a computer science and economics student at Purdue University with a passion for building innovative software solutions.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
};

export const mockAboutText = {
  _id: 'about-1',
  label: 'about',
  content: [
    {
      _type: 'block',
      _key: 'about-block-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'about-span-1',
          text: 'I am passionate about technology and its ability to solve real-world problems. My journey in computer science started early and has led me to work on diverse projects.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
};

export const mockExperienceText = {
  _id: 'exp-text-1',
  label: 'experience',
  content: [
    {
      _type: 'block',
      _key: 'exp-text-block-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'exp-text-span-1',
          text: 'Here is a summary of my professional journey and experiences so far.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
};

export const mockContactText = {
  _id: 'contact-1',
  label: 'more',
  content: [
    {
      _type: 'block',
      _key: 'contact-block-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'contact-span-1',
          text: 'Feel free to reach out to me for any inquiries or collaborations.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
};

export const mockGithubLink = {
  _id: 'github-1',
  label: 'githubLink',
  content: 'https://github.com/prajwalshah19',
};

export const mockLinkedinLink = {
  _id: 'linkedin-1',
  label: 'linkedinLink',
  content: 'https://linkedin.com/in/prajwalshah',
};

export const mockExperiences = [
  {
    _id: 'exp-1',
    dateRange: 'Jun 2024 - Aug 2024',
    date: '2024-06-01',
    company: 'Tech Corp',
    position: 'Software Engineering Intern',
    location: 'San Francisco, CA',
    description: [
      {
        _type: 'block',
        _key: 'exp1-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'exp1-span',
            text: 'Developed full-stack web applications using React and Node.js.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'exp-2',
    dateRange: 'Jan 2024 - May 2024',
    date: '2024-01-01',
    company: 'Data Solutions Inc',
    position: 'Data Science Intern',
    location: 'New York, NY',
    description: [
      {
        _type: 'block',
        _key: 'exp2-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'exp2-span',
            text: 'Built machine learning pipelines for predictive analytics.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: 'exp-3',
    dateRange: 'Aug 2023 - Dec 2023',
    date: '2023-08-01',
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    location: 'Remote',
    description: [
      {
        _type: 'block',
        _key: 'exp3-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'exp3-span',
            text: 'Designed and implemented responsive UI components.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
];

export const mockProjects = [
  {
    _id: 'proj-1',
    name: 'Portfolio Website',
    link: 'https://github.com/prajwalshah19/portfolio',
    description: [
      {
        _type: 'block',
        _key: 'proj1-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj1-span',
            text: 'A personal portfolio website built with React and Tailwind CSS.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Jan 2024 - Present',
    date: '2024-01-15',
    tags: ['React', 'Tailwind', 'TypeScript'],
    content: '# Portfolio Website\n\nThis is my personal portfolio website built with modern web technologies.\n\n## Features\n- Responsive design\n- Dark mode support\n- CMS integration',
  },
  {
    _id: 'proj-2',
    name: 'ML Pipeline',
    link: 'https://github.com/prajwalshah19/ml-pipeline',
    description: [
      {
        _type: 'block',
        _key: 'proj2-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj2-span',
            text: 'An end-to-end machine learning pipeline for data processing.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Sep 2023 - Dec 2023',
    date: '2023-09-01',
    tags: ['Python', 'TensorFlow', 'AWS'],
    content: '# ML Pipeline\n\nA scalable machine learning pipeline.\n\n## Architecture\n- Data ingestion\n- Model training\n- Deployment',
  },
  {
    _id: 'proj-3',
    name: 'Task Manager App',
    link: 'https://github.com/prajwalshah19/task-manager',
    description: [
      {
        _type: 'block',
        _key: 'proj3-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj3-span',
            text: 'A full-stack task management application with real-time updates.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Jun 2023 - Aug 2023',
    date: '2023-06-01',
    tags: ['Node.js', 'MongoDB', 'Socket.io'],
    content: '# Task Manager\n\nA collaborative task management tool.\n\n## Features\n- Real-time sync\n- Team collaboration',
  },
  {
    _id: 'proj-4',
    name: 'E-Commerce Platform',
    link: 'https://github.com/prajwalshah19/ecommerce',
    description: [
      {
        _type: 'block',
        _key: 'proj4-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj4-span',
            text: 'A modern e-commerce platform with payment integration.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Mar 2023 - May 2023',
    date: '2023-03-01',
    tags: ['React', 'Stripe', 'PostgreSQL'],
    content: '# E-Commerce Platform\n\nA full-featured online store.\n\n## Stack\n- React frontend\n- Express backend\n- Stripe payments',
  },
  {
    _id: 'proj-5',
    name: 'Chat Application',
    link: 'https://github.com/prajwalshah19/chat-app',
    description: [
      {
        _type: 'block',
        _key: 'proj5-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj5-span',
            text: 'A real-time chat application with WebSocket support.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Jan 2023 - Feb 2023',
    date: '2023-01-01',
    tags: ['WebSocket', 'React', 'Redis'],
    content: '# Chat Application\n\nA real-time messaging platform.\n\n## Features\n- Direct messaging\n- Group chats\n- File sharing',
  },
  {
    _id: 'proj-6',
    name: 'Weather Dashboard',
    link: 'https://github.com/prajwalshah19/weather',
    description: [
      {
        _type: 'block',
        _key: 'proj6-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'proj6-span',
            text: 'A weather dashboard with location-based forecasts.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    dates: 'Nov 2022 - Dec 2022',
    date: '2022-11-01',
    tags: ['JavaScript', 'API', 'CSS'],
    content: '# Weather Dashboard\n\nA clean weather visualization tool.\n\n## Features\n- 7-day forecast\n- Location search\n- Interactive maps',
  },
];

export const mockArticles = [
  {
    _id: 'art-1',
    title: 'Getting Started with React',
    excerpt: [
      {
        _type: 'block',
        _key: 'art1-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art1-span',
            text: 'A comprehensive guide to building your first React application from scratch.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2024-03-01',
    link: '',
    content: '# Getting Started with React\n\nReact is a powerful library for building user interfaces.\n\n## Setup\n1. Install Node.js\n2. Create React App\n3. Start building!',
  },
  {
    _id: 'art-2',
    title: 'Understanding TypeScript',
    excerpt: [
      {
        _type: 'block',
        _key: 'art2-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art2-span',
            text: 'Why TypeScript is essential for modern web development projects.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2024-02-15',
    link: '',
    content: '# Understanding TypeScript\n\nTypeScript adds type safety to JavaScript.\n\n## Benefits\n- Catch errors early\n- Better IDE support\n- Improved maintainability',
  },
  {
    _id: 'art-3',
    title: 'The Future of AI',
    excerpt: [
      {
        _type: 'block',
        _key: 'art3-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art3-span',
            text: 'Exploring the latest trends and possibilities in artificial intelligence.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2024-01-20',
    link: '',
    content: '# The Future of AI\n\nAI is transforming every industry.\n\n## Key Trends\n- Large language models\n- Computer vision\n- Autonomous systems',
  },
  {
    _id: 'art-4',
    title: 'Web Performance Tips',
    excerpt: [
      {
        _type: 'block',
        _key: 'art4-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art4-span',
            text: 'Practical tips for optimizing your web application performance.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2023-12-10',
    link: '',
    content: '# Web Performance Tips\n\nSpeed matters for user experience.\n\n## Tips\n- Lazy loading\n- Code splitting\n- Image optimization',
  },
  {
    _id: 'art-5',
    title: 'Learning Rust',
    excerpt: [
      {
        _type: 'block',
        _key: 'art5-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art5-span',
            text: 'My experience learning Rust and why systems programming matters.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2023-11-05',
    link: '',
    content: '# Learning Rust\n\nRust is a systems programming language focused on safety.\n\n## Why Rust\n- Memory safety\n- Zero-cost abstractions\n- Great tooling',
  },
  {
    _id: 'art-6',
    title: 'Database Design Patterns',
    excerpt: [
      {
        _type: 'block',
        _key: 'art6-block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'art6-span',
            text: 'Common database design patterns for scalable applications.',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    date: '2023-10-01',
    link: '',
    content: '# Database Design Patterns\n\nGood database design is crucial.\n\n## Patterns\n- Normalization\n- Indexing strategies\n- Sharding',
  },
];
