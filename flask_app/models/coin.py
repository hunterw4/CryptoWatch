from flask_app.config.mysqlconnection import connect_to_mysql

class Coin:
    db = "cryptowatch"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.symbol = data['symbol']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def save(cls,data):
        query  = "INSERT INTO coins (name, symbol) VALUES (%(name)s,%(symbol)s);"
        return connectToMySQL(cls.db).query_db(query,data)

    @classmethod
    def get_all_json(cls):
        query = "SELECT * FROM coins;"
        results = connectToMySQL(cls.db).query_db(query)
        users = []
        for user_data in results:
            users.append( user_data )
        return users