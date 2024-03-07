/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./db.ts":
/*!***************!*\
  !*** ./db.ts ***!
  \***************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ db)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

async function db() {
    try {
        const conn = await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(process.env.MONGO_URL, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}


/***/ }),

/***/ "./src/api/scheduler/createSchedule.ts":
/*!*********************************************!*\
  !*** ./src/api/scheduler/createSchedule.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSchedule: () => (/* binding */ createSchedule)
/* harmony export */ });
/* harmony import */ var _models_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/schedule */ "./src/models/schedule.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../middleware/errorHandler */ "./src/middleware/errorHandler.ts");
/* harmony import */ var _utility_baseUseCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utility/baseUseCase */ "./src/utility/baseUseCase.ts");



const createSchedule = async (_req, _res, _next) => {
    try {
        const payload = _req.body;
        const data = await _models_schedule__WEBPACK_IMPORTED_MODULE_0__["default"].create(payload);
        const emailResponse = await (0,_utility_baseUseCase__WEBPACK_IMPORTED_MODULE_2__.scheduleJobAsync)(data);
        if (emailResponse) {
            data.jobId = emailResponse === null || emailResponse === void 0 ? void 0 : emailResponse.name;
            data.status = "sent";
        }
        else {
            data.status = "failed";
            await data.save();
            return _res.status(500).json({
                message: "Something went wrong",
            });
        }
        await data.save();
        console.log(emailResponse);
        console.log("data: ", data);
        return _res.status(200).json({
            message: "Success",
            data,
        });
    }
    catch (error) {
        (0,_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__.errorHandler)(error, _req, _res, _next);
    }
};


/***/ }),

/***/ "./src/api/scheduler/deleteSchedule.ts":
/*!*********************************************!*\
  !*** ./src/api/scheduler/deleteSchedule.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteSchedule: () => (/* binding */ deleteSchedule)
/* harmony export */ });
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-schedule */ "node-schedule");
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_schedule__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_schedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/schedule */ "./src/models/schedule.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../middleware/errorHandler */ "./src/middleware/errorHandler.ts");



const deleteSchedule = async (_req, _res, _next) => {
    var _a;
    try {
        const scheduleObj = await _models_schedule__WEBPACK_IMPORTED_MODULE_1__["default"].findById(_req.params.id);
        const jobs = (_a = (node_schedule__WEBPACK_IMPORTED_MODULE_0___default().scheduledJobs)) === null || _a === void 0 ? void 0 : _a[scheduleObj.jobId];
        if (scheduleObj && jobs) {
            console.log("jobs: ", jobs);
            const response = (node_schedule__WEBPACK_IMPORTED_MODULE_0___default().scheduledJobs)[scheduleObj.jobId].cancel();
            console.log("response: ", response);
            await _models_schedule__WEBPACK_IMPORTED_MODULE_1__["default"].deleteOne({ _id: _req.params.id });
        }
        else {
            return _res.status(404).json({
                message: "schedule not found",
            });
        }
        return _res.status(200).json({
            message: "Success",
        });
    }
    catch (error) {
        (0,_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_2__.errorHandler)(error, _req, _res, _next);
    }
};


/***/ }),

/***/ "./src/api/scheduler/getAllSchedules.ts":
/*!**********************************************!*\
  !*** ./src/api/scheduler/getAllSchedules.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAllSchedules: () => (/* binding */ getAllSchedules)
/* harmony export */ });
/* harmony import */ var _models_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/schedule */ "./src/models/schedule.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../middleware/errorHandler */ "./src/middleware/errorHandler.ts");


const getAllSchedules = async (_req, _res, _next) => {
    var _a;
    try {
        const status = (_a = _req === null || _req === void 0 ? void 0 : _req.params) === null || _a === void 0 ? void 0 : _a.status;
        let scheduleObj;
        if (status) {
            scheduleObj = await _models_schedule__WEBPACK_IMPORTED_MODULE_0__["default"].find({ status });
        }
        else {
            scheduleObj = await _models_schedule__WEBPACK_IMPORTED_MODULE_0__["default"].find();
        }
        if (scheduleObj && (scheduleObj === null || scheduleObj === void 0 ? void 0 : scheduleObj.length)) {
            return _res.status(200).json({
                message: "Success",
                data: scheduleObj,
            });
        }
        else {
            return _res.status(404).json({
                message: "No schedules found",
                data: [],
            });
        }
    }
    catch (error) {
        (0,_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__.errorHandler)(error, _req, _res, _next);
    }
};


/***/ }),

/***/ "./src/api/scheduler/getSchedule.ts":
/*!******************************************!*\
  !*** ./src/api/scheduler/getSchedule.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSchedule: () => (/* binding */ getSchedule)
/* harmony export */ });
/* harmony import */ var _models_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/schedule */ "./src/models/schedule.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../middleware/errorHandler */ "./src/middleware/errorHandler.ts");


const getSchedule = async (_req, _res, _next) => {
    try {
        const scheduleObj = await _models_schedule__WEBPACK_IMPORTED_MODULE_0__["default"].findById(_req.params.id);
        if (scheduleObj) {
            return _res.status(200).json({
                message: "Success",
                data: scheduleObj,
            });
        }
        else {
            return _res.status(404).json({
                message: "schedule not found",
            });
        }
    }
    catch (error) {
        (0,_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_1__.errorHandler)(error, _req, _res, _next);
    }
};


/***/ }),

/***/ "./src/api/scheduler/routes.ts":
/*!*************************************!*\
  !*** ./src/api/scheduler/routes.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _getSchedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getSchedule */ "./src/api/scheduler/getSchedule.ts");
/* harmony import */ var _createSchedule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createSchedule */ "./src/api/scheduler/createSchedule.ts");
/* harmony import */ var _deleteSchedule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deleteSchedule */ "./src/api/scheduler/deleteSchedule.ts");
/* harmony import */ var _updateSchedule__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./updateSchedule */ "./src/api/scheduler/updateSchedule.ts");
/* harmony import */ var _getAllSchedules__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getAllSchedules */ "./src/api/scheduler/getAllSchedules.ts");






