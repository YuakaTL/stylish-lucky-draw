import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
dotenv.config();

const apiEndpoint = "/api/v1/lottery/info";
let input = { member_id: 1, discount_id: 1, coupon: "couponCode" };
let headers = { Authorization: `Bearer ${process.env.TEST_ACCESS_TOKEN}` };

describe(`POST ${apiEndpoint}`, () => {
    beforeEach(() => {
        input = { member_id: 1, discount_id: 1, coupon: "couponCode" };
        headers = { access_token: `Bearer ${process.env.TEST_ACCESS_TOKEN}` };
    });

    //* 200 response check
    it("should response with a 200 and a list of lottery events", async () => {
        let lotteryInfo;
        if (process.env.USE_MOCK_DATA) {
            lotteryInfo = MOCK_DATA.mockLotteryInfoResponse;
            console.log("using mock data");
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .send(input)
                .expect("Content-Type", /json/)
                .expect(200);
            console.log("not using mock data");

            lotteryInfo = response.body;
        }

        expect(lotteryInfo).toHaveProperty("code", CODE.success);
        expect(lotteryInfo).toHaveProperty("message", "新增成功");
        expect(lotteryInfo).toHaveProperty("lottery_data");
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "lottery_id",
            expect.any(Number)
        );
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "member_id",
            input.member_id
        );
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "discount_value",
            expect.any(Number)
        );
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "coupon",
            expect.any(String)
        );
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "is_receive",
            expect.any(Boolean)
        );
        //TODO: check the time format for "create_time"
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "create_time",
            expect.any(String)
        );
        expect(lotteryInfo.lottery_data).toHaveProperty(
            "is_used",
            expect.any(Boolean)
        );
    });

    //* access_token not provided
    it(`should response with 200 and a CODE ${CODE.accessTokenError} if the access_token is undefined`, async () => {
        let error;
        headers.Authorization = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockAccessTokenError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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

    //* params not complete error check (coupon is not provided)
    it(`should response with a ${CODE.queryRequiredError} if the request params is not complete`, async () => {
        let error;
        const input = { member_id: 123, discount_id: 456 };

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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

    //* params value error check (member_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params value is invalid`, async () => {
        let error;
        input.member_id = undefined;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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
    //* params value error check (member_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.member_id = -200;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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
    //* params value error check (discount_id is not exist or invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.discount_id = -200;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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
    //* params value error check (coupon type is invalid)
    it(`should response with a ${CODE.inputValueInvalidError} if the request params is not provided`, async () => {
        let error;
        input.coupon = false;

        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            const response = await request(app)
                .post(apiEndpoint)
                .set(headers)
                .query(input)
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