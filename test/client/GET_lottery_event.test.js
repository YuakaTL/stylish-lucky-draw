import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
dotenv.config();

const apiEndpoint = "/api/v1/lottery/event";
let headers = { Authorization: "Bearer " + process.env.TEST_ACCESS_TOKEN };
let params = { event_id: 1 };

describe(`GET ${apiEndpoint}`, () => {
    beforeEach(() => {
        headers = { Authorization: "Bearer " + process.env.TEST_ACCESS_TOKEN };
        params = { event_id: 1 };
    });

    //* 200 response check
    it("should response with a 200 and a list of lottery events", async () => {
        let lotteryEvent;
        if (process.env.USE_MOCK_DATA) {
            lotteryEvent = MOCK_DATA.mockLotteryEventResponse;
            console.log("using mock data");
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            console.log("not using mock data");

            lotteryEvent = response.body;
        }

        expect(lotteryEvent).toHaveProperty("code", CODE.success);
        expect(lotteryEvent).toHaveProperty("message", "取得成功");
        expect(lotteryEvent).toHaveProperty("event_data");
        expect(Array.isArray(lotteryEvent.event_data)).toBe(true);
        // expect(lotteryList).toHaveProperty("next_paging");

        //* 檢查每一個 event 中的內容是否正確
        for (const event of lotteryEvent.event_data) {
            expect(event).toHaveProperty("discount_name");
            expect(typeof event.discount_name).toBe("string");
            expect(event).toHaveProperty("discount_value");
            expect(typeof event.discount_value).toBe("number");
            expect(event).toHaveProperty("threshold");
            expect(typeof event.threshold).toBe("number");
            expect(event).toHaveProperty("inventory");
            expect(typeof event.inventory).toBe("number");
            expect(Number.isInteger(event.inventory)).toBe(true);
            expect(event.inventory).toBeGreaterThanOrEqual(0);
        }
    });

    //* access_token not provided
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is undefined`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });

    //* access_token is not correct
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is not correct`, async () => {
        let error;
        headers.Authorization = `Bearer ${process.env.TEST_ACCESS_TOKEN}wrong`;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });
    //* event_id error check(not provided)
    it(`should response with a CODE ${CODE.queryRequiredError} if the params is undefined`, async () => {
        let error;
        params = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });
    //* event_id error check(not provided)
    it(`should response with a CODE ${CODE.inputValueInvalidError} if the event_id is invalid`, async () => {
        let error;
        params.event_id = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* event_id error check(invalid value)
    it(`should response with a CODE ${CODE.inputValueInvalidError} if the event_id is invalid`, async () => {
        let error;
        params.event_id = "wrong type !!";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .get(apiEndpoint)
                .set(headers)
                .query(params)
                .expect("Content-Type", /json/)
                .expect(200);
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
});
