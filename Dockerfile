FROM node:lts-alpine

WORKDIR /workspace

# Setup corepack with version of pnpm specified in package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /workspace/
RUN corepack enable && \
    corepack prepare && \
    pnpm config set store-dir /tmp/cache/pnpm

# Fetch build and runtime dependencies
RUN --mount=type=cache,target=/tmp/cache \
    pnpm fetch --workspace-root

COPY . /workspace/

# Install dependencies cached above
RUN --mount=type=cache,target=/tmp/cache \
    pnpm install -r --offline

EXPOSE 5173
EXPOSE 24678
CMD [ "pnpm", "web", "dev", "--host" ]
