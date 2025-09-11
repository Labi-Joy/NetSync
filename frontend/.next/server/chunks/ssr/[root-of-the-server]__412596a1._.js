module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/frontend/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "authAPI",
    ()=>authAPI,
    "botAPI",
    ()=>botAPI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "eventAPI",
    ()=>eventAPI,
    "networkingAPI",
    ()=>networkingAPI,
    "userAPI",
    ()=>userAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor to add auth token
api.interceptors.request.use((config)=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor to handle token refresh
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token');
            }
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken
            });
            const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('accessToken', accessToken, {
                expires: 1
            }); // 1 day
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('refreshToken', newRefreshToken, {
                expires: 7
            }); // 7 days
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed, redirect to login
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('accessToken');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('refreshToken');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const authAPI = {
    register: (userData)=>api.post('/auth/register', userData),
    login: (credentials)=>api.post('/auth/login', credentials),
    logout: (refreshToken)=>api.post('/auth/logout', {
            refreshToken
        }),
    getProfile: ()=>api.get('/auth/profile')
};
const userAPI = {
    getProfile: ()=>api.get('/api/users/profile'),
    updateProfile: (data)=>api.put('/api/users/profile', data),
    completeOnboarding: (data)=>api.post('/api/users/onboarding', data),
    getNetworkingStyle: ()=>api.get('/api/users/networking-style')
};
const eventAPI = {
    getEvents: (params)=>api.get('/api/events', {
            params
        }),
    getEventById: (id)=>api.get(`/api/events/${id}`),
    joinEvent: (id)=>api.post(`/api/events/${id}/join`),
    getEventAttendees: (id)=>api.get(`/api/events/${id}/attendees`),
    getEventSchedule: (id)=>api.get(`/api/events/${id}/schedule`)
};
const networkingAPI = {
    findMatches: (data)=>api.post('/api/networking/find-matches', data),
    requestIntroduction: (data)=>api.post('/api/networking/request-introduction', data),
    getConnections: (params)=>api.get('/api/networking/connections', {
            params
        }),
    updateConnectionStatus: (id, data)=>api.put(`/api/networking/connections/${id}/status`, data),
    provideFeedback: (data)=>api.post('/api/networking/feedback', data)
};
const botAPI = {
    initialize: (data)=>api.post('/api/bot/initialize', data),
    sendMessage: (data)=>api.post('/api/bot/message', data),
    requestIntroduction: (data)=>api.post('/api/bot/introduce', data),
    getSuggestions: (params)=>api.get('/api/bot/suggestions', {
            params
        }),
    scheduleMeetup: (data)=>api.post('/api/bot/schedule-meetup', data),
    getConversationHistory: (conversationId)=>api.get(`/api/bot/conversations/${conversationId}`)
};
const __TURBOPACK__default__export__ = api;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/frontend/src/lib/socket.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "socketManager",
    ()=>socketManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
