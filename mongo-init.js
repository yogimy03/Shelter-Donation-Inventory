// MongoDB initialization script for Docker setup
// This script runs when the MongoDB container starts for the first time

// Switch to the shelter-donations database
db = db.getSiblingDB('shelter-donations');

// Create a user for the application
db.createUser({
    user: 'shelter_user',
    pwd: 'shelter_password',
    roles: [
        {
            role: 'readWrite',
            db: 'shelter-donations'
        }
    ]
});

// Create the donations collection with some sample data
db.createCollection('donations');

// Insert sample donation data for demonstration
db.donations.insertMany([
    {
        donorName: "John Smith",
        type: "money",
        amount: 100.00,
        estimatedValue: 100.00,
        contactEmail: "john.smith@email.com",
        contactPhone: "555-0101",
        date: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Sarah Johnson",
        type: "food",
        amount: 25,
        estimatedValue: 75.00,
        contactEmail: "sarah.j@email.com",
        date: new Date("2024-01-16"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Mike Davis",
        type: "clothing",
        amount: 10,
        estimatedValue: 150.00,
        contactPhone: "555-0202",
        date: new Date("2024-01-17"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Emily Wilson",
        type: "electronics",
        amount: 3,
        estimatedValue: 300.00,
        description: "Used laptops and tablets",
        contactEmail: "emily.w@email.com",
        contactPhone: "555-0303",
        date: new Date("2024-01-18"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Robert Brown",
        type: "furniture",
        amount: 5,
        estimatedValue: 500.00,
        description: "Office chairs and desks",
        contactEmail: "robert.b@email.com",
        date: new Date("2024-01-19"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Lisa Garcia",
        type: "books",
        amount: 50,
        estimatedValue: 200.00,
        description: "Children's books and textbooks",
        contactEmail: "lisa.g@email.com",
        contactPhone: "555-0404",
        date: new Date("2024-01-20"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "David Miller",
        type: "toys",
        amount: 15,
        estimatedValue: 120.00,
        description: "Educational toys and games",
        contactPhone: "555-0505",
        date: new Date("2024-01-21"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Jennifer Taylor",
        type: "medical",
        amount: 8,
        estimatedValue: 80.00,
        description: "First aid kits and bandages",
        contactEmail: "jennifer.t@email.com",
        date: new Date("2024-01-22"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Thomas Anderson",
        type: "hygiene",
        amount: 20,
        estimatedValue: 60.00,
        description: "Soap, shampoo, and toothpaste",
        contactEmail: "thomas.a@email.com",
        contactPhone: "555-0606",
        date: new Date("2024-01-23"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        donorName: "Maria Rodriguez",
        type: "other",
        amount: 1,
        estimatedValue: 1000.00,
        description: "Professional kitchen equipment",
        contactEmail: "maria.r@email.com",
        contactPhone: "555-0707",
        date: new Date("2024-01-24"),
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

db.donations.createIndex({ type: 1, date: -1 });
db.donations.createIndex({ donorName: 'text', description: 'text' });

print("MongoDB initialization completed successfully!");
print("Sample data inserted into shelter-donations database");
print("10 sample donations with various types and contact information have been added");
