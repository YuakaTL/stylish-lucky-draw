import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/lottery/member";
const apiEndpoint = "http://localhost:5000/api/v1/lottery/member";
const headers = { Authorization: `Bearer ${process.env.TEST_ACCESS_TOKEN}` };
let params = { member_id: 1 };

describe(`GET ${apiEndpoint}`, () => {
    beforeEach(() => {
        params = { member_id: 1 };
    });

    //* 成功回覆後的內容檢查
    it("should response with a 200 and a list of lottery value by specific member id", async () => {
        let lotteryValue;
        if (process.env.USE_MOCK_DATA) {
            lotteryValue = MOCK_DATA.mockLotteryMemberResponse;
            console.log("using mock data");
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            console.log("not using mock data");
            const response = await getResponseFromAPIEndpoint();
            lotteryValue = response.body;
        }

        expect(lotteryValue).toHaveProperty("code", CODE.success);
        expect(lotteryValue).toHaveProperty("message", "取得成功");
        expect(lotteryValue).toHaveProperty("data");
        expect(Array.isArray(lotteryValue.data)).toBe(true);
        // expect(lotteryList).toHaveProperty("next_paging");

        for (const value of lotteryValue.data) {
            expect(value).toHaveProperty("discount_name");
            expect(typeof value.discount_name).toBe("string");
            expect(value).toHaveProperty("discount_value");
            expect(typeof value.discount_value).toBe("number");
        }
    });

    //* 整個params 不存在
    it(`should response with 200 and CODE ${CODE.queryRequiredError} if the params is undefined`, async () => {
        let error;
        params = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });

    //* access_token 不存在
    it(`should response with 200 and CODE ${CODE.accessTokenError} if the access_token is not provided`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });

    //* access_token 不正確
    it(`should response with 200 and CODE ${CODE.accessTokenError} if the access_token is not correct`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });

    //* member_id 不存在
    it(`should response with 200 and CODE ${CODE.queryRequiredError} if the member_id is not provided`, async () => {
        let error;
        params.member_id = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });

    //* member_id 型別不符
    it(`should response with 200 and CODE ${CODE.inputValueInvalidError} if the member_id is invalid`, async () => {
        let error;
        params.member_id = "invalid member_id type !";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });

    it(`should response with 200 and CODE ${CODE.memberNoDiscountError}`, async () => {
        let error;
        params.member_id = 999999;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockMemberNoDiscountError;
        } else {
            // const response = await request(app)
            //     .get(apiEndpoint)
            //     .set(headers)
            //     .query(params)
            //     .expect("Content-Type", /json/)
            //     .expect(200);
            const response = await getResponseFromAPIEndpoint();
            error = response.body;
        }
        expect(error).toHaveProperty("code", CODE.memberNoDiscountError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.memberNoDiscountErrorMessage
        );
    });
});

/**
 * * Get response from API endpoint
 * @returns
 */
async function getResponseFromAPIEndpoint() {
    const response = await axios.get(`${apiEndpoint}`, {
        headers,
        params,
    });

    return response;
}
