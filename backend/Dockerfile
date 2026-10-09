# 1. Base Image: Choose a lightweight Linux OS with Node 20 pre-installed
FROM node:20-alpine

# 2. Set the working folder inside the container
WORKDIR /app

# 3. Copy package files first
COPY package*.json ./

# 4. Install dependencies inside the container
RUN npm install

# 5. Copy the rest of your server code into the container
COPY . .

# 6. Inform Docker that the app listens on port 5000
EXPOSE 5000

# 7. The command to start your application inside the container
CMD ["node", "server.js"]
