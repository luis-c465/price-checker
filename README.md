# Price Checker

> Project made during INIT Build 2024 for the Mobile Dev team
> Finds an item based off a photo and allows for easy comparison of prices to find the best deal!

# Getting Started

The project is split into 2 parts, `frontend/` (React Native on phone) and `backend` (Python Flask server running on server), these 2 communicate through API calls

The frontend makes a request to the backend asking for related proudcts, and the backend responds with json, representing a list of those items

## Requirements

- NodeJS
- Python
- Etc

## Frontend

```bash
# In the frontend folder, run

npm install

npm run start
```

## Backend

```bash
# In the backend folder, run

python -m pip install -r requirements.txt
python main.py
```
