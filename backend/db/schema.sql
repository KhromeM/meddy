-- psql to go into the postgres cli 
CREATE DATABASE meddysql;
-- Go into meddysql, then run
CREATE EXTENSION IF NOT EXISTS vector;

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
    DocumentID SERIAL PRIMARY KEY,
    UserID VARCHAR(255),
    Text TEXT,
    Embedding vector(3072),
    Type VARCHAR(255),
    FileID INT,
    "Order" INT,  
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (FileID) REFERENCES Files(FileID)
);

CREATE TABLE Appointments (
    AppointmentID SERIAL PRIMARY KEY,
    Date TIMESTAMP WITHOUT TIME ZONE,
    Transcript TEXT,
    UserID VARCHAR(255),
    DoctorID VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

CREATE TABLE Doctors (
    DoctorID VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255)
);

-- repeat for the test db   
CREATE DATABASE meddysql_test;