const router = express__WEBPACK_IMPORTED_MODULE_0__.Router();
router.get("/v1/schedule/:id", async (req, res, next) => {
    await (0,_getSchedule__WEBPACK_IMPORTED_MODULE_1__.getSchedule)(req, res, next);
});
router.get("/v1/list-schedules/:status?", async (req, res, next) => {
    await (0,_getAllSchedules__WEBPACK_IMPORTED_MODULE_5__.getAllSchedules)(req, res, next);
});
router.post("/v1/schedule", async (req, res, next) => {
    await (0,_createSchedule__WEBPACK_IMPORTED_MODULE_2__.createSchedule)(req, res, next);
});
router.put("/v1/schedule/:id", async (req, res, next) => {
    await (0,_updateSchedule__WEBPACK_IMPORTED_MODULE_4__.updateSchedule)(req, res, next);
});
router.delete("/v1/schedule/:id", async (req, res, next) => {
    await (0,_deleteSchedule__WEBPACK_IMPORTED_MODULE_3__.deleteSchedule)(req, res, next);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);


/***/ }),

/***/ "./src/api/scheduler/updateSchedule.ts":
/*!*********************************************!*\
  !*** ./src/api/scheduler/updateSchedule.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateSchedule: () => (/* binding */ updateSchedule)
/* harmony export */ });
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-schedule */ "node-schedule");
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_schedule__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_schedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/schedule */ "./src/models/schedule.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../middleware/errorHandler */ "./src/middleware/errorHandler.ts");
/* harmony import */ var _utility_baseUseCase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utility/baseUseCase */ "./src/utility/baseUseCase.ts");




const updateSchedule = async (_req, _res, _next) => {
    var _a;
    try {
        const data = _req.body;
        const scheduleObj = await _models_schedule__WEBPACK_IMPORTED_MODULE_1__["default"].findByIdAndUpdate({
            _id: _req.params.id,
        }, Object.assign({}, data), { new: true });
        const jobs = (node_schedule__WEBPACK_IMPORTED_MODULE_0___default().scheduledJobs)[scheduleObj === null || scheduleObj === void 0 ? void 0 : scheduleObj.jobId];
        if (scheduleObj && jobs) {
            console.log("jobs: ", jobs);
            const response = (_a = (node_schedule__WEBPACK_IMPORTED_MODULE_0___default().scheduledJobs)[scheduleObj === null || scheduleObj === void 0 ? void 0 : scheduleObj.jobId]) === null || _a === void 0 ? void 0 : _a.cancel();
            console.log("response: ", response);
            if (response) {
                const emailResponse = await (0,_utility_baseUseCase__WEBPACK_IMPORTED_MODULE_3__.scheduleJobAsync)(scheduleObj);
                if (emailResponse) {
                    scheduleObj.jobId = emailResponse === null || emailResponse === void 0 ? void 0 : emailResponse.name;
                    scheduleObj.status = "sent";
                }
                else {
                    scheduleObj.status = "failed";
                    await scheduleObj.save();
                    return _res.status(500).json({
                        message: "Something went wrong",
                    });
                }
                await scheduleObj.save();
            }
        }
        else {
            scheduleObj.status = "failed";
            await scheduleObj.save();
            return _res.status(404).json({
                message: "schedule not found",
            });
        }
        return _res.status(200).json({
            message: "Success",
        });
    }
    catch (error) {
        (0,_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_2__.errorHandler)(error, _req, _res, _next);
    }
};


/***/ }),

/***/ "./src/middleware/errorHandler.ts":
/*!****************************************!*\
  !*** ./src/middleware/errorHandler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   errorHandler: () => (/* binding */ errorHandler)
/* harmony export */ });
const errorHandler = (error, _req, _res, _next) => {
    console.log(error === null || error === void 0 ? void 0 : error.message, error === null || error === void 0 ? void 0 : error.statusCode);
    if (_res.headersSent) {
        return _next(error);
    }
    _res.status((error === null || error === void 0 ? void 0 : error.statusCode) || 500).json({
        message: (error === null || error === void 0 ? void 0 : error.message) || "An unknown error",
    });
};


/***/ }),

/***/ "./src/models/schedule.ts":
/*!********************************!*\
  !*** ./src/models/schedule.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const scheduleSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
    emailRecepient: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    cronExpression: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    emailType: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
    },
});
const ScheduleModel = (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)("schedule", scheduleSchema);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScheduleModel);


/***/ }),

/***/ "./src/routes.ts":
/*!***********************!*\
  !*** ./src/routes.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api_scheduler_routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api/scheduler/routes */ "./src/api/scheduler/routes.ts");


const routes = express__WEBPACK_IMPORTED_MODULE_0__.Router();
routes.use("/", _api_scheduler_routes__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (routes);


/***/ }),

/***/ "./src/service/emailService.ts":
/*!*************************************!*\
  !*** ./src/service/emailService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendEmail: () => (/* binding */ sendEmail)
/* harmony export */ });
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ "nodemailer");
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_0__);

async function sendEmail(params) {
    try {
        const transporter = nodemailer__WEBPACK_IMPORTED_MODULE_0___default().createTransport({
            host: "smtp.gmail.com",
            service: "Gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const email = {
            body: {
                greeting: "Dear",
                name: params === null || params === void 0 ? void 0 : params.name,
                outro: params === null || params === void 0 ? void 0 : params.body,
                signature: `Thank You!`,
            },
        };
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: params === null || params === void 0 ? void 0 : params.to,
            subject: params === null || params === void 0 ? void 0 : params.subject,
            text: params === null || params === void 0 ? void 0 : params.body,
        };
        return await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw error;
    }
}


/***/ }),

/***/ "./src/utility/baseUseCase.ts":
/*!************************************!*\
  !*** ./src/utility/baseUseCase.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scheduleJobAsync: () => (/* binding */ scheduleJobAsync)
/* harmony export */ });
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-schedule */ "node-schedule");
/* harmony import */ var node_schedule__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_schedule__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _service_emailService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../service/emailService */ "./src/service/emailService.ts");


