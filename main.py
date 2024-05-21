from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt_manager = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    is_complete = db.Column(db.Boolean, default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.before_first_request
def initialize_database():
    db.create_all()

@app.route('/register', methods=['POST'])
def register_user():
    user_data = request.get_json()
    if User.query.filter_by(username=user_data['username']).first():
        return jsonify({'message': 'Username already exists. Please choose a different one.'}), 400
    hashed_password = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
    new_user = User(username=user_data['username'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def authenticate_user():
    login_data = request.get_json()
    user = User.query.filter_by(username=login_data['username']).first()
    if user and bcrypt.check_password_hash(user.password_hash, login_data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid login credentials'}), 401

@app.route('/tasks', methods=['GET'])
@jwt_required()
def fetch_user_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(owner_id=user_id).all()
    task_list = [{'id': task.id, 'title': task.title,
                  'description': task.description, 'is_complete': task.is_complete}
                 for task in tasks]
    return jsonify({'tasks': task_list})

@app.route('/task', methods=['POST'])
@jwt_required()
def add_task():
    user_id = get_jwt_identity()
    task_data = request.get_json()
    new_task = Task(title=task_data['title'], description=task_data['description'], owner_id=user_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'New task added successfully'}), 201

@app.route('/task/<int:task_id>', methods=['PUT'])
@jwt_required()
def mark_task_as_complete(task_id):
    user_id = get_jwt_identity()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    if task.owner_id != user_id:
        return jsonify({'message': 'Unauthorized to modify this task'}), 403
    task.is_complete = True
    db.session.commit()
    return jsonify({'message': 'Task marked as complete'})

@app.route('/task/<int:task_id>', methods=['DELETE'])
@jwt_required()
def remove_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    if task.owner_id != user_id:
        return jsonify({'message': 'Unauthorized to remove this task'}), 403
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task removed successfully'})

if __name__ == '__main__':
    app.run(debug=True)