// Optional: npm run seed — creates a demo login and a starter catalogue.
//   demo@library.com / demo123
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from './models/User.js'
import Book from './models/Book.js'

const BOOKS = [
  ['Clean Code', 'Robert C. Martin', 'Software Engineering', 'Available'],
  ['The Pragmatic Programmer', 'Andrew Hunt', 'Software Engineering', 'Issued'],
  ['Designing Data-Intensive Applications', 'Martin Kleppmann', 'Software Engineering', 'Available'],
  ['Atomic Habits', 'James Clear', 'Self Help', 'Available'],
  ['Deep Work', 'Cal Newport', 'Self Help', 'Issued'],
  ['Sapiens', 'Yuval Noah Harari', 'History', 'Available'],
  ['The Alchemist', 'Paulo Coelho', 'Fiction', 'Available'],
  ['Wings of Fire', 'A. P. J. Abdul Kalam', 'Biography', 'Issued'],
  ['Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 'Available'],
  ['Cosmos', 'Carl Sagan', 'Science', 'Available'],
  ['To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'Available'],
  ['Zero to One', 'Peter Thiel', 'Business', 'Issued'],
]

await mongoose.connect(process.env.MONGO_URI)

let user = await User.findOne({ email: 'demo@library.com' })
if (!user) {
  user = await User.create({ name: 'Demo Librarian', email: 'demo@library.com', password: await bcrypt.hash('demo123', 10) })
  console.log('Created demo user  demo@library.com / demo123')
} else {
  console.log('Demo user already exists')
}

if ((await Book.countDocuments()) === 0) {
  await Book.insertMany(BOOKS.map(([title, author, category, status]) => ({ title, author, category, status, addedBy: user._id })))
  console.log(`Inserted ${BOOKS.length} books`)
} else {
  console.log('Books already exist — skipping')
}

await mongoose.disconnect()
