🤖 RAG Chatbot - Information Retrieval System

Overview
This project implements a Retrieval-Augmented Generation (RAG) chatbot system that combines information retrieval and language generation capabilities. The system uses ChromaDB as its vector database and integrates machine learning models for semantic search and response generation.

🛠️ Technologies Used
- React 18 - Frontend framework
- Python - Backend programming language
- ChromaDB - Vector database for storage
- Scikit-learn - Machine learning library
- Pandas - Data manipulation
- Gymnasium - Reinforcement learning
- NumPy - Numerical computations

✨ Features
- Real-time chat interface with loading states
- Vector-based information retrieval using ChromaDB
- Machine learning-powered semantic search
- Natural language processing capabilities
- Responsive and interactive UI
- Data visualization capabilities

💻 Installation

1. First, ensure you have Node.js version 16.x or 18.x installed:
```bash
node --version  # Should show v16.x.x or v18.x.x
```

2. Create a `.env` file in the root directory and add your server URLs:
```bash
# Create .env file with the following content:
REACT_APP_CHATBOT_SQL_API=http://YOUR_SQL_API_URL
REACT_APP_CHATBOT_BACKEND_API=http://YOUR_BACKEND_API_URL
```

**Note:** 
- Replace `YOUR_SQL_API_URL` with your SQL database API endpoint (used for metrics and analytics)
- Replace `YOUR_BACKEND_API_URL` with your chatbot backend API endpoint (used for core chat functionality)

These URLs should point to your production servers:
- SQL API: Handles metrics storage and analytics
- Backend API: Handles chat processing and responses

2. Clone the repository:
```bash
git clone https://github.com/yourusername/RAG-Chatbot.git
cd RAG-Chatbot
```

3. Install dependencies:
```bash
npm install
pip install -r requirements.txt
```

📝 Usage Instructions

1. Start the development server:
```bash
npm start
```

2. Open http://localhost:3000 in your browser
3. Use the chat interface to interact with the RAG system
4. The system will process your queries and provide relevant responses based on the stored knowledge base

📂 Files
- src/ - Frontend source code
- public/ - Static assets
- build/ - Build output
- chroma_db/ - ChromaDB database files
- requirements.txt - Backend dependencies
- package.json - Frontend dependencies

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

🤝 Contributing

Feel free to fork this repository and submit pull requests if you have improvements or suggestions!
