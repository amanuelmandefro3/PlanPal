# PlanPal - Personal Task Manager

## Author Information

**Name:** Amanuel Mandefrow Reta

**Email:** amanuelmandefrow@gmail.com

## Project Description

PlanPal is a personal task management application designed to help users efficiently manage their tasks. The application features a user-friendly interface for creating, updating, and deleting tasks, as well as viewing tasks based on their status (Pending, Completed). The backend is built using Rell Chromia, and the frontend is developed with Next.js.

## How It Works

PlanPal allows users to:

- Create new tasks with a title, description, and due date.
- Update existing tasks, including changing their status.
- Delete tasks.
- View tasks based on their status (Pending, Completed, etc.).
- Allow users to filter tasks by status and sort them by due date.
- Toggle between light and dark themes.

The backend, written in Rell Chromia, handles task management operations and user authentication. The frontend, built with Next.js, provides a responsive and interactive user interface.

## Setup Instructions

### Clone the Repository

1. Clone the repository:
   ```sh
   git clone https://github.com/amanuelmandefro3/PlanPal.git
   ```
2. Navigate to the project directory:
   ```sh
   cd PlanPal
   ```

### Backend (Rell Chromia)

1. Install Rell Chromia library:
   ```sh
   chr install
   ```
2. Run tests:
   ```sh
   chr test
   ```
3. Start the backend node:
   ```sh
   chr node start
   ```

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Instructions

### Home Page:

- View all tasks.
- Sort tasks in ascending or descending order.
- Navigate through pages of tasks.
- Add a new task using the "Add Task" button.

### Task Management:

- Click on a task to view its details.
- Use the edit button to update task details.
- Use the delete button to remove a task.
- Toggle task status by clicking the checkbox.

### Sidebar Navigation:

- Navigate to different task views (Home, Today, Coming Days, Completed, Pending).
- Toggle between light and dark themes using the theme toggle button.

## Additional Information

- The backend uses Rell Chromia for secure and efficient task management.
- The frontend is built with Next.js for a responsive and interactive user experience.
- Ensure you have Metamask installed and connected for authentication.
- The application uses Tailwind CSS for styling and Radix UI for accessible components.