;
;
class SocketManager {
    socket = null;
    isConnected = false;
    connect() {
        if (this.socket && this.isConnected) {
            return this.socket;
        }
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('accessToken');
        if (!token) {
            console.warn('No access token found, cannot connect to socket');
            return null;
        }
        const serverUrl = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000';
        this.socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(serverUrl, {
            auth: {
                token
            },
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000
        });
        this.setupEventHandlers();
        return this.socket;
    }
    setupEventHandlers() {
        if (!this.socket) return;
        this.socket.on('connect', ()=>{
            console.log('Connected to server');
            this.isConnected = true;
        });
        this.socket.on('disconnect', (reason)=>{
            console.log('Disconnected from server:', reason);
            this.isConnected = false;
        });
        this.socket.on('connect_error', (error)=>{
            console.error('Socket connection error:', error);
            this.isConnected = false;
        });
        this.socket.on('error', (error)=>{
            console.error('Socket error:', error);
        });
        // Networking events
        this.socket.on('new_match_found', (data)=>{
            console.log('New match found:', data);
            this.emit('newMatch', data);
        });
        this.socket.on('introduction_received', (data)=>{
            console.log('Introduction received:', data);
            this.emit('introductionReceived', data);
        });
        this.socket.on('meetup_scheduled', (data)=>{
            console.log('Meetup scheduled:', data);
            this.emit('meetupScheduled', data);
        });
        this.socket.on('proximity_alert', (data)=>{
            console.log('Proximity alert:', data);
            this.emit('proximityAlert', data);
        });
        this.socket.on('event_update', (data)=>{
            console.log('Event update:', data);
            this.emit('eventUpdate', data);
        });
        // User status events
        this.socket.on('user_joined', (data)=>{
            console.log('User joined event:', data);
            this.emit('userJoined', data);
        });
        this.socket.on('user_left', (data)=>{
            console.log('User left event:', data);
            this.emit('userLeft', data);
        });
        this.socket.on('user_status_changed', (data)=>{
            console.log('User status changed:', data);
            this.emit('userStatusChanged', data);
        });
        // Chat events
        this.socket.on('user_typing', (data)=>{
            this.emit('userTyping', data);
        });
        this.socket.on('user_stopped_typing', (data)=>{
            this.emit('userStoppedTyping', data);
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    // Event-specific methods
    joinEvent(eventId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('join_event', eventId);
        }
    }
    updateStatus(status) {
        if (this.socket && this.isConnected) {
            this.socket.emit('update_status', status);
        }
    }
    notifyNewMatch(targetUserId, matchData) {
        if (this.socket && this.isConnected) {
            this.socket.emit('notify_new_match', {
                targetUserId,
                matchData
            });
        }
    }
    requestIntroduction(targetUserId, message) {
        if (this.socket && this.isConnected) {
            this.socket.emit('request_introduction', {
                targetUserId,
                message
            });
        }
    }
    scheduleMeetup(participants, meetupData) {
        if (this.socket && this.isConnected) {
            this.socket.emit('schedule_meetup', {
                participants,
                meetupData
            });
        }
    }
    updateLocation(latitude, longitude) {
        if (this.socket && this.isConnected) {
            this.socket.emit('update_location', {
                latitude,
                longitude
            });
        }
    }
    // Chat methods
    joinConversation(conversationId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('join_conversation', conversationId);
        }
    }
    leaveConversation(conversationId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('leave_conversation', conversationId);
        }
    }
    startTyping(conversationId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('typing_start', {
                conversationId
            });
        }
    }
    stopTyping(conversationId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('typing_stop', {
                conversationId
            });
        }
    }
    // Event listener management
    eventHandlers = {};
    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }
    off(event, handler) {
        if (!this.eventHandlers[event]) return;
        if (handler) {
            this.eventHandlers[event] = this.eventHandlers[event].filter((h)=>h !== handler);
        } else {
            this.eventHandlers[event] = [];
        }
    }
    emit(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach((handler)=>handler(data));
        }
    }
    // Utility methods
    isSocketConnected() {
        return this.isConnected;
    }
    getSocket() {
        return this.socket;
    }
}
const socketManager = new SocketManager();
const __TURBOPACK__default__export__ = socketManager;
}),
"[project]/frontend/src/context/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/socket.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const isAuthenticated = !!user;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkAuthStatus();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isAuthenticated) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].connect();
            if (user?.currentEvent) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].joinEvent(user.currentEvent);
            }
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].disconnect();
        }
    }, [
        isAuthenticated,
        user?.currentEvent
    ]);
    const checkAuthStatus = async ()=>{
        try {
            const accessToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('accessToken');
            if (!accessToken) {
                setLoading(false);
                return;
            }
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userAPI"].getProfile();
            setUser(response.data.user);
        } catch (error) {
            console.error('Auth check failed:', error);
            // Clear invalid tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('accessToken');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('refreshToken');
        } finally{
            setLoading(false);
        }
    };
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authAPI"].login({
                email,
                password
            });
            const { user: userData, tokens } = response.data;
            // Store tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('accessToken', tokens.accessToken, {
                expires: 1
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('refreshToken', tokens.refreshToken, {
                expires: 7
            });
            setUser(userData);
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            throw new Error(message);
        }
    };
    const register = async (userData)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authAPI"].register(userData);
            const { user: newUser, tokens } = response.data;
            // Store tokens
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('accessToken', tokens.accessToken, {
                expires: 1
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('refreshToken', tokens.refreshToken, {
                expires: 7
            });
            setUser(newUser);
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            throw new Error(message);
        }
    };
    const logout = ()=>{
        try {
            const refreshToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('refreshToken');
            if (refreshToken) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authAPI"].logout(refreshToken).catch(console.error);
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally{
            // Clear tokens and user state
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('accessToken');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('refreshToken');
            setUser(null);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].disconnect();
        }
    };
    const updateProfile = async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userAPI"].updateProfile(data);
            setUser(response.data.user);
        } catch (error) {
            const message = error.response?.data?.error || 'Profile update failed';
            throw new Error(message);
        }
    };
    const refreshUser = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userAPI"].getProfile();
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };
    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refreshUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/context/AuthContext.tsx",
        lineNumber: 162,
        columnNumber: 10
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
const __TURBOPACK__default__export__ = AuthContext;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__412596a1._.js.map