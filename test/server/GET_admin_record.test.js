import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/admin/record";
const apiEndpoint = "http://localhost:5000/api/v1/admin/record";
let params = { id: "0", paging: 1, amount: 10 };

describe(`GET ${apiEndpoint}`, () => {
    beforeEach(() => {
        params = { id: "0", paging: 1, amount: 10 };
    });

    //* 成功回覆後的內容檢查
    it("should response with a 200 and a list of winning record", async () => {
        let recordList;
        if (process.env.USE_MOCK_DATA) {
            recordList = MOCK_DATA.mockAdminRecordResponse;
            console.log("using mock data");
        } else {
            console.log("not using mock data");
            try {
                const response = await getResponseFromAPIEndpoint();
                recordList = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(recordList).toHaveProperty("code", CODE.success);
        expect(recordList).toHaveProperty("message", "取得獲獎紀錄");
        expect(recordList).toHaveProperty("data");
        expect(Array.isArray(recordList.data.record)).toBe(true);
        // expect(lotteryList).toHaveProperty("next_paging");

        for (const record of recordList.data.record) {
            expect(record).toHaveProperty("discount_name");
            expect(typeof record.discount_name).toBe("string");
            expect(record).toHaveProperty("discount_value");
            expect(typeof record.discount_value).toBe("number");
            expect(record).toHaveProperty("member_id");
            expect(typeof record.member_id).toBe("string");
            expect(record).toHaveProperty("member_name");
            expect(typeof record.member_name).toBe("string");
            expect(record).toHaveProperty("event_id");
            expect(typeof record.event_id).toBe("string");
            expect(record).toHaveProperty("coupon");
            expect(typeof record.coupon).toBe("string");
            expect(record).toHaveProperty("get_coupon_time");
            expect(typeof record.get_coupon_time).toBe("string");
        }
    });

    //* id type 不正確的 response check
    it("should return 200 and CODE 'inputValueInvalidError' if the type of id is not string", async () => {
        let error;
        params.id = 1;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* paging type 不正確的 response check
    it("should return 200 and CODE 'inputValueInvalidError' if the type of paging is not number", async () => {
        let error;
        params.paging = "error type of paging";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(error).toHaveProperty("code", CODE.inputValueInvalidError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.inputValueInvalidErrorMessage
        );
    });
    //* amount type 不正確的 response check
    it("should return 200 and CODE 'inputValueInvalidError' if the type of amount is not number", async () => {
        let error;
        params.amount = "error type of amount";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockInputValueInvalidError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
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
    const response = await axios.get(`${apiEndpoint}`, {
        params,
    });

    return response;
}
