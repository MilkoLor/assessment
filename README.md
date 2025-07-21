
# Ad Insights Explorer 


## Features
- **Backend (FastAPI):**
  - `/posts`: Fetches raw posts from JSONPlaceholder.
  - `/anomalies`: Flags posts with short titles, duplicate titles by the same user, and users with >5 similar titles (possible bots).
  - `/summary`: Shows top users by unique words in titles and most common words overall.
- **Frontend (React + Tailwind):**
  - Beautiful dashboard UI with summary panel and anomalies table.
  - Filtering, sorting, and tag cloud for common words.
  - Responsive and modern design.
- **Testing:**
  - Backend: Pytest unit tests.
  - Frontend: Jest + React Testing Library integration tests.

---

## Project Structure

```
assess/
├── venv/                # Python virtual environment
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI entry point
│   ├── models.py        # Pydantic models
│   ├── services.py      # Business logic for endpoints
│   └── utils.py         # Helper functions
├── tests/
│   └── test_services.py # Unit tests for backend logic
├── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/             # React source code
│   ├── public/          # Static assets (after build)
│   ├── package.json     # Frontend dependencies
│   └── ...
└── README.md            # Setup and usage instructions
```

---

## Backend Setup

1. **Create and activate a virtual environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
3. **Run the FastAPI server:**
   ```powershell
   uvicorn app.main:app --reload
   ```
4. **API docs:**
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Frontend Setup

1. **Install dependencies:**
   ```powershell
   cd frontend
   npm install
   ```
2. **Run in development mode:**
   ```powershell
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

3. **Build for production:**
   ```powershell
   npm run build
   ```
   Copy the contents of `frontend/dist/` to `app/public/` to serve with FastAPI.

---

## Deployment

- **Local:**
  - Backend: `uvicorn app.main:app --reload`
  - Frontend: `npm run build` then copy to `app/public/` and access at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)


---

## Testing

- **Backend:**
  ```powershell
  pytest
  ```
- **Frontend:**
  ```powershell
  cd frontend
  npm test
  ```

---

## Notes
- The backend serves the frontend at the root URL after build.
- All endpoints are documented in the FastAPI docs.
- The UI is fully responsive and uses Tailwind CSS for styling.

---
