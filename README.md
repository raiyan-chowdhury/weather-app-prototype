# ECS635U - Final Year Project

## Prototype of Outdoor Activity Weather Application

The prototype is designed to provide real-time weather information along with personalised outdoor activity suggestions based on the user's current and favourite locations. It aims to bridge the gap between weather data and outdoor activity recommendations, helping users make informed decisions about their outdoor pursuits.

## Setting Up Virtual Environment

Before running the prototype, you should first set up a virtual environment.

I chose to use Miniconda, and the recommended version for this project is Python 3.10. You will need to install Miniconda3 with Python 3.10, which includes conda (environment and package manager).

You can install Miniconda by following the instructions provided in the following url: https://docs.conda.io/projects/miniconda/en/latest/miniconda-other-installer-links.html

## Instructions for Running the Prototype

### 1. Set Up Conda Environment

Create and activate a conda environment (e.g. ECS635U):

```console
$ conda create --name ECS635U
$ conda activate ECS635U
```

### 2. Download Source Code

Clone the following GitHub repository: https://github.com/raiyan-chowdhury/weather-app-prototype

    ```console
    (ECS635U)$ git clone https://github.com/raiyan-chowdhury/weather-app-prototype
    ```

Once cloned, make sure to navigate into the cloned directory:

    ```console
    (ECS635U)$ cd weather-app-prototype
    ```

### 3. Install Backend (Python) Dependencies

With the conda environment active, install the backend (Python) dependencies from the backend folder:

    ```console
    (ECS635U)$ cd backend
    ```

and run:

    ```console
    (ECS635U)$ pip install -r requirements.txt
    ```

### 4. Create Database

To create the database, cd into the backend folder (if not already there):

    ```console
    (ECS635U)$ cd backend
    ```

and run:

    ```console
    $ python manage.py migrate
    ```

### 5. Install Frontend (JavaScript) Dependencies

To install the frontend (JavaScript) dependencies, navigate into the frontend folder. If you are currently in the backend folder, you need to go up one level:

```console
(ECS635U)$ cd ..
```

Then cd into the frontend folder:

```console
(ECS635U)$ cd frontend
```

and run:

```console
(ECS635U)$ npm install
```

### 6. Start Backend Server

To start the Django backend server, cd into the backend folder:

```console
(ECS635U)$ cd backend
```

and run

```console
(ECS635U)$ python manage.py runserver
```

The backend server will start on http://localhost:8000. Keep this terminal running.

### 7. Start Frontend Server

To start the Vue frontend server, open a new terminal and cd into the frontend folder:

```console
(ECS635U)$ cd frontend
```

and run:

```console
(ECS635U)$ npm run dev
```

The frontend server will start on http://localhost:5173.

Keep both servers running in separate terminals. The backend server runs in the background, and the frontend server is used to start the prototype.
