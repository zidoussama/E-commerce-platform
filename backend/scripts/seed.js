const mongoose = require('mongoose');
const Product = require('../src/models/product');
const Category = require('../src/models/Category');
const User = require('../src/models/User');
const Comment = require('../src/models/Comment');
const Likes = require('../src/models/likes');
const Order = require('../src/models/Order');
const Cart = require('../src/models/Cart');
const config = require('config');

// Connect to MongoDB
const mongo_url = process.env.MONGO_URI;
mongoose.set("strictQuery", true);
mongoose.connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample products data
const sampleProducts = [];

// Function to generate products for a category
function generateProductsForCategory(categoryName, productTemplates, hasSizes = false) {
  productTemplates.forEach((template, index) => {
    const product = {
      name: template.name,
      description: template.description,
      price: template.price,
      categoryName,
      stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
      image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(template.name)}`,
      size: hasSizes ? template.sizes : []
    };
    sampleProducts.push(product);
  });
}

// Electronics products
const electronicsProducts = [
  { name: "Wireless Headphones", description: "High-quality wireless headphones with noise cancellation.", price: 99.99, sizes: [] },
  { name: "Bluetooth Speaker", description: "Portable Bluetooth speaker with excellent sound quality.", price: 49.99, sizes: [] },
  { name: "Smartphone", description: "Latest smartphone with advanced features.", price: 699.99, sizes: [] },
  { name: "Laptop", description: "Powerful laptop for work and gaming.", price: 1299.99, sizes: [] },
  { name: "Tablet", description: "Versatile tablet for entertainment and productivity.", price: 399.99, sizes: [] },
  { name: "Smartwatch", description: "Fitness tracking smartwatch.", price: 249.99, sizes: [] },
  { name: "Wireless Mouse", description: "Ergonomic wireless mouse.", price: 29.99, sizes: [] },
  { name: "Mechanical Keyboard", description: "RGB mechanical keyboard for gaming.", price: 149.99, sizes: [] },
  { name: "Monitor", description: "4K UHD monitor for professional use.", price: 499.99, sizes: [] },
  { name: "Printer", description: "All-in-one wireless printer.", price: 199.99, sizes: [] },
  { name: "Router", description: "High-speed WiFi router.", price: 89.99, sizes: [] },
  { name: "External Hard Drive", description: "2TB external hard drive.", price: 79.99, sizes: [] },
  { name: "Webcam", description: "HD webcam for video calls.", price: 59.99, sizes: [] },
  { name: "Microphone", description: "USB condenser microphone.", price: 99.99, sizes: [] },
  { name: "Graphics Card", description: "High-performance graphics card.", price: 599.99, sizes: [] },
  { name: "Power Bank", description: "Portable power bank.", price: 39.99, sizes: [] },
  { name: "Smart TV", description: "55-inch 4K smart TV.", price: 799.99, sizes: [] },
  { name: "Earbuds", description: "True wireless earbuds.", price: 79.99, sizes: [] },
  { name: "Drone", description: "Camera drone for aerial photography.", price: 499.99, sizes: [] },
  { name: "VR Headset", description: "Virtual reality headset.", price: 349.99, sizes: [] },
  { name: "Smart Home Hub", description: "Voice-controlled smart home device.", price: 129.99, sizes: [] },
  { name: "Fitness Tracker", description: "Wearable fitness tracker.", price: 99.99, sizes: [] },
  { name: "Projector", description: "Portable mini projector.", price: 299.99, sizes: [] },
  { name: "Dash Cam", description: "Car dashboard camera.", price: 69.99, sizes: [] },
  { name: "Bluetooth Headset", description: "Hands-free Bluetooth headset.", price: 49.99, sizes: [] },
  { name: "Gaming Console", description: "Latest gaming console.", price: 499.99, sizes: [] },
  { name: "Streaming Device", description: "Media streaming device.", price: 39.99, sizes: [] },
  { name: "Wireless Charger", description: "Fast wireless charger.", price: 24.99, sizes: [] },
  { name: "Security Camera", description: "Wireless security camera.", price: 89.99, sizes: [] },
  { name: "Robot Vacuum", description: "Smart robot vacuum cleaner.", price: 299.99, sizes: [] }
];

generateProductsForCategory("Electronics", electronicsProducts);

// Clothing products
const clothingProducts = [
  { name: "Cotton T-Shirt", description: "Comfortable cotton t-shirt.", price: 19.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Denim Jeans", description: "Classic denim jeans.", price: 49.99, sizes: ["28", "30", "32", "34", "36"] },
  { name: "Hoodie", description: "Warm and cozy hoodie.", price: 39.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Summer Dress", description: "Light summer dress.", price: 29.99, sizes: ["XS", "S", "M", "L"] },
  { name: "Running Shoes", description: "Comfortable running shoes.", price: 89.99, sizes: ["7", "8", "9", "10", "11", "12"] },
  { name: "Winter Jacket", description: "Insulated winter jacket.", price: 99.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Baseball Cap", description: "Adjustable baseball cap.", price: 14.99, sizes: ["One Size"] },
  { name: "Socks Pack", description: "Pack of comfortable socks.", price: 9.99, sizes: ["S", "M", "L"] },
  { name: "Blouse", description: "Elegant blouse.", price: 34.99, sizes: ["XS", "S", "M", "L"] },
  { name: "Cargo Pants", description: "Durable cargo pants.", price: 59.99, sizes: ["30", "32", "34", "36"] },
  { name: "Sweater", description: "Wool blend sweater.", price: 44.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Skirt", description: "Flowy skirt.", price: 24.99, sizes: ["XS", "S", "M", "L"] },
  { name: "Sneakers", description: "Casual sneakers.", price: 69.99, sizes: ["6", "7", "8", "9", "10"] },
  { name: "Leather Boots", description: "Stylish leather boots.", price: 119.99, sizes: ["6", "7", "8", "9", "10"] },
  { name: "Polo Shirt", description: "Classic polo shirt.", price: 24.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Shorts", description: "Comfortable shorts.", price: 19.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Cardigan", description: "Light cardigan.", price: 39.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Leggings", description: "Stretchy leggings.", price: 29.99, sizes: ["XS", "S", "M", "L"] },
  { name: "Beanie", description: "Warm beanie hat.", price: 12.99, sizes: ["One Size"] },
  { name: "Scarf", description: "Soft scarf.", price: 16.99, sizes: ["One Size"] },
  { name: "Tank Top", description: "Breathable tank top.", price: 14.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Jumpsuit", description: "Stylish jumpsuit.", price: 49.99, sizes: ["XS", "S", "M", "L"] },
  { name: "Vest", description: "Casual vest.", price: 34.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Belt", description: "Leather belt.", price: 19.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Gloves", description: "Warm gloves.", price: 14.99, sizes: ["S", "M", "L"] },
  { name: "Swim Trunks", description: "Quick-dry swim trunks.", price: 24.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Rain Jacket", description: "Waterproof rain jacket.", price: 79.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Turtleneck", description: "Classic turtleneck sweater.", price: 39.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Overalls", description: "Durable overalls.", price: 54.99, sizes: ["S", "M", "L", "XL"] },
  { name: "Poncho", description: "Lightweight poncho.", price: 29.99, sizes: ["One Size"] }
];

generateProductsForCategory("Clothing", clothingProducts, true);

// Books products
const booksProducts = [
  { name: "JavaScript Guide", description: "Comprehensive guide to JavaScript programming.", price: 29.99, sizes: [] },
  { name: "Python Handbook", description: "Complete Python programming handbook.", price: 34.99, sizes: [] },
  { name: "Mystery Novel", description: "Thrilling mystery novel.", price: 14.99, sizes: [] },
  { name: "Science Fiction Epic", description: "Epic science fiction adventure.", price: 19.99, sizes: [] },
  { name: "Cookbook", description: "Delicious recipes cookbook.", price: 24.99, sizes: [] },
  { name: "History of Technology", description: "Fascinating history of technology.", price: 39.99, sizes: [] },
  { name: "Romance Novel", description: "Heartwarming romance story.", price: 12.99, sizes: [] },
  { name: "Business Strategy", description: "Essential business strategy guide.", price: 44.99, sizes: [] },
  { name: "Children's Fairy Tales", description: "Collection of classic fairy tales.", price: 16.99, sizes: [] },
  { name: "Photography Guide", description: "Professional photography techniques.", price: 49.99, sizes: [] },
  { name: "Health and Wellness", description: "Guide to healthy living.", price: 22.99, sizes: [] },
  { name: "Travel Guide", description: "Ultimate travel guide.", price: 19.99, sizes: [] },
  { name: "Art History", description: "Comprehensive art history book.", price: 54.99, sizes: [] },
  { name: "Self-Help Book", description: "Motivational self-help guide.", price: 17.99, sizes: [] },
  { name: "Biography", description: "Inspiring biography.", price: 26.99, sizes: [] },
  { name: "Poetry Collection", description: "Beautiful poetry collection.", price: 13.99, sizes: [] },
  { name: "Mathematics Textbook", description: "Advanced mathematics textbook.", price: 69.99, sizes: [] },
  { name: "Gardening Guide", description: "Complete gardening handbook.", price: 21.99, sizes: [] },
  { name: "Fantasy Adventure", description: "Epic fantasy adventure.", price: 18.99, sizes: [] },
  { name: "Language Learning", description: "Learn a new language quickly.", price: 29.99, sizes: [] },
  { name: "Comic Book", description: "Exciting comic book series.", price: 9.99, sizes: [] },
  { name: "Philosophy Essays", description: "Thought-provoking philosophy essays.", price: 31.99, sizes: [] },
  { name: "Sports History", description: "History of major sports.", price: 27.99, sizes: [] },
  { name: "Music Theory", description: "Fundamentals of music theory.", price: 36.99, sizes: [] },
  { name: "Environmental Science", description: "Understanding environmental issues.", price: 41.99, sizes: [] },
  { name: "Psychology Basics", description: "Introduction to psychology.", price: 33.99, sizes: [] },
  { name: "Cooking for Beginners", description: "Easy recipes for beginners.", price: 19.99, sizes: [] },
  { name: "Astronomy Guide", description: "Explore the universe.", price: 38.99, sizes: [] },
  { name: "Meditation Handbook", description: "Guide to meditation practices.", price: 23.99, sizes: [] },
  { name: "Economic Principles", description: "Understanding economics.", price: 45.99, sizes: [] }
];

generateProductsForCategory("Books", booksProducts);

// Home & Kitchen products
const homeKitchenProducts = [
  { name: "Blender", description: "Powerful kitchen blender.", price: 79.99, sizes: [] },
  { name: "Coffee Maker", description: "Automatic coffee maker.", price: 59.99, sizes: [] },
  { name: "Toaster", description: "4-slice toaster.", price: 34.99, sizes: [] },
  { name: "Microwave Oven", description: "Compact microwave oven.", price: 89.99, sizes: [] },
  { name: "Refrigerator", description: "Energy-efficient refrigerator.", price: 799.99, sizes: [] },
  { name: "Dishwasher", description: "Quiet dishwasher.", price: 499.99, sizes: [] },
  { name: "Washing Machine", description: "Front-load washing machine.", price: 699.99, sizes: [] },
  { name: "Vacuum Cleaner", description: "Powerful vacuum cleaner.", price: 149.99, sizes: [] },
  { name: "Air Fryer", description: "Healthy air fryer.", price: 99.99, sizes: [] },
  { name: "Slow Cooker", description: "Programmable slow cooker.", price: 49.99, sizes: [] },
  { name: "Pressure Cooker", description: "Electric pressure cooker.", price: 79.99, sizes: [] },
  { name: "Food Processor", description: "Multi-function food processor.", price: 119.99, sizes: [] },
  { name: "Stand Mixer", description: "Heavy-duty stand mixer.", price: 299.99, sizes: [] },
  { name: "Rice Cooker", description: "Automatic rice cooker.", price: 39.99, sizes: [] },
  { name: "Bread Maker", description: "Automatic bread maker.", price: 89.99, sizes: [] },
  { name: "Juicer", description: "Electric juicer.", price: 69.99, sizes: [] },
  { name: "Grill", description: "Indoor electric grill.", price: 59.99, sizes: [] },
  { name: "Oven", description: "Convection oven.", price: 399.99, sizes: [] },
  { name: "Cookware Set", description: "Non-stick cookware set.", price: 149.99, sizes: [] },
  { name: "Dinnerware Set", description: "Porcelain dinnerware set.", price: 79.99, sizes: [] },
  { name: "Cutlery Set", description: "Stainless steel cutlery.", price: 49.99, sizes: [] },
  { name: "Glassware Set", description: "Crystal glassware.", price: 69.99, sizes: [] },
  { name: "Bedding Set", description: "Comfortable bedding set.", price: 99.99, sizes: [] },
  { name: "Towels Set", description: "Absorbent towel set.", price: 39.99, sizes: [] },
  { name: "Curtains", description: "Decorative window curtains.", price: 29.99, sizes: [] },
  { name: "Rug", description: "Soft area rug.", price: 89.99, sizes: [] },
  { name: "Lamp", description: "Modern table lamp.", price: 49.99, sizes: [] },
  { name: "Chair", description: "Comfortable dining chair.", price: 79.99, sizes: [] },
  { name: "Sofa", description: "Cozy living room sofa.", price: 599.99, sizes: [] },
  { name: "Bookshelf", description: "Wooden bookshelf.", price: 149.99, sizes: [] }
];

generateProductsForCategory("Home & Kitchen", homeKitchenProducts);

// Sports products
const sportsProducts = [
  { name: "Basketball", description: "Official size basketball.", price: 24.99, sizes: [] },
  { name: "Soccer Ball", description: "Professional soccer ball.", price: 29.99, sizes: [] },
  { name: "Tennis Racket", description: "Lightweight tennis racket.", price: 89.99, sizes: [] },
  { name: "Golf Clubs Set", description: "Complete golf clubs set.", price: 499.99, sizes: [] },
  { name: "Yoga Mat", description: "Non-slip yoga mat.", price: 19.99, sizes: [] },
  { name: "Dumbbells", description: "Adjustable dumbbells.", price: 79.99, sizes: [] },
  { name: "Treadmill", description: "Electric treadmill.", price: 899.99, sizes: [] },
  { name: "Exercise Bike", description: "Stationary exercise bike.", price: 399.99, sizes: [] },
  { name: "Swimming Goggles", description: "Anti-fog swimming goggles.", price: 14.99, sizes: [] },
  { name: "Baseball Glove", description: "Leather baseball glove.", price: 49.99, sizes: [] },
  { name: "Hockey Stick", description: "Composite hockey stick.", price: 79.99, sizes: [] },
  { name: "Volleyball", description: "Official volleyball.", price: 19.99, sizes: [] },
  { name: "Badminton Racket", description: "Carbon fiber badminton racket.", price: 59.99, sizes: [] },
  { name: "Bowling Ball", description: "Professional bowling ball.", price: 149.99, sizes: [] },
  { name: "Boxing Gloves", description: "Training boxing gloves.", price: 39.99, sizes: [] },
  { name: "Cycling Helmet", description: "Safety cycling helmet.", price: 49.99, sizes: [] },
  { name: "Skateboard", description: "Professional skateboard.", price: 89.99, sizes: [] },
  { name: "Surfboard", description: "Beginner surfboard.", price: 299.99, sizes: [] },
  { name: "Fishing Rod", description: "Spinning fishing rod.", price: 69.99, sizes: [] },
  { name: "Camping Tent", description: "4-person camping tent.", price: 119.99, sizes: [] },
  { name: "Sleeping Bag", description: "Warm sleeping bag.", price: 59.99, sizes: [] },
  { name: "Hiking Boots", description: "Durable hiking boots.", price: 99.99, sizes: [] },
  { name: "Ski Jacket", description: "Waterproof ski jacket.", price: 149.99, sizes: [] },
  { name: "Snowboard", description: "All-mountain snowboard.", price: 349.99, sizes: [] },
  { name: "Martial Arts Gi", description: "Traditional martial arts uniform.", price: 49.99, sizes: [] },
  { name: "Resistance Bands", description: "Set of resistance bands.", price: 24.99, sizes: [] },
  { name: "Foam Roller", description: "Muscle recovery foam roller.", price: 19.99, sizes: [] },
  { name: "Jump Rope", description: "Speed jump rope.", price: 9.99, sizes: [] },
  { name: "Medicine Ball", description: "Weighted medicine ball.", price: 34.99, sizes: [] },
  { name: "Pull-up Bar", description: "Doorway pull-up bar.", price: 29.99, sizes: [] }
];

generateProductsForCategory("Sports", sportsProducts);

// Beauty products
const beautyProducts = [
  { name: "Lipstick", description: "Long-lasting lipstick.", price: 12.99, sizes: [] },
  { name: "Foundation", description: "Liquid foundation.", price: 24.99, sizes: [] },
  { name: "Mascara", description: "Volumizing mascara.", price: 14.99, sizes: [] },
  { name: "Shampoo", description: "Nourishing shampoo.", price: 9.99, sizes: [] },
  { name: "Conditioner", description: "Moisturizing conditioner.", price: 9.99, sizes: [] },
  { name: "Face Cream", description: "Anti-aging face cream.", price: 29.99, sizes: [] },
  { name: "Perfume", description: "Elegant perfume.", price: 49.99, sizes: [] },
  { name: "Nail Polish", description: "Quick-dry nail polish.", price: 7.99, sizes: [] },
  { name: "Hair Dryer", description: "Professional hair dryer.", price: 59.99, sizes: [] },
  { name: "Straightener", description: "Ceramic hair straightener.", price: 39.99, sizes: [] },
  { name: "Curling Iron", description: "Tourmaline curling iron.", price: 34.99, sizes: [] },
  { name: "Makeup Brush Set", description: "Professional makeup brushes.", price: 24.99, sizes: [] },
  { name: "Sunscreen", description: "SPF 50 sunscreen.", price: 16.99, sizes: [] },
  { name: "Body Lotion", description: "Hydrating body lotion.", price: 11.99, sizes: [] },
  { name: "Deodorant", description: "Long-lasting deodorant.", price: 6.99, sizes: [] },
  { name: "Razor", description: "Precision razor.", price: 8.99, sizes: [] },
  { name: "Shaving Cream", description: "Smoothing shaving cream.", price: 5.99, sizes: [] },
  { name: "Facial Cleanser", description: "Gentle facial cleanser.", price: 14.99, sizes: [] },
  { name: "Toner", description: "Balancing facial toner.", price: 12.99, sizes: [] },
  { name: "Moisturizer", description: "Daily moisturizer.", price: 19.99, sizes: [] },
  { name: "Eye Cream", description: "Anti-wrinkle eye cream.", price: 22.99, sizes: [] },
  { name: "Lip Balm", description: "Moisturizing lip balm.", price: 4.99, sizes: [] },
  { name: "Hair Mask", description: "Deep conditioning hair mask.", price: 15.99, sizes: [] },
  { name: "Body Scrub", description: "Exfoliating body scrub.", price: 13.99, sizes: [] },
  { name: "Hand Soap", description: "Antibacterial hand soap.", price: 3.99, sizes: [] },
  { name: "Bath Bomb", description: "Relaxing bath bomb.", price: 6.99, sizes: [] },
  { name: "Essential Oils", description: "Lavender essential oil.", price: 9.99, sizes: [] },
  { name: "Face Mask", description: "Hydrating face mask.", price: 8.99, sizes: [] },
  { name: "Hair Extensions", description: "Clip-in hair extensions.", price: 29.99, sizes: [] },
  { name: "Nail Clippers", description: "Precision nail clippers.", price: 5.99, sizes: [] }
];

generateProductsForCategory("Beauty", beautyProducts);

// Toys products
const toysProducts = [
  { name: "Lego Set", description: "Creative building blocks.", price: 39.99, sizes: [] },
  { name: "Teddy Bear", description: "Soft and cuddly teddy bear.", price: 19.99, sizes: [] },
  { name: "Puzzle", description: "1000-piece jigsaw puzzle.", price: 14.99, sizes: [] },
  { name: "Board Game", description: "Family board game.", price: 24.99, sizes: [] },
  { name: "Action Figure", description: "Superhero action figure.", price: 12.99, sizes: [] },
  { name: "Doll", description: "Fashion doll.", price: 16.99, sizes: [] },
  { name: "Remote Control Car", description: "Fast RC car.", price: 49.99, sizes: [] },
  { name: "Building Blocks", description: "Colorful building blocks.", price: 29.99, sizes: [] },
  { name: "Stuffed Animal", description: "Plush stuffed animal.", price: 14.99, sizes: [] },
  { name: "Toy Train Set", description: "Electric toy train set.", price: 79.99, sizes: [] },
  { name: "Art Supplies", description: "Kids art set.", price: 19.99, sizes: [] },
  { name: "Musical Instrument", description: "Kids guitar.", price: 34.99, sizes: [] },
  { name: "Bike", description: "Children's bicycle.", price: 149.99, sizes: [] },
  { name: "Scooter", description: "Foldable kick scooter.", price: 39.99, sizes: [] },
  { name: "Play Kitchen", description: "Pretend play kitchen.", price: 89.99, sizes: [] },
  { name: "Doctor Kit", description: "Medical play set.", price: 24.99, sizes: [] },
  { name: "Science Kit", description: "Educational science experiment kit.", price: 29.99, sizes: [] },
  { name: "Craft Kit", description: "DIY craft kit.", price: 16.99, sizes: [] },
  { name: "Ball Pit", description: "Inflatable ball pit.", price: 59.99, sizes: [] },
  { name: "Ride-on Toy", description: "Plastic ride-on car.", price: 69.99, sizes: [] },
  { name: "Puzzle Cube", description: "Rubik's cube.", price: 9.99, sizes: [] },
  { name: "Card Game", description: "Trading card game.", price: 11.99, sizes: [] },
  { name: "Water Toys", description: "Pool toys set.", price: 19.99, sizes: [] },
  { name: "Sand Toys", description: "Beach sand toys.", price: 14.99, sizes: [] },
  { name: "Educational Tablet", description: "Kids learning tablet.", price: 49.99, sizes: [] },
  { name: "Plush Toy", description: "Giant plush toy.", price: 24.99, sizes: [] },
  { name: "Yo-yo", description: "Professional yo-yo.", price: 7.99, sizes: [] },
  { name: "Kite", description: "Easy-fly kite.", price: 12.99, sizes: [] },
  { name: "Magic Kit", description: "Beginner magic set.", price: 21.99, sizes: [] },
  { name: "Robot Toy", description: "Interactive robot.", price: 39.99, sizes: [] }
];

generateProductsForCategory("Toys", toysProducts);

// Automotive products
const automotiveProducts = [
  { name: "Car Tires", description: "Durable car tires.", price: 149.99, sizes: [] },
  { name: "Car Wax", description: "Protective car wax.", price: 14.99, sizes: [] },
  { name: "Oil Filter", description: "High-quality oil filter.", price: 9.99, sizes: [] },
  { name: "Brake Pads", description: "Ceramic brake pads.", price: 49.99, sizes: [] },
  { name: "Car Battery", description: "Long-lasting car battery.", price: 89.99, sizes: [] },
  { name: "Windshield Wipers", description: "All-season wipers.", price: 19.99, sizes: [] },
  { name: "Car Air Freshener", description: "Long-lasting air freshener.", price: 4.99, sizes: [] },
  { name: "Seat Covers", description: "Universal seat covers.", price: 39.99, sizes: [] },
  { name: "Floor Mats", description: "All-weather floor mats.", price: 29.99, sizes: [] },
  { name: "Car Wash Kit", description: "Complete car wash kit.", price: 24.99, sizes: [] },
  { name: "Jump Starter", description: "Portable jump starter.", price: 59.99, sizes: [] },
  { name: "Tire Pressure Gauge", description: "Digital tire gauge.", price: 12.99, sizes: [] },
  { name: "Car Vacuum", description: "Handheld car vacuum.", price: 34.99, sizes: [] },
  { name: "GPS Navigator", description: "Portable GPS device.", price: 79.99, sizes: [] },
  { name: "Car Stereo", description: "Bluetooth car stereo.", price: 99.99, sizes: [] },
  { name: "Backup Camera", description: "Wireless backup camera.", price: 69.99, sizes: [] },
  { name: "Car Cover", description: "Weatherproof car cover.", price: 49.99, sizes: [] },
  { name: "Engine Oil", description: "Synthetic engine oil.", price: 24.99, sizes: [] },
  { name: "Antifreeze", description: "Coolant antifreeze.", price: 16.99, sizes: [] },
  { name: "Spark Plugs", description: "Iridium spark plugs.", price: 19.99, sizes: [] },
  { name: "Fuel Injector Cleaner", description: "Fuel system cleaner.", price: 14.99, sizes: [] },
  { name: "Transmission Fluid", description: "Automatic transmission fluid.", price: 21.99, sizes: [] },
  { name: "Radiator Hose", description: "Durable radiator hose.", price: 29.99, sizes: [] },
  { name: "Belts", description: "Serpentine belt.", price: 24.99, sizes: [] },
  { name: "Shock Absorbers", description: "Performance shock absorbers.", price: 89.99, sizes: [] },
  { name: "Exhaust System", description: "Performance exhaust.", price: 199.99, sizes: [] },
  { name: "Suspension Kit", description: "Lowering suspension kit.", price: 299.99, sizes: [] },
  { name: "Wheels", description: "Alloy wheels set.", price: 399.99, sizes: [] },
  { name: "Tire Chains", description: "Snow tire chains.", price: 39.99, sizes: [] },
  { name: "Emergency Kit", description: "Roadside emergency kit.", price: 49.99, sizes: [] }
];

generateProductsForCategory("Automotive", automotiveProducts);

// Health products
const healthProducts = [
  { name: "Vitamins", description: "Daily multivitamins.", price: 19.99, sizes: [] },
  { name: "Blood Pressure Monitor", description: "Digital blood pressure monitor.", price: 49.99, sizes: [] },
  { name: "Thermometer", description: "Digital thermometer.", price: 9.99, sizes: [] },
  { name: "First Aid Kit", description: "Comprehensive first aid kit.", price: 29.99, sizes: [] },
  { name: "Massage Gun", description: "Percussion massage gun.", price: 79.99, sizes: [] },
  { name: "Fitness Scale", description: "Smart body scale.", price: 39.99, sizes: [] },
  { name: "Protein Powder", description: "Whey protein powder.", price: 34.99, sizes: [] },
  { name: "Herbal Supplements", description: "Natural herbal supplements.", price: 24.99, sizes: [] },
  { name: "Pain Relief Cream", description: "Topical pain relief.", price: 14.99, sizes: [] },
  { name: "Sleep Aid", description: "Natural sleep supplement.", price: 16.99, sizes: [] },
  { name: "Immune Support", description: "Immune boosting vitamins.", price: 21.99, sizes: [] },
  { name: "Joint Support", description: "Glucosamine joint supplement.", price: 26.99, sizes: [] },
  { name: "Digestive Enzymes", description: "Digestive health enzymes.", price: 19.99, sizes: [] },
  { name: "Probiotics", description: "Daily probiotic capsules.", price: 22.99, sizes: [] },
  { name: "Omega-3", description: "Fish oil omega-3 supplement.", price: 17.99, sizes: [] },
  { name: "Calcium Supplement", description: "Bone health calcium.", price: 12.99, sizes: [] },
  { name: "Iron Supplement", description: "Iron deficiency supplement.", price: 11.99, sizes: [] },
  { name: "Vitamin C", description: "Immune support vitamin C.", price: 9.99, sizes: [] },
  { name: "Vitamin D", description: "Sunshine vitamin D.", price: 13.99, sizes: [] },
  { name: "Magnesium", description: "Relaxation magnesium.", price: 15.99, sizes: [] },
  { name: "B-Complex", description: "Energy B-complex vitamins.", price: 18.99, sizes: [] },
  { name: "Collagen Powder", description: "Beauty collagen supplement.", price: 29.99, sizes: [] },
  { name: "Antioxidant Blend", description: "Antioxidant vitamin blend.", price: 23.99, sizes: [] },
  { name: "Electrolyte Powder", description: "Hydration electrolyte mix.", price: 14.99, sizes: [] },
  { name: "Melatonin", description: "Sleep support melatonin.", price: 8.99, sizes: [] },
  { name: "CBD Oil", description: "Relaxation CBD oil.", price: 39.99, sizes: [] },
  { name: "Aromatherapy Diffuser", description: "Essential oil diffuser.", price: 34.99, sizes: [] },
  { name: "Acupressure Mat", description: "Relaxation acupressure mat.", price: 49.99, sizes: [] },
  { name: "Foam Roller", description: "Muscle recovery roller.", price: 24.99, sizes: [] },
  { name: "Resistance Bands", description: "Therapy resistance bands.", price: 19.99, sizes: [] }
];

generateProductsForCategory("Health", healthProducts);

// Food products
const foodProducts = [
  { name: "Organic Apples", description: "Fresh organic apples.", price: 4.99, sizes: [] },
  { name: "Chocolate Bar", description: "Delicious milk chocolate bar.", price: 2.99, sizes: [] },
  { name: "Coffee Beans", description: "Premium coffee beans.", price: 14.99, sizes: [] },
  { name: "Tea Bags", description: "Herbal tea assortment.", price: 6.99, sizes: [] },
  { name: "Granola Bars", description: "Healthy granola bars.", price: 5.99, sizes: [] },
  { name: "Almonds", description: "Raw almonds.", price: 8.99, sizes: [] },
  { name: "Olive Oil", description: "Extra virgin olive oil.", price: 12.99, sizes: [] },
  { name: "Pasta", description: "Organic pasta.", price: 3.99, sizes: [] },
  { name: "Rice", description: "Basmati rice.", price: 4.99, sizes: [] },
  { name: "Cereal", description: "Whole grain cereal.", price: 4.49, sizes: [] },
  { name: "Honey", description: "Pure honey.", price: 7.99, sizes: [] },
  { name: "Spices", description: "Mixed spice blend.", price: 5.99, sizes: [] },
  { name: "Canned Tomatoes", description: "Diced tomatoes.", price: 2.49, sizes: [] },
  { name: "Peanut Butter", description: "Natural peanut butter.", price: 3.99, sizes: [] },
  { name: "Yogurt", description: "Greek yogurt.", price: 4.99, sizes: [] },
  { name: "Cheese", description: "Aged cheddar cheese.", price: 6.99, sizes: [] },
  { name: "Bread", description: "Whole wheat bread.", price: 3.49, sizes: [] },
  { name: "Eggs", description: "Free-range eggs.", price: 5.99, sizes: [] },
  { name: "Milk", description: "Organic milk.", price: 3.99, sizes: [] },
  { name: "Butter", description: "Grass-fed butter.", price: 4.99, sizes: [] },
  { name: "Flour", description: "All-purpose flour.", price: 2.99, sizes: [] },
  { name: "Sugar", description: "Organic cane sugar.", price: 3.49, sizes: [] },
  { name: "Salt", description: "Sea salt.", price: 2.99, sizes: [] },
  { name: "Vinegar", description: "Apple cider vinegar.", price: 4.99, sizes: [] },
  { name: "Jam", description: "Strawberry jam.", price: 4.49, sizes: [] },
  { name: "Nuts Mix", description: "Trail mix.", price: 6.99, sizes: [] },
  { name: "Dried Fruits", description: "Mixed dried fruits.", price: 7.99, sizes: [] },
  { name: "Protein Bars", description: "High-protein bars.", price: 6.99, sizes: [] },
  { name: "Smoothie Mix", description: "Fruit smoothie powder.", price: 9.99, sizes: [] },
  { name: "Energy Drink", description: "Natural energy drink.", price: 2.49, sizes: [] }
];

generateProductsForCategory("Food", foodProducts);

// Categories derived from sample products
const sampleCategories = [...new Set(sampleProducts.map((product) => product.categoryName))]
  .map((name) => ({ name }));

// Sample users data
const sampleUsers = [
  {
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    password: "admin123", // Will be hashed by the model
    phonenumber: "1234567890",
    role: "admin",
    address: "123 Admin St, Admin City, AC 12345"
  },
  {
    firstname: "John",
    lastname: "Doe",
    email: "user@example.com",
    password: "user123", // Will be hashed by the model
    phonenumber: "0987654321",
    role: "user",
    address: "456 User Ave, User Town, UT 67890"
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane@example.com",
    password: "user123",
    phonenumber: "1122334455",
    role: "user",
    address: "789 Customer Rd, Customer City, CC 11223"
  },
  {
    firstname: "Bob",
    lastname: "Johnson",
    email: "bob@example.com",
    password: "user123",
    phonenumber: "5566778899",
    role: "user",
    address: "321 Buyer Blvd, Buyer Town, BT 44556"
  }
];

// Sample comments data (will be populated after users and products are created)
const sampleComments = [
  { text: "Great product! Highly recommended.", rating: 5 },
  { text: "Good quality but a bit expensive.", rating: 4 },
  { text: "Excellent value for money.", rating: 5 },
  { text: "Fast shipping and good packaging.", rating: 4 },
  { text: "Works as described. Satisfied.", rating: 4 },
  { text: "Could be better, but okay.", rating: 3 },
  { text: "Amazing product! Will buy again.", rating: 5 },
  { text: "Decent quality for the price.", rating: 4 },
  { text: "Not what I expected, but still usable.", rating: 2 },
  { text: "Perfect! Exactly what I needed.", rating: 5 }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed users first
    console.log('Seeding users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping`);
        createdUsers.push(existingUser);
        continue;
      }

      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Added user: ${userData.email}`);
    }

    // Seed categories first
    console.log('Seeding categories...');
    const categoryMap = new Map();
    for (const categoryData of sampleCategories) {
      const category = await Category.findOneAndUpdate(
        { name: categoryData.name },
        { $set: { name: categoryData.name } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      categoryMap.set(category.name, category);
      console.log(`Ensured category: ${category.name}`);
    }

    // Seed products and ensure they reference the correct category
    console.log('Seeding products...');
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const category = categoryMap.get(productData.categoryName);
      if (!category) {
        console.log(`Category ${productData.categoryName} missing, skipping product ${productData.name}`);
        continue;
      }

      const productPayload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: category._id,
        stock: productData.stock,
        image: productData.image,
        size: productData.size
      };

      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        Object.assign(existingProduct, productPayload);
        await existingProduct.save();
        createdProducts.push(existingProduct);
        console.log(`Updated product: ${productData.name}`);
        continue;
      }

      const product = new Product(productPayload);
      await product.save();
      createdProducts.push(product);
      console.log(`Added product: ${productData.name}`);
    }

    // Seed comments
    console.log('Seeding comments...');
    for (let i = 0; i < Math.min(createdProducts.length, sampleComments.length * 2); i++) {
      const product = createdProducts[i % createdProducts.length];
      const user = createdUsers[i % createdUsers.length];
      const commentData = sampleComments[i % sampleComments.length];

      const existingComment = await Comment.findOne({
        productId: product._id,
        userId: user._id,
        text: commentData.text
      });
      if (existingComment) {
        console.log(`Comment already exists for product ${product.name} by ${user.email}, skipping`);
        continue;
      }

      const comment = new Comment({
        productId: product._id,
        userId: user._id,
        text: commentData.text
      });

      await comment.save();
      console.log(`Added comment on ${product.name} by ${user.email}`);
    }

    // Seed likes
    console.log('Seeding likes...');
    for (let i = 0; i < Math.min(createdProducts.length * 2, createdUsers.length * 3); i++) {
      const product = createdProducts[i % createdProducts.length];
      const user = createdUsers[i % createdUsers.length];

      const existingLike = await Likes.findOne({
        product: product._id,
        user: user._id
      });
      if (existingLike) {
        console.log(`Like already exists for product ${product.name} by ${user.email}, skipping`);
        continue;
      }

      const like = new Likes({
        product: product._id,
        user: user._id
      });

      await like.save();
      console.log(`Added like on ${product.name} by ${user.email}`);
    }

    // Seed orders
    console.log('Seeding orders...');
    for (let i = 0; i < Math.min(createdUsers.length, 5); i++) {
      const user = createdUsers[i];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const orderItems = [];

      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        orderItems.push({
          product: product._id,
          quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
          price: product.price
        });
      }

      const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const order = new Order({
        user: user._id,
        items: orderItems,
        total: totalAmount,
        shippingAddress: {
          address: user.address,
          city: "Sample City",
          postalCode: "12345",
          phone: user.phonenumber
        },
        deliveryMethod: ['Standard', 'Express'][Math.floor(Math.random() * 2)],
        paymentMethod: ['Cash on Delivery', 'PayPal'][Math.floor(Math.random() * 2)]
      });

      await order.save();
      console.log(`Added order for ${user.email} with ${numItems} items`);
    }

    // Seed cart items
    console.log('Seeding cart items...');
    for (let i = 0; i < Math.min(createdUsers.length, 3); i++) {
      const user = createdUsers[i];
      const numItems = Math.floor(Math.random() * 2) + 1; // 1-2 items in cart
      const cartItems = [];

      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        cartItems.push({
          product: product._id,
          quantity: Math.floor(Math.random() * 2) + 1 // 1-2 quantity
        });
      }

      const existingCart = await Cart.findOne({ user: user._id });
      if (existingCart) {
        console.log(`Cart already exists for ${user.email}, updating`);
        existingCart.items = cartItems;
        await existingCart.save();
      } else {
        const cart = new Cart({
          user: user._id,
          items: cartItems
        });
        await cart.save();
        console.log(`Added cart for ${user.email} with ${numItems} items`);
      }
    }

    console.log('Database seeding completed successfully!');
    console.log('\n=== ADMIN ACCOUNT ===');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n=== USER ACCOUNT ===');
    console.log('Email: user@example.com');
    console.log('Password: user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();