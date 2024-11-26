# URL Shortener project

## Problem:
Building this because I found it as an interesting system design interview question: 
How would you design a URL shortening service? 

## Solution:
Users should be able to create short URLs and resolve them to their original form.

### Strategy:
- Build service using Node and Redis
- Use consistent hashing
- Use cache invalidation (the two hardest things in computer science is cache invalidation, and naming)
- Use distributed caching
- Use Docker to create multiple instances


### .env (testing only)
```
PORT=3000
REDIS_HOST_1=localhost
REDIS_PORT_1=6379
REDIS_HOST_2=localhost
REDIS_PORT_2=6380
REDIS_HOST_3=localhost
REDIS_PORT_3=6381
```

### Run App:

1. Download/Install [Docker](https://www.docker.com/products/docker-desktop/), [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/), [Node.js](https://nodejs.org/en/download/package-manager)

2. Then run each of these commands to start each
```
(initial command to setup)
> docker run -p 6379:6379 --name redis1 -d redis
> docker run -p 6380:6379 --name redis2 -d redis
> docker run -p 6381:6379 --name redis3 -d redis

(post-initial for testing)
> docker start redis1 redis2 redis3
```

3. Run NPM
```
(install dependencies)
> npm install

(run the app)
> npm start
```

4. Open browser `localhost:3000`