const scheduleJobAsync = async (cronData) => {
    var _a;
    return await node_schedule__WEBPACK_IMPORTED_MODULE_0___default().scheduleJob((_a = cronData === null || cronData === void 0 ? void 0 : cronData._id) === null || _a === void 0 ? void 0 : _a.toString(), cronData === null || cronData === void 0 ? void 0 : cronData.cronExpression, async () => {
        try {
            console.log("Job is scheduled");
            const response = await (0,_service_emailService__WEBPACK_IMPORTED_MODULE_1__.sendEmail)({
                name: cronData === null || cronData === void 0 ? void 0 : cronData.name,
                to: cronData === null || cronData === void 0 ? void 0 : cronData.emailRecepient,
                cc: "",
                subject: cronData === null || cronData === void 0 ? void 0 : cronData.subject,
                body: cronData === null || cronData === void 0 ? void 0 : cronData.body,
            });
            if (response) {
                cronData.status = "sent";
            }
            return cronData;
        }
        catch (error) {
            throw error;
        }
    });
};


/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "node-schedule":
/*!********************************!*\
  !*** external "node-schedule" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("node-schedule");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../db */ "./db.ts");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes */ "./src/routes.ts");
/* harmony import */ var _middleware_errorHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./middleware/errorHandler */ "./src/middleware/errorHandler.ts");







