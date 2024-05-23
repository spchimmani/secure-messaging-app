create database sma_db;

use sma_db;

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    DisplayName VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
    MessageID INT AUTO_INCREMENT PRIMARY KEY,
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    MessageImage MEDIUMBLOB,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

CREATE TABLE Friends (
    FriendshipID INT AUTO_INCREMENT PRIMARY KEY,
    UserID1 INT NOT NULL,
    UserID2 INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID1) REFERENCES Users(UserID),
    FOREIGN KEY (UserID2) REFERENCES Users(UserID)
);


INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES ('John Doe', 'john.doe@example.com', 'hash1');
INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES ('Jane Doe', 'jane.doe@example.com', 'hash2');
INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES ('Mike Smith', 'mike.smith@example.com', 'hash3');
INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES ('Anna Johnson', 'anna.johnson@example.com', 'hash4');
INSERT INTO Users (DisplayName, Email, PasswordHash) VALUES ('Chris Lee', 'chris.lee@example.com', 'hash5');



INSERT INTO Friends (UserID1, UserID2) VALUES (1, 2);
INSERT INTO Friends (UserID1, UserID2) VALUES (1, 3);
INSERT INTO Friends (UserID1, UserID2) VALUES (2, 3);
INSERT INTO Friends (UserID1, UserID2) VALUES (4, 5);
INSERT INTO Friends (UserID1, UserID2) VALUES (3, 4);


select * from users; 

select * from messages;

select * from friends;

ALTER TABLE Messages ADD COLUMN EncryptionType TINYINT NOT NULL DEFAULT 0;

