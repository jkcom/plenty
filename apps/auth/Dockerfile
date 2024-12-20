# Use the official Bun image
FROM oven/bun:latest

# Install git using apt (Debian/Ubuntu-based image)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package files and Bun.lockb for dependency installation
COPY package.json ./

# Install dependencies
RUN bun add github:jkcom/openauth

RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port your application runs on (default for Bun apps is often 3000)
EXPOSE 3000

# Command to start the Bun application
CMD ["bun", "start"]
