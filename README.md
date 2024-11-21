# API Chaining

This project is a React-based dashboard application that allows users to view, edit, and update user data through a series of API calls. It demonstrates complex API interactions, including both GET and POST requests, and showcases the ability to chain multiple API calls together.

## Features

- Fetch and display user data from a mock API
- Edit user information with inline forms
- Create a workflow of API calls
- Execute the workflow and display results
- Dynamic dropdowns populated with data from previous API responses

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

To install the User Data Modification Dashboard, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/user-data-modification-dashboard.git
   ```

2. Navigate to the project directory:
   ```
   cd user-data-modification-dashboard
   ```

3. Install the dependencies:
   ```
   npm install
   ```
## Running the Application

To run the User Data Modification Dashboard, use the following command:

```
npm run start
```

This will start the development server. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. When the application loads, it will automatically fetch and display a list of users.
2. Click the "Edit" button next to a user to modify their information.
3. In the edit form, you can manually input new values or select from previous values using the dropdowns.
4. Click "Add to Workflow" to add the edit operation to the workflow.
5. Repeat steps 2-4 to add more operations to the workflow.
6. Click "Execute Workflow" to run all the operations in the workflow.
7. View the results of the API calls in the Results section at the bottom of the page.

## Project Structure

```
user-data-modification-dashboard/
├── src/
│   ├── components/
│   │   └── UserDataModificationDashboard.js
│   ├── utils/
│   │   └── apiConfig.js
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── package.json
└── README.md
```


