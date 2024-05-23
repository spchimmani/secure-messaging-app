import pymysql
import json  
import os
import random
from encryptor import extract_data_from_image
from encryptor import embed_data_to_image
from audio_encryptor import encode_message_to_audio
from audio_decryptor import decode_message_from_audio

# Configure your database connection settings
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',  # Use your actual MySQL password
    'database': 'sma_db',  # Use your actual database name
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor  # Use DictCursor to work with dictionaries
}

def establish_connection():
    """Establish and return a MySQL database connection."""
    connection = pymysql.connect(**db_config)
    return connection

def verify_user(email_id, input_password):
    connection = establish_connection()
    cursor = connection.cursor()

    # Prepare and execute the SQL query to get user details
    sql = "SELECT UserID, DisplayName, Email, PasswordHash FROM Users WHERE Email = %s"
    cursor.execute(sql, (email_id,))
    result = cursor.fetchone()

    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Check if the result was found and the passwords match
    if result and result['PasswordHash'] == input_password:
        # Prepare the user details
        user_details = {
            "UserID": result['UserID'],
            "DisplayName": result['DisplayName'],
            "Email": result['Email']
        }
        # Serialize the dictionary to a JSON string
        return True, json.dumps(user_details)
    else:
        # Return an empty JSON object as a string
        return False, json.dumps({})
    


def get_messages_and_extract_text(userID1, userID2):
    messages = []
    connection = establish_connection()
    cursor = connection.cursor()

    # Fetch messages between the two users, sorted by Timestamp, including EncryptionType
    sql = """
    SELECT MessageID, SenderID, ReceiverID, MessageImage, Timestamp, EncryptionType
    FROM Messages
    WHERE (SenderID = %s AND ReceiverID = %s) OR (SenderID = %s AND ReceiverID = %s)
    ORDER BY Timestamp ASC
    """
    cursor.execute(sql, (userID1, userID2, userID2, userID1))

    for row in cursor.fetchall():
        temp_file_path = f'temp_message_{row["MessageID"]}.{"png" if row["EncryptionType"] == 0 else "wav"}'
        with open(temp_file_path, 'wb') as file:
            file.write(row['MessageImage'])

        # Decrypt the message based on the encryption type
        if row['EncryptionType'] == 0:  # Image
            text_message = extract_data_from_image(temp_file_path)
        else:  # Audio
            text_message = decode_message_from_audio(temp_file_path)

        # Ensure text_message is a string
        if isinstance(text_message, bytes):
            try:
                # Decode bytes to string
                text_message = text_message.decode('utf-8')
            except UnicodeDecodeError:
                # Set a placeholder text if decoding fails
                text_message = "[ERROR] Unable to decode message."

        # Clean up: remove the temporary file after processing
        os.remove(temp_file_path)

        # Prepare the message details for JSON serialization
        message_details = {
            "MessageID": row['MessageID'],
            "SenderID": row['SenderID'],
            "ReceiverID": row['ReceiverID'],
            "TextMessage": text_message  # Now ensured to be a string
        }

        # Serialize the dictionary to a JSON string and add to the list
        messages.append(json.dumps(message_details))

    cursor.close()
    connection.close()
    return messages



def insert_message_into_audio_image(SenderID, ReceiverID, text_message):
    flag = False
    # Generate a random number (0 or 1) to decide the encryption type
    encryption_type = random.randint(0, 1)

    # Path for original media files
    original_image_path = 'img.jpeg'
    original_audio_path = 'original_audio.wav'
    
    # Paths for encoded media files
    encoded_image_path = 'encoded_image.png'
    encoded_audio_path = 'encoded_audio.wav'

    # Encrypt the message into an image or an audio file based on the encryption type
    if encryption_type == 0:
        # Encrypt into an image
        embed_data_to_image(text_message, original_image_path)
        print(f"Encrypting message into an image: {original_image_path} -> {encoded_image_path}")
        with open(encoded_image_path, 'rb') as file:
            binary_data = file.read()
    else:
        # Encrypt into an audio file
        encode_message_to_audio(original_audio_path, encoded_audio_path, text_message)
        print(f"Encrypting message into an audio file: {original_audio_path} -> {encoded_audio_path}")
        with open(encoded_audio_path, 'rb') as file:
            binary_data = file.read()

    # Establish database connection
    connection = establish_connection()
    cursor = connection.cursor()
    
    try:
        # SQL statement to insert the new message with the embedded media and encryption type
        sql = "INSERT INTO Messages (SenderID, ReceiverID, MessageImage, EncryptionType) VALUES (%s, %s, %s, %s)"
        
        # Execute the SQL statement
        cursor.execute(sql, (SenderID, ReceiverID, binary_data, encryption_type))
        
        # Commit the transaction
        connection.commit()
        
        # Clean-up
        cursor.close()
        connection.close()

        flag = True
    except pymysql.MySQLError as e:
        print("SQL Error:", e)
        return flag
    
    
    print(f"Message from {SenderID} to {ReceiverID} stored with {'image' if encryption_type == 0 else 'audio'} encryption.")

    return flag


