"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
// models
const users_1 = __importDefault(require("./db/users"));
const app = (0, express_1.default)();
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/Grater')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.get('/api/signup/:username/:password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.params;
    console.log(`username: ${username}, password: ${password}`);
    try {
        const response = yield fetch(`https://api.github.com/users/${username}`);
        const fetchData = yield response.json();
        if (!fetchData.message) {
            const user = new users_1.default({
                username: fetchData.login,
                password: password,
                avatar_url: fetchData.avatar_url,
            });
            yield user.save();
            console.log('User saved successfully');
            return res.status(200).json({ status: 'good' });
        }
        else {
            console.log('GitHub user not found');
            return res.status(404).json({ status: 'bad', message: 'GitHub user not found' });
        }
    }
    catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ status: 'bad', message: 'Internal server error' });
    }
}));
http_1.default.createServer(app).listen(8080, () => {
    console.log('Listening on localhost:8080');
});
