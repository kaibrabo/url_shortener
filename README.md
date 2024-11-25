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
