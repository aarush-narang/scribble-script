# Set base image (host OS)
FROM python:3.12

# By default, listen on port 80
EXPOSE 443/tcp

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY app.py .
COPY cert.pem .
COPY key.pem .

# Specify the command to run on container start
CMD [ "python", "./app.py" ]

# Run Commands:
# docker build -t scribble-script-server .
# docker run -p 443:443 scribble-script-server