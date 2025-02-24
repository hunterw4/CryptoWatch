from flask_app import app
from flask import render_template, redirect, request, jsonify, session, url_for
from flask_app.models import user
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)



@app.route('/')
def home():
    logged_in = session.get('logged_in', False)
    return render_template('index.html', logged_in=logged_in)


@app.route('/watchlist')
def watchlist():
    return render_template('watchlist.html')

@app.route('/validate-signup', methods=['POST'])
def validate_signup():
    data = request.json
    errors = {}
    if not data['name']:
        errors['name'] = 'Name is required.'
    elif len(data['name']) < 3:
        errors['name'] = 'Name must be at least 3 characters long.'

    if not data['email']:
        errors['email'] = 'Email is required.'
    elif '@' not in data['email']:
        errors['email'] = 'Email must contain @.'

    if user.User.get_by_email(data['email']):
        errors['email'] = 'User already exists. Please log in!'


    if not data['password']:
        errors['password'] = 'Password is required.'
    elif len(data['password']) < 6:
        errors['password'] = 'Password must be at least 6 characters long.'
    if data['password'] != data['confirm_password']:
        errors['password'] = 'Passwords do not match, please try again.'

    if errors:
        return jsonify({'errors': errors}), 400
    else:
        return jsonify({'success': 'Validation passed'}), 200

@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/create', methods=['POST'])
def create_user():
    data = request.get_json()
    pw_hash = bcrypt.generate_password_hash(data['password'], 12)

    user_data = {
        'name': data['name'],
        'email': data['email'],
        'password': pw_hash
    }
    user.User.create(user_data)
    return redirect('/login')



@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')

@app.route('/validate-login', methods=['POST'])
def validate_login():
    data = request.json
    errors = {}

    if not data['email']:
        errors['email'] = 'Email is required.'
    elif '@' not in data['email']:
        errors['email'] = 'Email must contain @.'

    if not data['password']:
        errors['password'] = 'Password is required.'

    if not user.User.get_by_email(data['email']):
        errors['email'] = 'Email is not registered, please create an account!'
    else:
        selected_user = user.User.login(data['email'])
        if not bcrypt.check_password_hash(selected_user[0]['password'], data['password']):
            errors['password'] = 'Password is incorrect'
        else:
            session['logged_in'] = True
            session['user_id'] = selected_user[0]['id']
            return jsonify({'redirect': url_for('home')})

    if errors:
        print(errors)
        return jsonify({'errors': errors}), 400


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')