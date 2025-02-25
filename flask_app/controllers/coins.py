from tensorflow.tools.compatibility.ast_edits import APIAnalysisSpec

from flask_app import app
from flask import render_template, redirect, jsonify, session
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
    return jsonify(response)

@app.route('/watchlist/add/<id>')
def add_coin(id):
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={id}"

    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": API_KEY
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    db_data = {
        'name': data[0]['id'],
        'symbol': data[0]['symbol'],
        'user_id': session.get('user_id')
    }
    coin.Coin.save(db_data)
    return redirect('/watchlist')

@app.route('/watchlist/get')
def get_user_watchlist():
    user_coins = coin.Coin.get_user_coins(session.get('user_id'))
    result = ''
    for coins in user_coins:
        if result:
            result += "%2C"
        result += coins['name']
    print(result)
    url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={result}&order=market_cap_desc"

    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": API_KEY
    }
    response = requests.get(url, headers=headers)
    response = response.json()
    return jsonify(response)


@app.route('/watchlist/remove/<id>')
def remove_coin(id):
    data = {
        "name": id,
        'user_id': session.get('user_id')
    }
    coin.Coin.delete(data)
    return redirect('/watchlist')