import pymysql

try:
    conn = pymysql.connect(
        host='localhost',          # e.g., '127.0.0.1:8000' or an IP address
        user='root',      # your MySQL username
        password='root',  # your MySQL password
        database='sma_db',  # the database name to connect to
        cursorclass=pymysql.cursors.DictCursor
    )
    print("Successfully connected to the database.")
except pymysql.MySQLError as e:
    print(f"Error connecting to MySQL: {e}")
finally:
    conn.close()
    print("MySQL connection is closed.")
