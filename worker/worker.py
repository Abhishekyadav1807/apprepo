import os
import json
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from redis import Redis

load_dotenv()

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', '6379'))
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongo:27017/aitasks')

redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
mongo = MongoClient(MONGO_URI)
db = mongo.get_default_database()
tasks = db.tasks


def log(task_id, text):
    tasks.update_one({'_id': task_id}, {'$push': {'logs': f"{datetime.utcnow().isoformat()} {text}"}})


def process(operation, input_text):
    if operation == 'uppercase':
        return input_text.upper()
    if operation == 'lowercase':
        return input_text.lower()
    if operation == 'reverse':
        return input_text[::-1]
    if operation == 'word_count':
        return str(len([w for w in input_text.split() if w.strip()]))
    raise ValueError('Unsupported operation')


def run():
    print('Worker started')
    while True:
        _, payload = redis_client.brpop('task_queue')
        job = json.loads(payload)
        task_id = job['taskId']
        from bson import ObjectId
        object_id = ObjectId(task_id)

        task = tasks.find_one({'_id': object_id})
        if not task:
            continue

        tasks.update_one({'_id': object_id}, {'$set': {'status': 'running', 'error': ''}})
        log(object_id, 'Task started in worker')

        try:
            result = process(task['operation'], task['inputText'])
            tasks.update_one({'_id': object_id}, {'$set': {'status': 'success', 'result': result}})
            log(object_id, 'Task completed successfully')
        except Exception as error:
            tasks.update_one({'_id': object_id}, {'$set': {'status': 'failed', 'error': str(error)}})
            log(object_id, 'Task failed')


if __name__ == '__main__':
    run()
