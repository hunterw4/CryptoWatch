from flask_app.config.mysqlconnection import connect_to_mysql

class Coin:
    DB = "cryptowatch"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.symbol = data['symbol']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def save(cls, data):
        query = '''INSERT INTO coins (name, symbol, user_id, created_at, updated_at) 
                   VALUES( %(name)s, %(symbol)s, %(user_id)s, NOW(), NOW());'''
        return connect_to_mysql(cls.DB).query_db(query, data)

    @classmethod
    def get_all_json(cls):
        query = "SELECT * FROM coins;"
        results = connect_to_mysql(cls.DB).query_db(query)
        users = []
        for user_data in results:
            users.append( user_data )
        return users

    @classmethod
    def get_user_coins(cls, data):
        query = "SELECT * FROM coins WHERE user_id = %(user_id)s"
        result = connect_to_mysql(cls.DB).query_db(query, {'user_id': data})
        return result

    @classmethod
    def delete(cls, data):
        query = """
                DELETE FROM coins
                WHERE name = %(name)s AND user_id = %(user_id)s;
            """
        results = connect_to_mysql(cls.DB).query_db(query, data)
        return results