def add_friend_by_email(SenderID, email):
    
    connection = establish_connection()
    cursor = connection.cursor()
    
    # First, fetch the UserID associated with the provided email
    sql_fetch_user = "SELECT UserID FROM Users WHERE Email = %s"
    cursor.execute(sql_fetch_user, (email,))
    result = cursor.fetchone()
    
    if result:
        friendUserID = result['UserID']
        
        # Check if the friendship already exists to avoid duplicates
        sql_check_friendship = """
        SELECT * FROM Friends 
        WHERE (UserID1 = %s AND UserID2 = %s) OR (UserID1 = %s AND UserID2 = %s)
        """
        cursor.execute(sql_check_friendship, (SenderID, friendUserID, friendUserID, SenderID))
        if cursor.fetchone() is None:
            # Insert the new friendship into the Friends table
            sql_insert_friendship = "INSERT INTO Friends (UserID1, UserID2) VALUES (%s, %s)"
            cursor.execute(sql_insert_friendship, (SenderID, friendUserID))
            connection.commit()
            print(f"User {SenderID} and user {friendUserID} are now friends.")
        else:
            print("These users are already friends.")
        cursor.close()
        connection.close()
        return True
    else:
        print("No user found with the provided email.")
    
    cursor.close()
    connection.close()
    return False


def get_user_friends(userID):
   
    friends_details = []
    connection = establish_connection()
    cursor = connection.cursor()

    # SQL to get all friends of the given user
    # We need to check both UserID1 and UserID2 in the Friends table since the user can be in either column
    sql = """
    SELECT u.UserID, u.DisplayName, u.Email FROM Users u
    JOIN Friends f ON u.UserID = f.UserID1 OR u.UserID = f.UserID2
    WHERE %s IN (f.UserID1, f.UserID2) AND u.UserID != %s
    ORDER BY u.DisplayName;
    """
    
    cursor.execute(sql, (userID, userID))
    
    # Fetch and process all rows
    for row in cursor.fetchall():
        # Each row is a dictionary. Directly use it to create the JSON object
        friend_details = {
            "UserID": row['UserID'],
            "DisplayName": row['DisplayName'],
            "Email": row['Email']
        }
        # Serialize the dictionary to a JSON string
        friends_details.append(json.dumps(friend_details))
    
    cursor.close()
    connection.close()

    return friends_details


def add_user_to_database(DisplayName, Email, Password):
    
    # Establish database connection
    connection = establish_connection()
    cursor = connection.cursor()

    # SQL statement to insert the new user
    try:
        sql = "INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES (%s, %s, %s)"
        cursor.execute(sql, (DisplayName, Email, Password))

        # Commit the transaction
        connection.commit()
        print(f"New user '{DisplayName}' added successfully.")

        # Clean-up
        cursor.close()
        connection.close()

        return True
    except pymysql.err.IntegrityError as e:
        print(f"Error adding user: {e}")

        return False

def delete_friend(userID, friendID):
    connection = establish_connection()
    cursor = connection.cursor()
    
    # SQL statement to delete the friendship
    # Since friendship is bidirectional, we need to check both columns
    sql_delete_friendship = """
    DELETE FROM Friends 
    WHERE (UserID1 = %s AND UserID2 = %s) OR (UserID1 = %s AND UserID2 = %s)
    """
    try:
        cursor.execute(sql_delete_friendship, (userID, friendID, friendID, userID))
        connection.commit()
        if cursor.rowcount == 0:
            print("No friendship was found to delete.")
        else:
            print(f"Friendship between user {userID} and user {friendID} has been deleted.")
    except pymysql.MySQLError as e:
        print(f"Error deleting friendship: {e}")
    finally:
        cursor.close()
        connection.close()
