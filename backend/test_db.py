import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="skillsync_db",
        user="skillsync_user"
    )
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")