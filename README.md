# CodeInsights_GitHub
CodeInsights assistant that helps developers understand an unfamiliar GitHub codebase by combining static code analysis with Retrieval-Augmented Generation.

CodeInsights_GitHub/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/                  # FastAPI routes
│   │   ├── core/                 # Config, logging, settings
│   │   ├── repository/           # Phase 1
│   │   ├── parser/               # Phase 2
│   │   ├── chunking/             # Phase 3
│   │   ├── embedding/            # Phase 4
│   │   ├── rag/                  # Phase 5 & 6
│   │   ├── graph/                # Phase 7
│   │   ├── impact/               # Phase 8
│   │   ├── diagram/              # Phase 9
│   │   ├── shared/               # Shared code between features
│   │   └── main.py               # FastAPI entry point
│   │
│   ├── data/
│   │   ├── repositories/         # Cloned repositories
│   │   ├── indexes/              # File indexes
│   │   ├── vectordb/             # Local vector DB storage
│   │   └── temp/
│   │
│   ├── tests/
│   │
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   └── README.md
│
├── frontend/
│
├── README.md
└── .gitignore