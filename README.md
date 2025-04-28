# Public Voice

A web application that bridges the gap between citizens and government welfare schemes through accessible information.

## Features

- Search and discover government welfare schemes
- View detailed policy information
- Analyze public sentiment about policies
- Generate policy reports
- Text-to-speech functionality for accessibility

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Flask (Python)
- APIs: Reddit API for sentiment analysis
- Additional Tools: Gemini API for policy analysis

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/tanmay1217/public-voice.git
cd public-voice
```

2. Install frontend dependencies:
```bash
cd src
npm install
```

3. Install backend dependencies:
```bash
cd ..
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_user_agent
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

5. Start the development servers:
- Frontend: `npm start`
- Backend: `python reddit_api.py`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 