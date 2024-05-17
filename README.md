Blogging API

Overview

This project is a Blogging API that allows users to create, read, update, and delete blog posts. The API supports user authentication, pagination, filtering, and ordering of blog posts. Users can sign up, sign in, and manage their blogs, which can be in draft or published states.

Features

User authentication and authorization using JWT.
CRUD operations for blog posts.
Blog posts can be in two states: draft and published.
Public endpoints to view published blogs.
Pagination, filtering, and ordering of blog posts.
Read count tracking for blog posts.
Search functionality for blog posts by author, title, and tags.
Calculated reading time for each blog post.
Detailed logging using Winston.
Testing for all endpoints.

Requirements

User Attributes
first_name: String, required
last_name: String, required
email: String, required, unique
password: String, required
Blog/Article Attributes
title: String, required, unique
description: String
author: User reference
state: Enum, [draft, published]
read_count: Number, default 0
reading_time: Number
tags: Array of strings
body: String, required
timestamp: Date, default current date and time

Endpoints

User Endpoints

POST /signup: Register a new user.
POST /signin: Authenticate a user and return a JWT.
Blog Endpoints
GET /blogs: Get a list of published blogs. Supports pagination, filtering, and ordering.
GET /blogs/:id: Get a specific published blog and increment its read count.
POST /blogs: Create a new blog post in draft state. (Requires authentication)
PUT /blogs/:id: Update a blog post. (Requires authentication)
DELETE /blogs/:id: Delete a blog post. (Requires authentication)
PATCH /blogs/:id/publish: Publish a blog post. (Requires authentication)
GET /users/:id/blogs: Get a list of blogs by a specific user. (Requires authentication)
Authentication
Use JWT tokens for authentication.
Token expiry: 1 hour.
Pagination and Filtering
Default pagination: 20 blogs per page.
Filterable by state (draft, published).
Searchable by author, title, and tags.
Orderable by read_count, reading_time, and timestamp.
Logging
Use Winston for logging all functions and processes.
Tests
Comprehensive tests for all endpoints.
Database
MongoDB for storing user and blog data.


Usage

Sign up and sign in to get a JWT token.
Use the token to authenticate for creating, updating, or deleting blogs.
Access public endpoints to view published blogs without authentication.


Contact

For any inquiries or issues, please contact [adarecollins@gmail.com]
