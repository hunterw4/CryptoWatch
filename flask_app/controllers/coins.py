from flask_app import app
from flask import render_template, redirect, jsonify
from flask_app.models import coin
from apscheduler.schedulers.background import BackgroundScheduler
import requests
import os

API_KEY = os.environ.get('COINGECKO_API_KEY')

cached_data = None

def update_crypto_data():
    global cached_data
    url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": f"{API_KEY}\t"
    }
    response = requests.get(url, headers=headers)
    cached_data = response.json()

# Schedule the update function
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_crypto_data, trigger="interval", minutes=3)
scheduler.start()

@app.route('/api/top-100')
def get_crypto_data():
    global cached_data
    if cached_data is None:
        update_crypto_data()
    return jsonify(cached_data)


@app.route('/api/global-market')
def get_global_data():
    global_url = "https://api.coingecko.com/api/v3/global"

    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": API_KEY
    }
    response = requests.get(global_url, headers=headers)
    response = response.json()
    return jsonify(response)


@app.route('/api/trending')
def get_trending():
    url = "https://api.coingecko.com/api/v3/search/trending"

    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": API_KEY
    }

    response = requests.get(url, headers=headers)
    response = response.json()
    print(response)
    return jsonify(response)