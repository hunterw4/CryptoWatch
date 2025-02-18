from flask_app import app
from flask import render_template, redirect, request, jsonify
from flask_app.models import user


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/watchlist')
def watchlist():
    return render_template('watchlist.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/login')
def login():
    return render_template('login.html')
