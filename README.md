## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Naman8042/task-manager.git
cd task-manager

2. Install dependencies

npm install
# or
yarn install


3. Create a .env file in the root of your project:

# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# NextAuth secret
NEXTAUTH_SECRET=your_nextauth_secret

# NextAuth URL (use localhost for development)
NEXTAUTH_URL=http://localhost:3000


4. Run the development server

npm run dev
# or
yarn dev


Build the Docker image in PowerShell / VS Code terminal (single line):

1. docker build --build-arg MONGO_URI="your_mongodb_connection_string" --build-arg NEXTAUTH_SECRET="your_nextauth_secret" -t task-manager-app .

2 Run the container:

docker run -p 3000:3000 `
  -e MONGO_URI="your_mongodb_connection_string" `
  -e NEXTAUTH_SECRET="your_nextauth_secret" `
  -e NEXTAUTH_URL="http://localhost:3000" `
  task-manager-app