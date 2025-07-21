# GTA - Exam Creation and Participation Platform

GTA (Goa Testing Agency) is a full-stack web application that allows teachers to create and manage online exams, and enables students to attempt those exams in a secure, user-friendly interface.


## Features

### For Professors
- Create and manage exams with MCQ and NAT (Numerical Answer Type) questions
- Option to provide 3 to 5 options per MCQ
- Define custom marking scheme: positive, negative, and unattempted marks
- View exam history
- Automatically calculated results (no manual release)


### For Students
- Attempt exams in a single-page interface
- Protected exam routes
- Auto-refreshing access tokens for long exams
- Prevents tab switching during exam for security
- View results with correct answers and responses after submission
- Email notification sent after submission

## Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Authentication**: JWT with refresh/access token logic
- **Styling**: CSS Modules
- **Email**: Nodemailer
- **Graphs**:Recharts

## Folder Structure

/GTA
│
├── /frontend # React client app
│ └── ...
│
├── /backend # Node.js backend API
│ └── ...
│
├── README.md
└── .gitignore



## Setup Instructions

### 1. @ Clone the Repository

        ```bash
        git clone https://github.com/SD5002/ExamPortal.git
        cd gta


### 2.  @ Backend Setup
                cd backend
                npm install

        @ Create a .env file in the backend folder:
            #  .env.example
                MONGO_URL=your_mongo_url_here
                ACCESS_TOKEN_SECRET=your_access_token_secret
                REFRESH_TOKEN_SECRET=your_refresh_token_secret
                EMAIL_USER=your_email@example.com
                EMAIL_PASS=your_email_password
                ACCESS_TOKEN_EXPIRY=time
                REFRESH_TOKEN_EXPIRY=time


        @ Then start the server:
                nodemon app.js

### 3. Frontend Setup

                cd ../frontend
                npm install
                npm run dev