(__webpack_require__(/*! dotenv */ "dotenv").config)();
const start = async () => {
    const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
    app.use(cors__WEBPACK_IMPORTED_MODULE_0___default()({ origin: true, credentials: true }));
    app.use(express__WEBPACK_IMPORTED_MODULE_1___default().json({ limit: "50mb" }));
    await (0,_db__WEBPACK_IMPORTED_MODULE_3__["default"])();
    app.use("/", _routes__WEBPACK_IMPORTED_MODULE_5__["default"]);
    app.use((_req, _res) => {
        return _res.status(404).json({ message: "Route Not Found" });
    });
    app.use(_middleware_errorHandler__WEBPACK_IMPORTED_MODULE_6__.errorHandler);
    const server = app.listen(process.env.PORT, () => {
        console.log("Server started at http://localhost:" + process.env.PORT);
    });
    process.on("SIGTERM", () => {
        console.info("SIGTERM signal received.");
        console.log("Closing http server.");
        server.close(() => {
            console.log("Http server closed.");
            mongoose__WEBPACK_IMPORTED_MODULE_2___default().disconnect().then(() => {
                console.log("MongoDb connection closed.");
                process.exit(0);
            });
        });
    });
};
if (false) {}
else {
    start();
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFnQztBQUVqQixLQUFLLFVBQVUsRUFBRTtJQUM5QixJQUFJLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLHVEQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZpRDtBQUNXO0FBQ0E7QUFHdEQsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDeEQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQXNCLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSx3REFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxNQUFNLGFBQWEsR0FBRyxNQUFNLHNFQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELElBQUksYUFBYSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdkIsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0IsT0FBTyxFQUFFLHNCQUFzQjthQUNoQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzNCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLHNFQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlCbUM7QUFDYTtBQUNXO0FBR3RELE1BQU0sY0FBYyxHQUFHLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFOztJQUN4RCxJQUFJLENBQUM7UUFDSCxNQUFNLFdBQVcsR0FBc0IsTUFBTSx3REFBYSxDQUFDLFFBQVEsQ0FDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ2YsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFRLDBFQUFzQiwwQ0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUIsTUFBTSxRQUFRLEdBQ1osb0VBQXNCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXBDLE1BQU0sd0RBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0IsT0FBTyxFQUFFLG9CQUFvQjthQUM5QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMzQixPQUFPLEVBQUUsU0FBUztTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLHNFQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QmdEO0FBQ1c7QUFHdEQsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0lBQ3pELElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFXLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLDBDQUFFLE1BQU0sQ0FBQztRQUM1QyxJQUFJLFdBQWdDLENBQUM7UUFDckMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLFdBQVcsR0FBRyxNQUFNLHdEQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLFdBQVcsR0FBRyxNQUFNLHdEQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksV0FBVyxLQUFJLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxNQUFNLEdBQUUsQ0FBQztZQUN2QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMzQixPQUFPLEVBQUUsU0FBUztnQkFDbEIsSUFBSSxFQUFFLFdBQVc7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMzQixPQUFPLEVBQUUsb0JBQW9CO2dCQUM3QixJQUFJLEVBQUUsRUFBRTthQUNULENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLHNFQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQmdEO0FBQ1c7QUFHdEQsTUFBTSxXQUFXLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDckQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQXNCLE1BQU0sd0RBQWEsQ0FBQyxRQUFRLENBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUNmLENBQUM7UUFDRixJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixJQUFJLEVBQUUsV0FBVzthQUNsQixDQUFDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLE9BQU8sRUFBRSxvQkFBb0I7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2Ysc0VBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0FBQ0gsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJpQztBQUNTO0FBQ007QUFDQTtBQUNBO0FBQ0U7QUFFcEQsTUFBTSxNQUFNLEdBQUcsMkNBQWMsRUFBRSxDQUFDO0FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDdEQsTUFBTSx5REFBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ2pFLE1BQU0saUVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDbkQsTUFBTSwrREFBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3BELE1BQU0sK0RBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0FBRUwsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUN6RCxNQUFNLCtEQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUMsQ0FBQztBQUVILGlFQUFlLE1BQU0sRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QmU7QUFDYTtBQUNXO0FBQ0E7QUFHdEQsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0lBQ3hELElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFzQixJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFDLE1BQU0sV0FBVyxHQUFHLE1BQU0sd0RBQWEsQ0FBQyxpQkFBaUIsQ0FDdkQ7WUFDRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1NBQ3BCLG9CQUNJLElBQUksR0FDVCxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FDZCxDQUFDO1FBQ0YsTUFBTSxJQUFJLEdBQUcsb0VBQXNCLENBQUMsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksV0FBVyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVCLE1BQU0sUUFBUSxHQUNaLDBFQUFzQixDQUFDLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxLQUFLLENBQUMsMENBQUUsTUFBTSxFQUFFLENBQUM7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDYixNQUFNLGFBQWEsR0FBc0IsTUFBTSxzRUFBZ0IsQ0FDN0QsV0FBVyxDQUNaLENBQUM7Z0JBQ0YsSUFBSSxhQUFhLEVBQUUsQ0FBQztvQkFDbEIsV0FBVyxDQUFDLEtBQUssR0FBRyxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsSUFBSSxDQUFDO29CQUN4QyxXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztnQkFDOUIsQ0FBQztxQkFBTSxDQUFDO29CQUNOLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO29CQUM5QixNQUFNLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDM0IsT0FBTyxFQUFFLHNCQUFzQjtxQkFDaEMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sV0FBVyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0IsT0FBTyxFQUFFLG9CQUFvQjthQUM5QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMzQixPQUFPLEVBQUUsU0FBUztTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLHNFQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRLLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTyxFQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxVQUFVLENBQUMsQ0FBQztJQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsVUFBVSxLQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN6QyxPQUFPLEVBQUUsTUFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sS0FBSSxrQkFBa0I7S0FDOUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1J1QztBQUV6QyxNQUFNLGNBQWMsR0FBRyxJQUFJLDRDQUFNLENBQUM7SUFDaEMsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRztLQUNsQjtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO0tBQ2I7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLGFBQWEsR0FBRywrQ0FBSyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUV4RCxpRUFBZSxhQUFhLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNDTTtBQUNXO0FBRTlDLE1BQU0sTUFBTSxHQUFHLDJDQUFjLEVBQUUsQ0FBQztBQUVoQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSw2REFBUSxDQUFDLENBQUM7QUFFMUIsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1BjO0FBVTdCLEtBQUssVUFBVSxTQUFTLENBQUMsTUFBdUI7SUFDckQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsaUVBQTBCLENBQUM7WUFDN0MsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsR0FBRztZQUNULE1BQU0sRUFBRSxJQUFJO1lBQ1osSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQzFCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7YUFDakM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRztZQUNaLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsSUFBSSxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxJQUFJO2dCQUNsQixLQUFLLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUk7Z0JBQ25CLFNBQVMsRUFBRSxZQUFZO2FBQ3hCO1NBQ0YsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7WUFDMUIsRUFBRSxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO1lBQ3hCLElBQUksRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsSUFBSTtTQUNuQixDQUFDO1FBRUYsT0FBTyxNQUFNLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQ29DO0FBQ2U7QUFHN0MsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsUUFBMkIsRUFBRSxFQUFFOztJQUNwRSxPQUFPLE1BQU0sZ0VBQW9CLENBQy9CLGNBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxHQUFHLDBDQUFFLFFBQVEsRUFBRSxFQUN6QixRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsY0FBYyxFQUN4QixLQUFLLElBQUksRUFBRTtRQUNULElBQUksQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNoQyxNQUFNLFFBQVEsR0FBWSxNQUFNLGdFQUFTLENBQUM7Z0JBQ3hDLElBQUksRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSTtnQkFDcEIsRUFBRSxFQUFFLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxjQUFjO2dCQUM1QixFQUFFLEVBQUUsRUFBRTtnQkFDTixPQUFPLEVBQUUsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU87Z0JBQzFCLElBQUksRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSTthQUNyQixDQUFDLENBQUM7WUFDSCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNiLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzNCLENBQUM7WUFDRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQzNCRjs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOd0I7QUFDTTtBQUNFO0FBQ1Q7QUFDSDtBQUNVO0FBQzJCO0FBQ3pELG9EQUF3QixFQUFFLENBQUM7QUFFM0IsTUFBTSxLQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDdkIsTUFBTSxHQUFHLEdBQUcsOENBQU8sRUFBRSxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMsMkNBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRCxHQUFHLENBQUMsR0FBRyxDQUFDLG1EQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXpDLE1BQU0sK0NBQUUsRUFBRSxDQUFDO0lBRVgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsK0NBQU0sQ0FBQyxDQUFDO0lBRXJCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsR0FBRyxDQUFDLGtFQUFZLENBQUMsQ0FBQztJQUV0QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFbkMsMERBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsSUFBSSxLQUFxQyxFQUFFLEVBWTFDO0tBQU0sQ0FBQztJQUNOLEtBQUssRUFBRSxDQUFDO0FBQ1YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci8uL2RiLnRzIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci8uL3NyYy9hcGkvc2NoZWR1bGVyL2NyZWF0ZVNjaGVkdWxlLnRzIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci8uL3NyYy9hcGkvc2NoZWR1bGVyL2RlbGV0ZVNjaGVkdWxlLnRzIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci8uL3NyYy9hcGkvc2NoZWR1bGVyL2dldEFsbFNjaGVkdWxlcy50cyIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvLi9zcmMvYXBpL3NjaGVkdWxlci9nZXRTY2hlZHVsZS50cyIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvLi9zcmMvYXBpL3NjaGVkdWxlci9yb3V0ZXMudHMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyLy4vc3JjL2FwaS9zY2hlZHVsZXIvdXBkYXRlU2NoZWR1bGUudHMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyLy4vc3JjL21pZGRsZXdhcmUvZXJyb3JIYW5kbGVyLnRzIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci8uL3NyYy9tb2RlbHMvc2NoZWR1bGUudHMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyLy4vc3JjL3JvdXRlcy50cyIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvLi9zcmMvc2VydmljZS9lbWFpbFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyLy4vc3JjL3V0aWxpdHkvYmFzZVVzZUNhc2UudHMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiY29yc1wiIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci9leHRlcm5hbCBjb21tb25qcyBcImRvdGVudlwiIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJtb25nb29zZVwiIiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci9leHRlcm5hbCBjb21tb25qcyBcIm5vZGUtc2NoZWR1bGVcIiIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJub2RlbWFpbGVyXCIiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyL2V4dGVybmFsIGNvbW1vbmpzIFwib3NcIiIsIndlYnBhY2s6Ly9lbWFpbC1zY2hlZHVsZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2VtYWlsLXNjaGVkdWxlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZW1haWwtc2NoZWR1bGVyLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZGIoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29ubiA9IGF3YWl0IG1vbmdvb3NlLmNvbm5lY3QocHJvY2Vzcy5lbnYuTU9OR09fVVJMLCB7fSk7XG4gICAgY29uc29sZS5sb2coYE1vbmdvREIgQ29ubmVjdGVkOiAke2Nvbm4uY29ubmVjdGlvbi5ob3N0fWApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG59XG4iLCJpbXBvcnQgU2NoZWR1bGVNb2RlbCBmcm9tIFwiLi4vLi4vbW9kZWxzL3NjaGVkdWxlXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vbWlkZGxld2FyZS9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IHNjaGVkdWxlSm9iQXN5bmMgfSBmcm9tIFwiLi4vLi4vdXRpbGl0eS9iYXNlVXNlQ2FzZVwiO1xuaW1wb3J0IHsgU2NoZWR1bGVJbnRlcmZhY2UgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9zY2hlZHVsZVwiO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlU2NoZWR1bGUgPSBhc3luYyAoX3JlcSwgX3JlcywgX25leHQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXlsb2FkOiBTY2hlZHVsZUludGVyZmFjZSA9IF9yZXEuYm9keTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgU2NoZWR1bGVNb2RlbC5jcmVhdGUocGF5bG9hZCk7XG4gICAgY29uc3QgZW1haWxSZXNwb25zZSA9IGF3YWl0IHNjaGVkdWxlSm9iQXN5bmMoZGF0YSk7XG4gICAgaWYgKGVtYWlsUmVzcG9uc2UpIHtcbiAgICAgIGRhdGEuam9iSWQgPSBlbWFpbFJlc3BvbnNlPy5uYW1lO1xuICAgICAgZGF0YS5zdGF0dXMgPSBcInNlbnRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5zdGF0dXMgPSBcImZhaWxlZFwiO1xuICAgICAgYXdhaXQgZGF0YS5zYXZlKCk7XG4gICAgICByZXR1cm4gX3Jlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgbWVzc2FnZTogXCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGF3YWl0IGRhdGEuc2F2ZSgpO1xuICAgIGNvbnNvbGUubG9nKGVtYWlsUmVzcG9uc2UpO1xuICAgIGNvbnNvbGUubG9nKFwiZGF0YTogXCIsIGRhdGEpO1xuICAgIHJldHVybiBfcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgbWVzc2FnZTogXCJTdWNjZXNzXCIsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9ySGFuZGxlcihlcnJvciwgX3JlcSwgX3JlcywgX25leHQpO1xuICB9XG59O1xuIiwiaW1wb3J0IHNjaGVkdWxlIGZyb20gXCJub2RlLXNjaGVkdWxlXCI7XG5pbXBvcnQgU2NoZWR1bGVNb2RlbCBmcm9tIFwiLi4vLi4vbW9kZWxzL3NjaGVkdWxlXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vbWlkZGxld2FyZS9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IFNjaGVkdWxlSW50ZXJmYWNlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc2NoZWR1bGVcIjtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZVNjaGVkdWxlID0gYXN5bmMgKF9yZXEsIF9yZXMsIF9uZXh0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2NoZWR1bGVPYmo6IFNjaGVkdWxlSW50ZXJmYWNlID0gYXdhaXQgU2NoZWR1bGVNb2RlbC5maW5kQnlJZChcbiAgICAgIF9yZXEucGFyYW1zLmlkXG4gICAgKTtcbiAgICBjb25zdCBqb2JzOiBhbnkgPSBzY2hlZHVsZS5zY2hlZHVsZWRKb2JzPy5bc2NoZWR1bGVPYmouam9iSWRdO1xuICAgIGlmIChzY2hlZHVsZU9iaiAmJiBqb2JzKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImpvYnM6IFwiLCBqb2JzKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID1cbiAgICAgICAgc2NoZWR1bGUuc2NoZWR1bGVkSm9ic1tzY2hlZHVsZU9iai5qb2JJZF0uY2FuY2VsKCk7XG4gICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlOiBcIiwgcmVzcG9uc2UpO1xuICAgICAgLy8gZGVsZXRlIGpvYiBmcm9tIERCXG4gICAgICBhd2FpdCBTY2hlZHVsZU1vZGVsLmRlbGV0ZU9uZSh7IF9pZDogX3JlcS5wYXJhbXMuaWQgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfcmVzLnN0YXR1cyg0MDQpLmpzb24oe1xuICAgICAgICBtZXNzYWdlOiBcInNjaGVkdWxlIG5vdCBmb3VuZFwiLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBfcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgbWVzc2FnZTogXCJTdWNjZXNzXCIsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JIYW5kbGVyKGVycm9yLCBfcmVxLCBfcmVzLCBfbmV4dCk7XG4gIH1cbn07XG4iLCJpbXBvcnQgU2NoZWR1bGVNb2RlbCBmcm9tIFwiLi4vLi4vbW9kZWxzL3NjaGVkdWxlXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vbWlkZGxld2FyZS9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IFNjaGVkdWxlSW50ZXJmYWNlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc2NoZWR1bGVcIjtcblxuZXhwb3J0IGNvbnN0IGdldEFsbFNjaGVkdWxlcyA9IGFzeW5jIChfcmVxLCBfcmVzLCBfbmV4dCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHN0YXR1czogc3RyaW5nID0gX3JlcT8ucGFyYW1zPy5zdGF0dXM7XG4gICAgbGV0IHNjaGVkdWxlT2JqOiBTY2hlZHVsZUludGVyZmFjZVtdO1xuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHNjaGVkdWxlT2JqID0gYXdhaXQgU2NoZWR1bGVNb2RlbC5maW5kKHsgc3RhdHVzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZU9iaiA9IGF3YWl0IFNjaGVkdWxlTW9kZWwuZmluZCgpO1xuICAgIH1cbiAgICBpZiAoc2NoZWR1bGVPYmogJiYgc2NoZWR1bGVPYmo/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIF9yZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIG1lc3NhZ2U6IFwiU3VjY2Vzc1wiLFxuICAgICAgICBkYXRhOiBzY2hlZHVsZU9iaixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX3Jlcy5zdGF0dXMoNDA0KS5qc29uKHtcbiAgICAgICAgbWVzc2FnZTogXCJObyBzY2hlZHVsZXMgZm91bmRcIixcbiAgICAgICAgZGF0YTogW10sXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JIYW5kbGVyKGVycm9yLCBfcmVxLCBfcmVzLCBfbmV4dCk7XG4gIH1cbn07XG4iLCJpbXBvcnQgU2NoZWR1bGVNb2RlbCBmcm9tIFwiLi4vLi4vbW9kZWxzL3NjaGVkdWxlXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi4vLi4vbWlkZGxld2FyZS9lcnJvckhhbmRsZXJcIjtcbmltcG9ydCB7IFNjaGVkdWxlSW50ZXJmYWNlIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvc2NoZWR1bGVcIjtcblxuZXhwb3J0IGNvbnN0IGdldFNjaGVkdWxlID0gYXN5bmMgKF9yZXEsIF9yZXMsIF9uZXh0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2NoZWR1bGVPYmo6IFNjaGVkdWxlSW50ZXJmYWNlID0gYXdhaXQgU2NoZWR1bGVNb2RlbC5maW5kQnlJZChcbiAgICAgIF9yZXEucGFyYW1zLmlkXG4gICAgKTtcbiAgICBpZiAoc2NoZWR1bGVPYmopIHtcbiAgICAgIHJldHVybiBfcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICBtZXNzYWdlOiBcIlN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogc2NoZWR1bGVPYmosXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9yZXMuc3RhdHVzKDQwNCkuanNvbih7XG4gICAgICAgIG1lc3NhZ2U6IFwic2NoZWR1bGUgbm90IGZvdW5kXCIsXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JIYW5kbGVyKGVycm9yLCBfcmVxLCBfcmVzLCBfbmV4dCk7XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBnZXRTY2hlZHVsZSB9IGZyb20gXCIuL2dldFNjaGVkdWxlXCI7XG5pbXBvcnQgeyBjcmVhdGVTY2hlZHVsZSB9IGZyb20gXCIuL2NyZWF0ZVNjaGVkdWxlXCI7XG5pbXBvcnQgeyBkZWxldGVTY2hlZHVsZSB9IGZyb20gXCIuL2RlbGV0ZVNjaGVkdWxlXCI7XG5pbXBvcnQgeyB1cGRhdGVTY2hlZHVsZSB9IGZyb20gXCIuL3VwZGF0ZVNjaGVkdWxlXCI7XG5pbXBvcnQgeyBnZXRBbGxTY2hlZHVsZXMgfSBmcm9tIFwiLi9nZXRBbGxTY2hlZHVsZXNcIjtcblxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxucm91dGVyLmdldChcIi92MS9zY2hlZHVsZS86aWRcIiwgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGF3YWl0IGdldFNjaGVkdWxlKHJlcSwgcmVzLCBuZXh0KTtcbn0pO1xuXG5yb3V0ZXIuZ2V0KFwiL3YxL2xpc3Qtc2NoZWR1bGVzLzpzdGF0dXM/XCIsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBhd2FpdCBnZXRBbGxTY2hlZHVsZXMocmVxLCByZXMsIG5leHQpO1xufSk7XG5cbnJvdXRlci5wb3N0KFwiL3YxL3NjaGVkdWxlXCIsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBhd2FpdCBjcmVhdGVTY2hlZHVsZShyZXEsIHJlcywgbmV4dCk7XG59KTtcblxucm91dGVyLnB1dChcIi92MS9zY2hlZHVsZS86aWRcIiwgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlU2NoZWR1bGUocmVxLCByZXMsIG5leHQpO1xuICB9KTtcblxucm91dGVyLmRlbGV0ZShcIi92MS9zY2hlZHVsZS86aWRcIiwgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGF3YWl0IGRlbGV0ZVNjaGVkdWxlKHJlcSwgcmVzLCBuZXh0KTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XG4iLCJpbXBvcnQgc2NoZWR1bGUgZnJvbSBcIm5vZGUtc2NoZWR1bGVcIjtcbmltcG9ydCBTY2hlZHVsZU1vZGVsIGZyb20gXCIuLi8uLi9tb2RlbHMvc2NoZWR1bGVcIjtcbmltcG9ydCB7IGVycm9ySGFuZGxlciB9IGZyb20gXCIuLi8uLi9taWRkbGV3YXJlL2Vycm9ySGFuZGxlclwiO1xuaW1wb3J0IHsgc2NoZWR1bGVKb2JBc3luYyB9IGZyb20gXCIuLi8uLi91dGlsaXR5L2Jhc2VVc2VDYXNlXCI7XG5pbXBvcnQgeyBTY2hlZHVsZUludGVyZmFjZSB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL3NjaGVkdWxlXCI7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVTY2hlZHVsZSA9IGFzeW5jIChfcmVxLCBfcmVzLCBfbmV4dCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGE6IFNjaGVkdWxlSW50ZXJmYWNlID0gX3JlcS5ib2R5O1xuICAgIGNvbnN0IHNjaGVkdWxlT2JqID0gYXdhaXQgU2NoZWR1bGVNb2RlbC5maW5kQnlJZEFuZFVwZGF0ZShcbiAgICAgIHtcbiAgICAgICAgX2lkOiBfcmVxLnBhcmFtcy5pZCxcbiAgICAgIH0sXG4gICAgICB7IC4uLmRhdGEgfSxcbiAgICAgIHsgbmV3OiB0cnVlIH1cbiAgICApO1xuICAgIGNvbnN0IGpvYnMgPSBzY2hlZHVsZS5zY2hlZHVsZWRKb2JzW3NjaGVkdWxlT2JqPy5qb2JJZF07XG4gICAgaWYgKHNjaGVkdWxlT2JqICYmIGpvYnMpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiam9iczogXCIsIGpvYnMpO1xuICAgICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPVxuICAgICAgICBzY2hlZHVsZS5zY2hlZHVsZWRKb2JzW3NjaGVkdWxlT2JqPy5qb2JJZF0/LmNhbmNlbCgpO1xuICAgICAgY29uc29sZS5sb2coXCJyZXNwb25zZTogXCIsIHJlc3BvbnNlKTtcbiAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICBjb25zdCBlbWFpbFJlc3BvbnNlOiBTY2hlZHVsZUludGVyZmFjZSA9IGF3YWl0IHNjaGVkdWxlSm9iQXN5bmMoXG4gICAgICAgICAgc2NoZWR1bGVPYmpcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGVtYWlsUmVzcG9uc2UpIHtcbiAgICAgICAgICBzY2hlZHVsZU9iai5qb2JJZCA9IGVtYWlsUmVzcG9uc2U/Lm5hbWU7XG4gICAgICAgICAgc2NoZWR1bGVPYmouc3RhdHVzID0gXCJzZW50XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NoZWR1bGVPYmouc3RhdHVzID0gXCJmYWlsZWRcIjtcbiAgICAgICAgICBhd2FpdCBzY2hlZHVsZU9iai5zYXZlKCk7XG4gICAgICAgICAgcmV0dXJuIF9yZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNvbWV0aGluZyB3ZW50IHdyb25nXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgc2NoZWR1bGVPYmouc2F2ZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZU9iai5zdGF0dXMgPSBcImZhaWxlZFwiO1xuICAgICAgYXdhaXQgc2NoZWR1bGVPYmouc2F2ZSgpO1xuICAgICAgcmV0dXJuIF9yZXMuc3RhdHVzKDQwNCkuanNvbih7XG4gICAgICAgIG1lc3NhZ2U6IFwic2NoZWR1bGUgbm90IGZvdW5kXCIsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICBtZXNzYWdlOiBcIlN1Y2Nlc3NcIixcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvckhhbmRsZXIoZXJyb3IsIF9yZXEsIF9yZXMsIF9uZXh0KTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyb3IsIF9yZXEsIF9yZXMsIF9uZXh0KSA9PiB7XG4gIGNvbnNvbGUubG9nKGVycm9yPy5tZXNzYWdlLCBlcnJvcj8uc3RhdHVzQ29kZSk7XG4gIGlmIChfcmVzLmhlYWRlcnNTZW50KSB7XG4gICAgcmV0dXJuIF9uZXh0KGVycm9yKTtcbiAgfVxuICBfcmVzLnN0YXR1cyhlcnJvcj8uc3RhdHVzQ29kZSB8fCA1MDApLmpzb24oe1xuICAgIG1lc3NhZ2U6IGVycm9yPy5tZXNzYWdlIHx8IFwiQW4gdW5rbm93biBlcnJvclwiLFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBTY2hlbWEsIG1vZGVsIH0gZnJvbSBcIm1vbmdvb3NlXCI7XG5cbmNvbnN0IHNjaGVkdWxlU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gIGVtYWlsUmVjZXBpZW50OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICB9LFxuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1heGxlbmd0aDogNTAsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVmYXVsdDogRGF0ZS5ub3csXG4gIH0sXG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gIH0sXG4gIGJvZHk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gIH0sXG4gIGNyb25FeHByZXNzaW9uOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICB9LFxuICBzdGF0dXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gIH0sXG4gIGVtYWlsVHlwZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgfSxcbiAgam9iSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG59KTtcblxuY29uc3QgU2NoZWR1bGVNb2RlbCA9IG1vZGVsKFwic2NoZWR1bGVcIiwgc2NoZWR1bGVTY2hlbWEpO1xuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZU1vZGVsO1xuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHNjaGVkdWxlIGZyb20gXCIuL2FwaS9zY2hlZHVsZXIvcm91dGVzXCI7XG5cbmNvbnN0IHJvdXRlcyA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbnJvdXRlcy51c2UoXCIvXCIsIHNjaGVkdWxlKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVzO1xuIiwiaW1wb3J0IG5vZGVtYWlsZXIgZnJvbSBcIm5vZGVtYWlsZXJcIjtcblxuaW50ZXJmYWNlIFNlbmRFbWFpbFBhcmFtcyB7XG4gIG5hbWU6IHN0cmluZztcbiAgdG86IHN0cmluZztcbiAgc3ViamVjdDogc3RyaW5nO1xuICBib2R5OiBzdHJpbmc7XG4gIGNjPzogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEVtYWlsKHBhcmFtczogU2VuZEVtYWlsUGFyYW1zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XG4gICAgICBob3N0OiBcInNtdHAuZ21haWwuY29tXCIsXG4gICAgICBzZXJ2aWNlOiBcIkdtYWlsXCIsXG4gICAgICBwb3J0OiA0NjUsXG4gICAgICBzZWN1cmU6IHRydWUsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHVzZXI6IHByb2Nlc3MuZW52LkVNQUlMX0lELFxuICAgICAgICBwYXNzOiBwcm9jZXNzLmVudi5FTUFJTF9QQVNTV09SRCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBlbWFpbCA9IHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgZ3JlZXRpbmc6IFwiRGVhclwiLFxuICAgICAgICBuYW1lOiBwYXJhbXM/Lm5hbWUsXG4gICAgICAgIG91dHJvOiBwYXJhbXM/LmJvZHksXG4gICAgICAgIHNpZ25hdHVyZTogYFRoYW5rIFlvdSFgLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgbWFpbE9wdGlvbnMgPSB7XG4gICAgICBmcm9tOiBwcm9jZXNzLmVudi5FTUFJTF9JRCwgLy8gc2VuZGVyIGFkZHJlc3NcbiAgICAgIHRvOiBwYXJhbXM/LnRvLFxuICAgICAgc3ViamVjdDogcGFyYW1zPy5zdWJqZWN0LFxuICAgICAgdGV4dDogcGFyYW1zPy5ib2R5LFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgdHJhbnNwb3J0ZXIuc2VuZE1haWwobWFpbE9wdGlvbnMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG4iLCJpbXBvcnQgc2NoZWR1bGUgZnJvbSBcIm5vZGUtc2NoZWR1bGVcIjtcbmltcG9ydCB7IHNlbmRFbWFpbCB9IGZyb20gXCIuLi9zZXJ2aWNlL2VtYWlsU2VydmljZVwiO1xuaW1wb3J0IHsgU2NoZWR1bGVJbnRlcmZhY2UgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9zY2hlZHVsZVwiO1xuXG5leHBvcnQgY29uc3Qgc2NoZWR1bGVKb2JBc3luYyA9IGFzeW5jIChjcm9uRGF0YTogU2NoZWR1bGVJbnRlcmZhY2UpID0+IHtcbiAgcmV0dXJuIGF3YWl0IHNjaGVkdWxlLnNjaGVkdWxlSm9iKFxuICAgIGNyb25EYXRhPy5faWQ/LnRvU3RyaW5nKCksXG4gICAgY3JvbkRhdGE/LmNyb25FeHByZXNzaW9uLFxuICAgIGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSm9iIGlzIHNjaGVkdWxlZFwiKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2U6IEJvb2xlYW4gPSBhd2FpdCBzZW5kRW1haWwoe1xuICAgICAgICAgIG5hbWU6IGNyb25EYXRhPy5uYW1lLFxuICAgICAgICAgIHRvOiBjcm9uRGF0YT8uZW1haWxSZWNlcGllbnQsXG4gICAgICAgICAgY2M6IFwiXCIsXG4gICAgICAgICAgc3ViamVjdDogY3JvbkRhdGE/LnN1YmplY3QsXG4gICAgICAgICAgYm9keTogY3JvbkRhdGE/LmJvZHksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjcm9uRGF0YS5zdGF0dXMgPSBcInNlbnRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JvbkRhdGE7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1zY2hlZHVsZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlbWFpbGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcbmltcG9ydCBkYiBmcm9tIFwiLi4vZGJcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmltcG9ydCByb3V0ZXMgZnJvbSBcIi4vcm91dGVzXCI7XG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiLi9taWRkbGV3YXJlL2Vycm9ySGFuZGxlclwiO1xucmVxdWlyZShcImRvdGVudlwiKS5jb25maWcoKTtcblxuY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZShjb3JzKHsgb3JpZ2luOiB0cnVlLCBjcmVkZW50aWFsczogdHJ1ZSB9KSk7XG4gIGFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6IFwiNTBtYlwiIH0pKTtcblxuICBhd2FpdCBkYigpO1xuXG4gIGFwcC51c2UoXCIvXCIsIHJvdXRlcyk7XG5cbiAgYXBwLnVzZSgoX3JlcSwgX3JlcykgPT4ge1xuICAgIHJldHVybiBfcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlJvdXRlIE5vdCBGb3VuZFwiIH0pO1xuICB9KTtcblxuICBhcHAudXNlKGVycm9ySGFuZGxlcik7XG5cbiAgY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwcm9jZXNzLmVudi5QT1JULCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJTZXJ2ZXIgc3RhcnRlZCBhdCBodHRwOi8vbG9jYWxob3N0OlwiICsgcHJvY2Vzcy5lbnYuUE9SVCk7XG4gIH0pO1xuXG4gIHByb2Nlc3Mub24oXCJTSUdURVJNXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmluZm8oXCJTSUdURVJNIHNpZ25hbCByZWNlaXZlZC5cIik7XG4gICAgY29uc29sZS5sb2coXCJDbG9zaW5nIGh0dHAgc2VydmVyLlwiKTtcbiAgICBzZXJ2ZXIuY2xvc2UoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJIdHRwIHNlcnZlciBjbG9zZWQuXCIpO1xuICAgICAgLy8gYm9vbGVhbiBtZWFucyBbZm9yY2VdLCBzZWUgaW4gbW9uZ29vc2UgZG9jXG4gICAgICBtb25nb29zZS5kaXNjb25uZWN0KCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW9uZ29EYiBjb25uZWN0aW9uIGNsb3NlZC5cIik7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgY29uc3QgdGhyb25nID0gcmVxdWlyZShcInRocm9uZ1wiKTtcbiAgdGhyb25nKHtcbiAgICBtYXN0ZXI6ICgpID0+IHt9LCAvLyBGbiB0byBjYWxsIGluIG1hc3RlciBwcm9jZXNzIChjYW4gYmUgYXN5bmMpXG4gICAgd29ya2VyOiBzdGFydCwgLy8gRm4gdG8gY2FsbCBpbiBjbHVzdGVyIHdvcmtlcnMgKGNhbiBiZSBhc3luYylcbiAgICBjb3VudDogb3MuY3B1cygpLmxlbmd0aCwgLy8gTnVtYmVyIG9mIHdvcmtlcnNcbiAgICBsaWZldGltZTogSW5maW5pdHksIC8vIE1pbiB0aW1lIHRvIGtlZXAgY2x1c3RlciBhbGl2ZSAobXMpXG4gICAgZ3JhY2U6IDUwMDAsIC8vIEdyYWNlIHBlcmlvZCBiZXR3ZWVuIHNpZ25hbCBhbmQgaGFyZCBzaHV0ZG93biAobXMpXG4gICAgc2lnbmFsczogW1wiU0lHVEVSTVwiLCBcIlNJR0lOVFwiXSwgLy8gU2lnbmFscyB0aGF0IHRyaWdnZXIgYSBzaHV0ZG93biAocHJveGllZCB0byB3b3JrZXJzKVxuICB9KS50aGVuKCgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIldvcmtlciBzdGFydGVkIGF0IFwiICsgcHJvY2Vzcy5waWQpO1xuICB9KTtcbn0gZWxzZSB7XG4gIHN0YXJ0KCk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=