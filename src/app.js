const express = require("express");
const path = require("path");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require('./config/config');
const morgan = require('./config/morgan');
// authentication and error handling
const session = require('express-session');
const passport = require('passport');
const { jwtStrategy } = require('./config/jwtStrategy');
const xss = require('xss-clean');
const ApiError = require("./utilities/apiErrors");
const { errorConverter, errorHandler } = require("./middlewares/error");
const { default: helmet } = require("helmet");
const compression = require("compression");
const http = require("http");
const socketIO = require("socket.io");
const initSocketConnections = require("./socket");

// Swagger
const YAML = require("yamljs");
const swaggerDocumentPortal = YAML.load('./src/swagger/portal.yaml');
const swaggerDocumentBackoffice = YAML.load('./src/swagger/backoffice.yaml');

// routes
const routes = require('./routes');
const { resendOtpLimiter } = require("./middlewares/resendOTPLimiter");

const app = express();

const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });


app.use('/swagger-ui', express.static(path.join(__dirname, 'src/swagger')));

app.use('/api-docs', express.static(path.join(__dirname, '../public')));
app.get('/swagger/portal', (req, res) => {
	res.json(swaggerDocumentPortal);
});
app.get('/swagger/backoffice', (req, res) => {
	res.json(swaggerDocumentBackoffice);
});
app.get('/api-docs', (req, res) => {
	res.sendFile(path.join(__dirname, './swagger/index.html'));
});

// Use helmet with customized configuration
app.use(helmet());

// Set Content Security Policy (CSP)
app.use(
	helmet.contentSecurityPolicy({
		// the following directives will be merged into the default helmet CSP policy
		directives: {
			defaultSrc: ["'self'"],  // default value for all directives that are absent
			scriptSrc: ["'self'"],   // helps prevent XSS attacks
			frameAncestors: ["'none'"],  // helps prevent Clickjacking attacks
			imgSrc: ["'self'", "'http://imgexample.com'"],
			styleSrc: ["'none'"]
		}
	})
);

// Set HTTP Strict Transport Security (HSTS)
app.use(helmet.hsts({
	maxAge: 31536000,  // 1 year in seconds
	includeSubDomains: false,  // Include subdomains
}));

// Set X-Content-Type-Options
app.use(helmet.noSniff());

// Set X-Frame-Options
app.use(helmet.frameguard({ action: 'deny' }));

// stops pages from loading when they detect reflected cross-site scripting (XSS) attacks.
app.use(helmet.xssFilter());

app.use(helmet.ieNoOpen());

app.use(helmet.hidePoweredBy());

if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

// parse json request body
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

//todo: to be checked later
// if (config.env === "production") {
// 	app.use(domainCheckerMiddleware);
// 	app.use(rateLimiterMiddleware);
// }

//Middleware
app.use(session({
	secret: process.env.JWT_SECRET || "bea1f2b7440bd173182efc2a0dd89404069ec58e2f40397a59586890daf8c63ca013cbef23bbe692a5ad356f8846e5838b78ce633e8369fe6af10a914628a93a",
	resave: false,
	saveUninitialized: true,
}))

// User serialization and deserialization
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

// Initialize Passport and use session middleware
app.use(passport.initialize());
app.use(passport.session());


// Register JWT authentication strategy
passport.use('jwt', jwtStrategy);

app.all('/', (req, res) => {
	res.send("Hello from APIs Super app")
});

app.all('/api/hello', (req, res) => {
	res.send("Hello hsjss")
});



// Setup Socket Connectionns
initSocketConnections(io);

app.use('/v1/users/send-otp', resendOtpLimiter);

app.use('/v1', routes);

app.use((req, res, next) => {
	const error = new ApiError(httpStatus.NOT_FOUND, 'API Not Found');
	next(error); // Passes the error to the error-handling middleware
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = server;