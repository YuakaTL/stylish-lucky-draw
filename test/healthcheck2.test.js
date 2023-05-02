import require from "supertest";
import app from "../server/app.js";

describe(`healthcheck`, () => {
    it("should return 200 OK status", async () => {
        const res = await require(app).get("/api/v1/healthcheck").expect(200);

        // expect(res.body).toHaveProperty("status", "ok");
        expect(res.body).toHaveProperty("status");
    });
});
