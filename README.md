# NexusTech-Software-Inc.

## Setup
Clone the repository:
```bash
git clone https://github.com/srivalli0207/NexusTech-Software-Inc..git
cd NexusTech-Software-Inc.
```

Install Python dependencies:
```bash
pip install django django-cors-headers mysqlclient
```
(if pip doesn't work, use `python -m pip`)

Copy `db.conf` to repository directory (file + settings provided in Discord):
```
[client]
database = nexustech
host = ...
user = ...
password = ...
default-character-set = utf8
```

Launch Django server:
```bash
python manage.py runserver 0.0.0.0:8000
```

Launch web (frontend) server in another terminal:
```bash
cd NexusTech-Software-Inc.
cd web
npm install
npm run dev
```

## Project Structure
[todo]