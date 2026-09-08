export interface Book {
  title: string;
  author: string;
}
export interface BookCategory {
  title: string;
  books: Book[];
}

export const bookCategories: BookCategory[] = [
  {
    "title": "Power & Influence",
    "books": [
      {
        "title": "The 48 Laws of Power",
        "author": "Robert Greene"
      },
      {
        "title": "The Art of Seduction",
        "author": "Robert Greene"
      },
      {
        "title": "The Laws of Human Nature",
        "author": "Robert Greene"
      },
      {
        "title": "Surrounded by Idiots",
        "author": "Thomas Erikson"
      }
    ]
  },
  {
    "title": "Mastery & Focus",
    "books": [
      {
        "title": "Mastery",
        "author": "Robert Greene"
      },
      {
        "title": "Deep Work",
        "author": "Cal Newport"
      },
      {
        "title": "Limitless",
        "author": "Jim Kwik"
      }
    ]
  },
  {
    "title": "Discipline & Grit",
    "books": [
      {
        "title": "No Excuses",
        "author": "Brian Tracy"
      },
      {
        "title": "Can't Hurt Me",
        "author": "David Goggins"
      },
      {
        "title": "Unfuck Yourself",
        "author": "Gary John Bishop"
      }
    ]
  },
  {
    "title": "Meaning & Mind",
    "books": [
      {
        "title": "Man's Search for Meaning",
        "author": "Viktor E. Frankl"
      },
      {
        "title": "The Power of Your Subconscious Mind",
        "author": "Joseph Murphy"
      }
    ]
  },
  {
    "title": "Habits & Systems",
    "books": [
      {
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey"
      }
    ]
  },
  {
    "title": "Attention & Dopamine",
    "books": [
      {
        "title": "Dopamine Detox",
        "author": "Thibaut Meurisse"
      },
      {
        "title": "Digital Minimalism",
        "author": "Cal Newport"
      }
    ]
  },
  {
    "title": "Creativity",
    "books": [
      {
        "title": "Steal Like an Artist",
        "author": "Austin Kleon"
      }
    ]
  },
  {
    "title": "Big Ideas",
    "books": [
      {
        "title": "This Explains Everything",
        "author": "John Brockman"
      }
    ]
  }
];
