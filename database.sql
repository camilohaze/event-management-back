CREATE DATABASE `event-management`;

use `event-management`;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT,
	username VARCHAR(30) NOT NULL,
	password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
	CONSTRAINT PK_Users PRIMARY KEY (id),
	CONSTRAINT U_Username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS profiles (
	id INT AUTO_INCREMENT,
	firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50) NOT NULL,
	phone VARCHAR(15) NULL,
	userId INT NOT NULL,
	CONSTRAINT PK_Profiles PRIMARY KEY (id),
	CONSTRAINT FK_ProfilesUsers FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
	id INT AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
	CONSTRAINT PK_Categories PRIMARY KEY (id),
    CONSTRAINT U_Name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS events (
	id INT AUTO_INCREMENT,
	title VARCHAR(125) NOT NULL,
	description VARCHAR(250) NOT NULL,
    startTime TIME NOT NULL,
    openingTime TIME NOT NULL,
    minimumAge BOOLEAN NOT NULL,
    specialZone BOOLEAN NOT NULL,
	location VARCHAR(150) NOT NULL,
	latitude VARCHAR(50) NOT NULL,
	longitude VARCHAR(50) NOT NULL,
	userId INT NOT NULL,
    categoryId INT NOT NULL,
	CONSTRAINT PK_Events PRIMARY KEY (id),
	CONSTRAINT FK_EventsUsers FOREIGN KEY (userId) REFERENCES users(id),
    CONSTRAINT FK_EventsCategories FOREIGN KEY (categoryId) REFERENCES categories(id),
	CONSTRAINT U_Event UNIQUE (title,latitude,longitude)
);

CREATE TABLE IF NOT EXISTS images (
	id INT AUTO_INCREMENT,
	url VARCHAR(250) NOT NULL DEFAULT '/uploads/400x200.png',
    eventId INT NOT NULL,
	CONSTRAINT PK_Images PRIMARY KEY (id),
    CONSTRAINT FK_ImageEvents FOREIGN KEY (eventId) REFERENCES events(id),
	CONSTRAINT U_Url UNIQUE (url,eventId)
);

CREATE TABLE IF NOT EXISTS dates (
	id INT AUTO_INCREMENT,
    date DATE NOT NULL,
	eventId INT NOT NULL,
	CONSTRAINT PK_Dates PRIMARY KEY (id),
	CONSTRAINT FK_DatesEvents FOREIGN KEY (eventId) REFERENCES events(id),
    CONSTRAINT U_Dates UNIQUE (date,eventId)
);

CREATE TABLE IF NOT EXISTS attendees (
	id INT AUTO_INCREMENT,
    dateId INT NOT NULL,
	eventId INT NOT NULL,
	userId INT NOT NULL,
	CONSTRAINT PK_Attendees PRIMARY KEY (id),
	CONSTRAINT FK_AttendeesDates FOREIGN KEY (dateId) REFERENCES dates(id),
	CONSTRAINT FK_AttendeesEvents FOREIGN KEY (eventId) REFERENCES events(id),
	CONSTRAINT FK_AttendeesUsers FOREIGN KEY (userId) REFERENCES users(id),
	CONSTRAINT U_Attendees UNIQUE (date,eventId,userId)
);
