# Voting Application

## Overview
This Voting Application is designed to manage a simple voting process, where users can cast their votes for different candidates, and an admin can manage candidate data. The app ensures secure authentication using JWT (JSON Web Tokens) and is built using the Express.js framework.

## Features
- **User Authentication**: Users and admins are authenticated using JWT for secure access.
- **Role-Based Access Control**: Only authenticated users can vote, and only an admin can manage candidate-related tasks.
- **Admin Privileges**: The system restricts admin-related tasks to a single admin, ensuring exclusive control.
- **Vote Casting**: Users can cast their vote for a specific candidate, and the system ensures each user can only vote once.
- **Candidate Management**: Admin can add, edit, or remove candidates.
- **Vote Count**: The application tracks votes for each candidate and displays the total vote count.

## Technologies Used
- **Backend**: Express.js
- **Authentication**: JSON Web Token (JWT)
- **Database**: MongoDB (or any other DB you're using)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/voting-app.git
   cd voting-app
