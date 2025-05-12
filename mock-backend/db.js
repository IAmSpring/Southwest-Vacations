"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lowdb_1 = require("lowdb");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var path_2 = require("path");
// Get current file directory in ESM
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_2.dirname)(__filename);
// Custom JSONFile adapter that doesn't rely on lowdb imports
var JSONFile = /** @class */ (function () {
    function JSONFile(filename) {
        this.filename = filename;
    }
    JSONFile.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(this.filename, 'utf8')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, JSON.parse(data)];
                    case 2:
                        error_1 = _a.sent();
                        // If the file doesn't exist or can't be read, return null
                        if (error_1.code === 'ENOENT') {
                            return [2 /*return*/, null];
                        }
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JSONFile.prototype.write = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var tempFilename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempFilename = "".concat(this.filename, ".tmp");
                        // Write to temporary file first (atomic write)
                        return [4 /*yield*/, fs_1.default.promises.writeFile(tempFilename, JSON.stringify(data, null, 2), 'utf8')];
                    case 1:
                        // Write to temporary file first (atomic write)
                        _a.sent();
                        // Rename temporary file to the actual filename (atomic operation)
                        return [4 /*yield*/, fs_1.default.promises.rename(tempFilename, this.filename)];
                    case 2:
                        // Rename temporary file to the actual filename (atomic operation)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return JSONFile;
}());
// Ensure the data directory exists
var DB_DIR = path_1.default.join(process.cwd(), 'data');
if (!fs_1.default.existsSync(DB_DIR)) {
    fs_1.default.mkdirSync(DB_DIR);
}
var DB_PATH = path_1.default.join(DB_DIR, 'db.json');
// Initialize with default data if file doesn't exist
if (!fs_1.default.existsSync(DB_PATH)) {
    // Create default data structure
    var defaultData = {
        trips: [
            {
                id: "trip1",
                destination: "Hawaii",
                imageUrl: "/images/southwest-hawaii.jpg",
                price: 1299,
                description: "Experience the beauty of Hawaii with Southwest Airlines. Enjoy pristine beaches, volcanic landscapes, and rich cultural heritage.",
                datesAvailable: ["2025-06-01", "2025-07-01", "2025-08-01"],
                hotels: [
                    {
                        id: "hotel1-1",
                        name: "Hawaiian Paradise Resort",
                        location: "Waikiki Beach",
                        pricePerNight: 299,
                        rating: 4.7,
                        amenities: ["Beach Access", "Pool", "Spa", "Free WiFi", "Restaurant"],
                        imageUrl: "/images/hotel-hawaii-1.jpg"
                    },
                    {
                        id: "hotel1-2",
                        name: "Tropical Beach Hotel",
                        location: "Maui",
                        pricePerNight: 349,
                        rating: 4.8,
                        amenities: ["Ocean View", "Pool", "Golf Course", "Free Breakfast", "Fitness Center"],
                        imageUrl: "/images/hotel-hawaii-2.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car1-1",
                        company: "Aloha Car Rentals",
                        model: "Jeep Wrangler",
                        type: "suv",
                        pricePerDay: 89,
                        imageUrl: "/images/car-jeep.jpg"
                    },
                    {
                        id: "car1-2",
                        company: "Island Cars",
                        model: "Convertible Mustang",
                        type: "luxury",
                        pricePerDay: 129,
                        imageUrl: "/images/car-mustang.jpg"
                    }
                ]
            },
            {
                id: "trip2",
                destination: "Cancun",
                imageUrl: "/images/southwest-cancun.jpg",
                price: 899,
                description: "Relax on the stunning beaches of Cancun with Southwest Airlines. Crystal-clear waters, vibrant nightlife, and ancient Mayan ruins await.",
                datesAvailable: ["2025-06-15", "2025-07-15", "2025-08-15"],
                hotels: [
                    {
                        id: "hotel2-1",
                        name: "Cancun Beachfront Resort",
                        location: "Hotel Zone",
                        pricePerNight: 249,
                        rating: 4.6,
                        amenities: ["All-Inclusive", "Beach Access", "Pool", "Spa", "Nightclub"],
                        imageUrl: "/images/hotel-cancun-1.jpg"
                    },
                    {
                        id: "hotel2-2",
                        name: "Maya Riviera Lodge",
                        location: "Playa del Carmen",
                        pricePerNight: 279,
                        rating: 4.5,
                        amenities: ["Swim-up Rooms", "Multiple Restaurants", "Water Sports", "Entertainment"],
                        imageUrl: "/images/hotel-cancun-2.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car2-1",
                        company: "Mexico Drive",
                        model: "Volkswagen Jetta",
                        type: "midsize",
                        pricePerDay: 65,
                        imageUrl: "/images/car-jetta.jpg"
                    },
                    {
                        id: "car2-2",
                        company: "Cancun Cars",
                        model: "Chevrolet Spark",
                        type: "economy",
                        pricePerDay: 45,
                        imageUrl: "/images/car-spark.jpg"
                    }
                ]
            },
            {
                id: "trip3",
                destination: "Las Vegas",
                imageUrl: "/images/southwest-vegas.jpg",
                price: 599,
                description: "Experience the excitement of Las Vegas with Southwest Airlines. World-class entertainment, dining, and gaming in the heart of the desert.",
                datesAvailable: ["2025-05-01", "2025-06-01", "2025-07-01"],
                hotels: [
                    {
                        id: "hotel3-1",
                        name: "Desert Oasis Casino & Resort",
                        location: "The Strip",
                        pricePerNight: 199,
                        rating: 4.5,
                        amenities: ["Casino", "Multiple Restaurants", "Shows", "Pool", "Spa"],
                        imageUrl: "/images/hotel-vegas-1.jpg"
                    },
                    {
                        id: "hotel3-2",
                        name: "Vegas Luxury Suites",
                        location: "Downtown",
                        pricePerNight: 229,
                        rating: 4.4,
                        amenities: ["All-Suite Rooms", "Rooftop Pool", "Free Airport Shuttle", "24-Hour Room Service"],
                        imageUrl: "/images/hotel-vegas-2.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car3-1",
                        company: "Desert Wheels",
                        model: "Ford Mustang Convertible",
                        type: "luxury",
                        pricePerDay: 110,
                        imageUrl: "/images/car-mustang-convertible.jpg"
                    },
                    {
                        id: "car3-2",
                        company: "Vegas Auto",
                        model: "Toyota Camry",
                        type: "midsize",
                        pricePerDay: 70,
                        imageUrl: "/images/car-camry.jpg"
                    }
                ]
            },
            {
                id: "trip4",
                destination: "Denver",
                imageUrl: "/images/southwest-denver.jpg",
                price: 499,
                description: "Explore the natural beauty of Denver with Southwest Airlines. Mountain adventures, urban attractions, and breathtaking landscapes.",
                datesAvailable: ["2025-05-15", "2025-06-15", "2025-07-15"],
                hotels: [
                    {
                        id: "hotel4-1",
                        name: "Rocky Mountain Lodge",
                        location: "Downtown Denver",
                        pricePerNight: 179,
                        rating: 4.3,
                        amenities: ["Mountain Views", "Free Breakfast", "Fitness Center", "Spa", "Restaurant"],
                        imageUrl: "/images/hotel-denver-1.jpg"
                    },
                    {
                        id: "hotel4-2",
                        name: "Urban Altitude Hotel",
                        location: "Cherry Creek",
                        pricePerNight: 219,
                        rating: 4.5,
                        amenities: ["Rooftop Pool", "Bar", "Pet Friendly", "Free WiFi", "Business Center"],
                        imageUrl: "/images/hotel-denver-2.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car4-1",
                        company: "Mountain Explorers",
                        model: "Jeep Grand Cherokee",
                        type: "suv",
                        pricePerDay: 85,
                        imageUrl: "/images/car-jeep-cherokee.jpg"
                    },
                    {
                        id: "car4-2",
                        company: "Denver Auto",
                        model: "Subaru Outback",
                        type: "midsize",
                        pricePerDay: 65,
                        imageUrl: "/images/car-outback.jpg"
                    }
                ]
            },
            {
                id: "trip5",
                destination: "Orlando",
                imageUrl: "/images/southwest-orlando.jpg",
                price: 699,
                description: "Discover the magic of Orlando with Southwest Airlines. World-famous theme parks, family attractions, and year-round sunshine.",
                datesAvailable: ["2025-05-01", "2025-06-01", "2025-07-01"],
                hotels: [
                    {
                        id: "hotel5-1",
                        name: "Magic Kingdom Resort",
                        location: "Near Disney World",
                        pricePerNight: 259,
                        rating: 4.6,
                        amenities: ["Theme Park Shuttle", "Pool", "Kids Club", "Restaurant", "Character Breakfast"],
                        imageUrl: "/images/hotel-orlando-1.jpg"
                    },
                    {
                        id: "hotel5-2",
                        name: "Sunshine Family Hotel",
                        location: "International Drive",
                        pricePerNight: 189,
                        rating: 4.2,
                        amenities: ["Water Park", "Game Room", "Multiple Pools", "Restaurant", "Theme Park Tickets"],
                        imageUrl: "/images/hotel-orlando-2.jpg"
                    },
                    {
                        id: "hotel5-3",
                        name: "Luxury Orlando Villas",
                        location: "Lake Buena Vista",
                        pricePerNight: 349,
                        rating: 4.8,
                        amenities: ["Full Kitchen", "Private Pool", "Multiple Bedrooms", "BBQ Area", "Golf Course"],
                        imageUrl: "/images/hotel-orlando-3.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car5-1",
                        company: "Sunshine Rentals",
                        model: "Chrysler Pacifica",
                        type: "minivan",
                        pricePerDay: 95,
                        imageUrl: "/images/car-pacifica.jpg"
                    },
                    {
                        id: "car5-2",
                        company: "Family Wheels",
                        model: "Toyota Sienna",
                        type: "minivan",
                        pricePerDay: 89,
                        imageUrl: "/images/car-sienna.jpg"
                    }
                ]
            },
            {
                id: "trip6",
                destination: "San Francisco",
                imageUrl: "/images/southwest-sanfrancisco.jpg",
                price: 799,
                description: "Experience the charm of San Francisco with Southwest Airlines. Iconic landmarks, diverse neighborhoods, and stunning bay views.",
                datesAvailable: ["2025-05-15", "2025-06-15", "2025-07-15"],
                hotels: [
                    {
                        id: "hotel6-1",
                        name: "Golden Gate Hotel",
                        location: "Fisherman's Wharf",
                        pricePerNight: 299,
                        rating: 4.4,
                        amenities: ["Bay Views", "Restaurant", "Bike Rentals", "Concierge", "Walking Tours"],
                        imageUrl: "/images/hotel-sf-1.jpg"
                    },
                    {
                        id: "hotel6-2",
                        name: "Urban Boutique SF",
                        location: "Union Square",
                        pricePerNight: 279,
                        rating: 4.3,
                        amenities: ["Rooftop Bar", "Fitness Center", "Free WiFi", "Business Center", "Restaurant"],
                        imageUrl: "/images/hotel-sf-2.jpg"
                    },
                    {
                        id: "hotel6-3",
                        name: "Bay View Inn & Spa",
                        location: "Nob Hill",
                        pricePerNight: 329,
                        rating: 4.7,
                        amenities: ["Luxury Spa", "Fine Dining", "City Views", "Concierge", "Room Service"],
                        imageUrl: "/images/hotel-sf-3.jpg"
                    }
                ],
                carRentals: [
                    {
                        id: "car6-1",
                        company: "Bay Area Rentals",
                        model: "Toyota Prius",
                        type: "economy",
                        pricePerDay: 55,
                        imageUrl: "/images/car-prius.jpg"
                    },
                    {
                        id: "car6-2",
                        company: "SF Luxury Wheels",
                        model: "Tesla Model 3",
                        type: "luxury",
                        pricePerDay: 135,
                        imageUrl: "/images/car-tesla.jpg"
                    }
                ]
            }
        ],
        users: [],
        favorites: [],
        bookings: [],
        activities: []
    };
    // Write the default data to the file
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
    console.log('✅ Database initialized with seed data');
}
// Create a class that mimics the lowdb interface but uses the new Low API
var DB = /** @class */ (function () {
    function DB() {
        this.adapter = new JSONFile(DB_PATH);
        this.db = new lowdb_1.Low(this.adapter);
        // Initialize with empty data
        this.data = { trips: [], users: [], favorites: [], bookings: [], activities: [] };
        // Load the data
        this.loadData();
    }
    DB.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.db.read()];
                    case 1:
                        _a.sent();
                        if (!(this.db.data === null)) return [3 /*break*/, 3];
                        this.db.data = { trips: [], users: [], favorites: [], bookings: [], activities: [] };
                        return [4 /*yield*/, this.db.write()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.data = this.db.data;
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error loading database:', error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DB.prototype.get = function (collection) {
        var _this = this;
        // Create a chainable API similar to lowdb
        return {
            value: function () { return _this.data[collection]; },
            find: function (query) {
                var key = Object.keys(query)[0];
                var value = query[key];
                return {
                    value: function () { return _this.data[collection].find(function (item) { return item[key] === value; }); },
                    assign: function (updates) {
                        var index = _this.data[collection].findIndex(function (item) { return item[key] === value; });
                        if (index !== -1) {
                            _this.data[collection][index] = __assign(__assign({}, _this.data[collection][index]), updates);
                        }
                        return { write: function () { return _this.write(); } };
                    }
                };
            },
            push: function (item) {
                _this.data[collection].push(item);
                return { write: function () { return _this.write(); } };
            },
            filter: function (query) {
                var key = Object.keys(query)[0];
                var value = query[key];
                return {
                    value: function () { return _this.data[collection].filter(function (item) { return item[key] === value; }); }
                };
            },
            remove: function (query) {
                var key = Object.keys(query)[0];
                var value = query[key];
                var index = _this.data[collection].findIndex(function (item) { return item[key] === value; });
                if (index !== -1) {
                    _this.data[collection].splice(index, 1);
                }
                return { write: function () { return _this.write(); } };
            },
            map: function (mapFn) {
                return {
                    value: function () { return _this.data[collection].map(mapFn); }
                };
            }
        };
    };
    DB.prototype.write = function () {
        this.db.write();
        return this;
    };
    return DB;
}());
// Export the database instance
var db = new DB();

// Initialize promotions collection if it doesn't exist
if (!db.data.promotions) {
    db.data.promotions = [];
    db.write();
    console.log('Created promotions collection');
}

exports.default = db;
module.exports = db; // Add commonjs compatibility
module.exports.default = db; // Ensure default is available
