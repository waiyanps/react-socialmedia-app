const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
let clients = []; // This should always be an array.

module.exports = function (app) {
    app.ws("/subscribe", (ws, req) => {
        console.log("WS: New connection received");

        ws.on("message", (msg) => {
            const { token } = JSON.parse(msg);
            console.log("WS: token received");

            jwt.verify(token, secret, (err, user) => {
                if (err) {
                    ws.send(JSON.stringify({ error: "Unauthorized" }));
                    return;
                }

                // Ensure clients is an array before pushing a new client
                if (!Array.isArray(clients)) {
                    console.log("WS: clients is not an array, resetting to empty array.");
                    clients = []; // Reset clients to an empty array to avoid further issues
                }

                clients.push({ userId: user.id, ws });

                console.log(`WS: Client added: ${user.id}`);
            });
        });

        ws.on("close", () => {
            console.log("WS: Client disconnected");
            clients = clients.filter((client) => client.ws !== ws);
        });
    });
};
