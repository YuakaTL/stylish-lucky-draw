import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/lottery/info";
const apiEndpoint = "http://localhost:5000/api/v1/lottery/info";
let input = { member_id: 1, discount_id: 1 };
let headers = { Authorization: `Bearer ${process.env.TEST_ACCESS_TOKEN}` };

describe(`POST ${apiEndpoint}`, () => {
    beforeEach(() => {
        input = { member_id: 1, discount_id: 1 };
        headers = { access_token: `Bearer ${process.env.TEST_ACCESS_TOKEN}` };
    });

    //* 200 response check
    it("should response with a 200 and a list of lottery events", async () => {
        let lotteryInfo;
        if (process.env.USE_MOCK_DATA) {
            lotteryInfo = MOCK_DATA.mockLotteryInfoResponse;
            console.log("using mock data");
        } else {
            console.log("not using mock data");
            try {
                const response = await getResponseFromAPIEndpoint();
                lotteryInfo = response.data;
            } catch (err) {
                console.log(err);
            }
        }

        expect(lotteryInfo).toHaveProperty("code", CODE.success);
        expect(lotteryInfo).toHaveProperty("message", "新增成功");
        expect(lotteryInfo).toHaveProperty("data");
        expect(lotteryInfo.data).toHaveProperty(
            "lottery_id",
            expect.any(Number)
        );
        expect(lotteryInfo.data).toHaveProperty("member_id", input.member_id);
        expect(lotteryInfo.data).toHaveProperty(
            "discount_value",
            expect.any(Number)
        );

        expect(lotteryInfo.data).toHaveProperty("coupon", expect.any(String));
        const couponRegex = /^[a-zA-Z\d]{10}$/;
        expect(lotteryInfo.data.coupon).toMatch(couponRegex);
        expect(lotteryInfo.data).toHaveProperty(
            "is_receive",
            expect.any(Boolean)
        );
        expect(lotteryInfo.data).toHaveProperty(
            "create_time",
            expect.any(String)
        );
        expect(lotteryInfo.data).toHaveProperty("is_used", expect.any(Boolean));
    });

    //* access_token not provided
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is undefined`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
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
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.accessTokenError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.accessTokenErrorMessage
        );
    });

    //* params value error check (member_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params value is invalid`, async () => {
        let error;
        input.member_id = undefined;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* params value error check (member_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.member_id = -200;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* params value error check (discount_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.discount_id = -200;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
});

/**
 * * Get response from API endpoint
 * @returns
 */
async function getResponseFromAPIEndpoint() {
    const response = await axios.post(`${apiEndpoint}`, input, {
        headers,
    });

    return response;
}
