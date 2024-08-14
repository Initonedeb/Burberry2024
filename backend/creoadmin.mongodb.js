// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Create a new document in the collection.
db.getCollection('users').insertOne({
    username: "admin",
    email: "admin@example.com",
    password: "$2a$10$Q7jBH3w1GVXI2YbfibtBHepc6fR79DEWSgJ2BTl08SIxQvdrbkGia",
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date()
});