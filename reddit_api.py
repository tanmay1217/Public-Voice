from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
from dotenv import load_dotenv
import os
app = Flask(__name__)
CORS(app)
load_dotenv()

reddit = praw.Reddit(
    client_id = os.getenv('REDDIT_CLIENT_ID'),
    client_secret = os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent = os.getenv('REDDIT_USER_AGENT'),
    username = os.getenv('REDDIT_USERNAME'),
    password = os.getenv('REDDIT_PASSWORD')
)

@app.route('/api/reddit_comments', methods=['GET'])
def get_reddit_comments():
    policy = request.args.get('policy')
    subreddit = request.args.get('subreddit', 'india')  # Default to 'india'
    comments_list = []

    for submission in reddit.subreddit(subreddit).search(policy, limit=5):
        submission.comments.replace_more(limit=0)
        for comment in submission.comments.list()[:10]:  # Limit to 10 comments per post
            comments_list.append({
                'id': comment.id,
                'body': comment.body,
                'author': str(comment.author),
                'score': comment.score,
                'created': comment.created_utc
            })

    return jsonify(comments_list)

if __name__ == '__main__':
    app.run(port=5000, debug=True)