# NexusTech-Software-Inc.

## Setup
* Clone the repository:
```bash
git clone https://github.com/srivalli0207/NexusTech-Software-Inc..git
cd NexusTech-Software-Inc.
```

* Install Python dependencies (if `pip` doesn't work, use `python -m pip`):
```bash
pip install django django-cors-headers django-storages mysqlclient python-dotenv boto3 daphne channels
```

* Copy `db.conf` to repository directory (file provided in Discord):
```
[client]
database = nexustech
host = ...
user = ...
password = ...
default-character-set = utf8
```

* Copy `.env` to repository directory (file provided in Discord):
```
AWS_ACCESS_KEY_ID = '...'
AWS_SECRET_ACCESS_KEY = '...'
```

* Launch Django server:
```bash
python manage.py runserver 0.0.0.0:8000
```

* Launch web (frontend) server in another terminal:
```bash
cd NexusTech-Software-Inc.
cd web
npm install
npm run dev
```

## Project Structure
[todo]