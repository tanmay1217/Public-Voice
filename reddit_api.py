from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get environment variables with error handling
def get_env_var(name):
    value = os.getenv(name)
    if not value:
        logger.error(f"Environment variable {name} is not set")
        raise ValueError(f"Environment variable {name} is not set")
    return value

try:
    logger.info("Initializing Reddit client...")
    reddit = praw.Reddit(
        client_id=get_env_var('REDDIT_CLIENT_ID'),
        client_secret=get_env_var('REDDIT_CLIENT_SECRET'),
        user_agent=get_env_var('REDDIT_USER_AGENT'),
        username=get_env_var('REDDIT_USERNAME'),
        password=get_env_var('REDDIT_PASSWORD')
    )
    logger.info("Reddit client initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Reddit client: {str(e)}")
    raise

@app.route('/')
def home():
    return jsonify({
        'status': 'success',
        'message': 'Public Voice API is running',
        'endpoints': {
            'reddit_comments': '/api/reddit_comments?policy=<policy_name>'
        }
    })

@app.route('/api/reddit_comments', methods=['GET'])
def get_reddit_comments():
    try:
        policy = request.args.get('policy')
        if not policy:
            return jsonify({
                'status': 'error',
                'message': 'Policy parameter is required'
            }), 400

        logger.info(f"Searching Reddit for policy: {policy}")
        subreddit = request.args.get('subreddit', 'india')
        comments_list = []

        for submission in reddit.subreddit(subreddit).search(policy, limit=5):
            try:
                submission.comments.replace_more(limit=0)
                for comment in submission.comments.list()[:10]:
                    comments_list.append({
                        'id': comment.id,
                        'body': comment.body,
                        'author': str(comment.author),
                        'score': comment.score,
                        'created': comment.created_utc
                    })
            except Exception as e:
                logger.error(f"Error processing submission {submission.id}: {str(e)}")
                continue

        logger.info(f"Found {len(comments_list)} comments")
        return jsonify({
            'status': 'success',
            'data': comments_list
        })
    except Exception as e:
        logger.error(f"Error in get_reddit_comments: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
