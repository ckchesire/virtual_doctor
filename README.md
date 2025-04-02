# Virtual Doctor Platform

A modern telemedicine platform that connects patients with healthcare providers for virtual consultations and medical services.

## Overview

Virtual Doctor is a comprehensive telemedicine solution that enables:
- Secure messaging for medical communication
- Digital medical records management
- Appointment scheduling and management
- Remote healthcare access

## Tech Stack

### Backend
- Django REST Framework
- PostgreSQL (with SQLite for development)
- JWT Authentication
- CORS support
- Python 3.x

### Frontend
- React.js
- Vite
- Modern UI/UX design
- Responsive web application

## Features

- **Secure Messaging**: Encrypted communication for medical discussions
- **Medical Records**: Digital storage and management of patient records
- **Appointment Management**: Easy scheduling and tracking of medical appointments
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Accessible on desktop and mobile devices

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm
- PostgreSQL (for production)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
virtual_doctor/
├── backend/               # Django backend
│   ├── api/              # API endpoints
│   ├── backend/          # Django project settings
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Node.js dependencies
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Author:** Christian Chesire

- Email: christianck.chesire@gmail.com
- LinkedIn: [Christian Chesire](https://www.linkedin.com/in/christian-chesire-6326b719a/)

For any questions or support, please contact the development team. 
