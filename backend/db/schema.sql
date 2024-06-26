-- CREATE DATABASE meddysql;

CREATE TABLE Users (
    UserID VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

CREATE TABLE Messages (
    MessageID SERIAL PRIMARY KEY,
    UserID VARCHAR(255),
    Source VARCHAR(255),
    Text TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Files (
    FileID SERIAL PRIMARY KEY,
    UserID VARCHAR(255),
    Type VARCHAR(255),
    Name VARCHAR(255),
    ByteSize INT,
    LocalPath VARCHAR(255),
    AccessUrl VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Documents (
    MessageID SERIAL PRIMARY KEY,
    UserID VARCHAR(255),
    Text TEXT,
    Embedding float4[],
    Type VARCHAR(255),
    File VARCHAR(255),
    "Order" INT,  
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


