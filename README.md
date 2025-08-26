# Shelter Donation Inventory System

A comprehensive full-stack web application for managing donation inventory at local shelters. Built with Node.js, Express, MongoDB, and modern HTML/CSS/JavaScript.

## Features

### Core Functionality
- **Donation Management**: Add, view, edit, and delete donations
- **Real-time Statistics**: Dashboard showing total donations, money raised, and estimated values
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All data stored securely in MongoDB database

### Donation Types Supported
- **Money**: Financial donations with amount tracking
- **Food**: Food items with quantity tracking
- **Clothing**: Clothing items with quantity tracking
- **Electronics**: Electronic devices and gadgets
- **Furniture**: Furniture and home items
- **Books**: Books and educational materials
- **Toys**: Toys and games for children
- **Medical Supplies**: Medical and health-related items
- **Hygiene Products**: Personal care and hygiene items
- **Other**: Miscellaneous donations with custom descriptions

### Enhanced Features
- **Estimated Value Tracking**: Optional estimated value for all donation types
- **Contact Information**: Optional email and phone number for donors
- **Smart Forms**: Dynamic form fields based on donation type
- **Type Breakdown**: Visual breakdown of donations by category
- **Enhanced Statistics**: Comprehensive dashboard with multiple metrics

### User Experience Features
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during operations
- **Success/Error Messages**: Clear communication of operation results
- **Keyboard Shortcuts**: Escape to close modals, Ctrl+R to refresh
- **Auto-refresh**: Statistics update automatically after operations

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd shelter-donation-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/shelter-donations
   PORT=3000
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Start your local MongoDB service
   - **MongoDB Atlas**: Use your cloud connection string

5. **Run the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Project Structure
```
shelter-donation-inventory/
├── models/
│   └── Donation.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js 
├── server.js     
├── package.json  
├── env.example   
└── README.md     
```

### Available Scrip
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run install-deps` - Install all dependencies

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | Get all donations |
| POST | `/api/donations` | Create new donation |
| GET | `/api/donations/:id` | Get specific donation |
| PUT | `/api/donations/:id` | Update donation |
| DELETE | `/api/donations/:id` | Delete donation |
| GET | `/api/statistics` | Get donation statistics |

## 🔧 Configuration

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Create database: `shelter-donations`
4. Use connection string: `mongodb://localhost:27017/shelter-donations`

#### MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Update `.env` file with your connection string

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (required)
- `PORT`: Server port (optional, defaults to 3000)
- `NODE_ENV`: Environment mode (optional)

## Usage Guide

### Adding a Donation
1. Fill out the donation form at the top of the page
2. Enter donor name, select type, amount, and date
3. **Optional**: Add estimated value, contact information
4. **For "Other" type**: Provide a description
5. Click "Add Donation" button
6. View success message and updated statistics

### Enhanced Form Features
- **Dynamic Fields**: Description field appears only for "Other" type
- **Contact Information**: Optional email and phone fields
- **Estimated Value**: Track the monetary value of non-cash donations
- **Smart Validation**: Form adapts based on selected donation type

### Editing a Donation
1. Click the "Edit" button on any donation
2. Modify the information in the popup modal
3. All fields are preserved and editable
4. Click "Update Donation" to save changes
5. Modal closes automatically after successful update

### Deleting a Donation
1. Click the "Delete" button on any donation
2. Confirm deletion in the popup dialog
3. Donation is permanently removed from the system

### Refreshing Data
- Click the "Refresh" button to reload all data
- Use keyboard shortcut Ctrl+R or F5
- Statistics update automatically after operations

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Environment Considerations
- Set `NODE_ENV=production` for production
- Use strong MongoDB passwords
- Configure firewall rules appropriately
- Set up SSL/TLS for HTTPS

## The application includes comprehensive error handling and validation:

### Frontend Validation
- Required field validation
- Date range validation (no future dates)
- Amount validation (positive numbers only)
- Donor name length validation
- Description required for "Other" type

### Backend Validation
- MongoDB schema validation
- Server-side data sanitization
- Error handling for all API endpoints
- Database connection error handling
- Enhanced field validation

## Security Features

- **Input Sanitization**: Prevents XSS attacks
- **Data Validation**: Server-side validation of all inputs
- **Error Handling**: Secure error messages without data leakage
- **CORS Configuration**: Proper cross-origin request handling

## Support

If you encounter any issues:

1. Check that MongoDB is running and accessible
2. Verify your connection string in the `.env` file
3. Check the browser console for JavaScript errors
4. Review the server console for backend errors
5. Ensure all dependencies are installed with `npm install`

## Future Enhancements

Potential improvements for the system:
- User authentication and role-based access
- Advanced reporting and analytics
- Export functionality (CSV, PDF)
- Email notifications for large donations
- Integration with payment gateways
- Mobile app development
- Multi-language support
- Donation categories and subcategories
- Donor relationship management

---

