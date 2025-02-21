# TRL Calculator (React & Node.js)

## Overview
The **TRL Calculator** (Technology Readiness Level Calculator) is a tool designed for our research project to assess and quantify the readiness level of technologies. This new version is built with **React.js** for the frontend and **Node.js (Express)** for the backend, utilizing **MongoDB/MySQL** for data storage.

## Features
- **Technology Readiness Level (TRL) Calculation** using a **weighted average** approach.
- **Modern Web Interface** built with React.js for an interactive and seamless experience.
- **RESTful API** powered by Node.js and Express for efficient data handling.
- **Database Integration** with MongoDB (or MySQL as an alternative).
- **Authentication & User Management** (planned feature for future updates).

## Inspiration
Our TRL Calculator is inspired by existing models used by governmental and research institutions. Here are some notable examples:

| Platform | Type | Link |
|----------|------|------|
| MCTIC (Brazil) | Website | [MCTIC TRL Calculator](https://formularios.mctic.gov.br/index.php/117963) |
| ESA (European Space Agency) | Website | [ESA TRL Calculator](https://trlcalculator.esa.int) |
| NSW Government (Australia) | Excel | [NSW TRL Calculator](https://www.nsw.gov.au/sites/default/files/2022-11/mvp-ventures-technology-readiness-level.xlsx%3FcontentOnly%3Dtrue) |
| ITA/IEA (Brazil) | Excel | [ITA/IEA TRL Calculator](https://iae.dcta.mil.br/images/Calculadora_MRL_e_TRL/CalculadoraTRLIAEITA2020.xlsm) |

## Technologies Used
### Frontend
- **React.js** (with Vite or Create React App)
- **Tailwind CSS / Material-UI** (for styling)
- **Axios** (for API calls)
- **React Router** (for navigation)

### Backend
- **Node.js** (Express framework)
- **MongoDB / MySQL** (database options)
- **JWT Authentication** (for user login, future feature)
- **Dotenv** (for environment variables)

## Installation & Usage
### Prerequisites
- **Node.js & npm** installed
- **MongoDB (or MySQL) running locally or in the cloud**

### Steps
#### 1. Clone the Repository
```sh
 git clone https://github.com/your-repository/trl-calculator-react.git
 cd trl-calculator-react
```

#### 2. Install Dependencies
```sh
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the backend folder with the following:
```
PORT=5000
DB_URI=mongodb+srv://your-db-uri OR mysql://user:password@host/database
JWT_SECRET=your-secret-key
```

#### 4. Run the Project
```sh
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start
```

#### 5. Access the Application
Open **http://localhost:3000** in your browser.

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | /api/trl | Get all TRL entries |
| POST   | /api/trl | Add a new TRL entry |
| PUT    | /api/trl/:id | Update an existing TRL entry |
| DELETE | /api/trl/:id | Delete a TRL entry |
