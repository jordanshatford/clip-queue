FROM node:lts-alpine AS base

WORKDIR /workspace

# Setup with version of pnpm specified in package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /workspace/
RUN npm install -g pnpm

COPY . /workspace/

# Install dependencies
RUN pnpm install

EXPOSE 5173

# In development we expose the Vite hot reload port and install all dependencies
FROM base AS development
EXPOSE 24678
CMD [ "pnpm", "dev", "--host" ]

# In production we run the build version of code without hot reload
FROM base AS production
RUN pnpm web build
CMD [ "pnpm", "preview", "--host", "--port=5173" ]
