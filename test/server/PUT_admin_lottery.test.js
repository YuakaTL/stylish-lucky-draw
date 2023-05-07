import * as MOCK_DATA from "../utils/mockData.js";
import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";
import request from "supertest";
import app from "../../server/app.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const apiEndpoint = "/api/v1/admin/lottery";
const apiEndpoint = "http://localhost:5000/api/v1/admin/lottery";
let params = { event_id: 1 };
let input = {
    event_name: "",
    event_start_time: "2023/04/01",
    event_end_time: "2023/04/30",
    is_visible: true,
    status: "pending",
    event_data: [
        {
            discount_name: "夏日九折券",
            discount_value: 0.9,
            threshold: 500,
            inventory: 150,
        },
    ],
};

describe(`POST ${apiEndpoint}`, () => {
    beforeEach(() => {
        params = { event_id: 1 };
        input = {
            event_id: 1,
            event_name: "",
            event_start_time: "2023/06/15",
            event_end_time: "2023/06/25",
            is_visible: true,
            status: "pending",
            event_data: [
                {
                    discount_name: "夏日九折券",
                    discount_value: 0.9,
                    threshold: 500,
                    inventory: 150,
                },
            ],
        };
    });

    //* 測試項目1: 200 response check
    it("should response with a 200 and ", async () => {
        let lotteryEvent;
        if (process.env.USE_MOCK_DATA) {
            lotteryEvent = MOCK_DATA.mockAdminLotteryPutResponse;
            lotteryEvent.data.event_start_time = input.event_start_time;
            lotteryEvent.data.event_end_time = input.event_end_time;
            lotteryEvent.data.is_visible = input.is_visible;
            lotteryEvent.data.status = input.status;
            lotteryEvent.data.event_name = input.event_name;
            console.log("using mock data");
        } else {
            console.log("not using mock data");
            try {
                const response = await getResponseFromAPIEndpoint();
                lotteryEvent = response.data;
            } catch (err) {
                console.error(err);
            }
        }

        expect(lotteryEvent).toHaveProperty("code", CODE.success);
        expect(lotteryEvent).toHaveProperty("message", "修改成功");
        expect(lotteryEvent).toHaveProperty("data");

        expect(lotteryEvent.data).toHaveProperty(
            "event_id",
            expect.any(Number)
        );
        expect(lotteryEvent.data).toHaveProperty(
            "event_name",
            input.event_name
        );
        expect(lotteryEvent.data).toHaveProperty(
            "event_start_time",
            input.event_start_time
        );
        expect(lotteryEvent.data).toHaveProperty(
            "event_end_time",
            input.event_end_time
        );
        expect(lotteryEvent.data).toHaveProperty(
            "is_visible",
            expect.any(Boolean)
        );
        expect(lotteryEvent.data).toHaveProperty("status", expect.any(String));
        expect(lotteryEvent.data).toHaveProperty(
            "event_data",
            expect.any(Array)
        );
        expect(lotteryEvent).toHaveProperty("create_at", expect.any(String));
        expect(lotteryEvent).toHaveProperty("update_at", expect.any(String));
    });

    //* 測試項目2: error request params check
    it(`should response with a code ${CODE.queryRequiredError} if the event_id  is not provided`, async () => {
        let error;
        params = undefined;
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockQueryRequiredError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.queryRequiredError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.queryRequiredErrorMessage
        );
    });

    //* 測試項目3: event_start_time 小於當日日期
    it(`should response with a code ${CODE.StartTimeIncorrectError} if the event_start_time is lower than current date`, async () => {
        let error;
        input.event_start_time = "2020/02/15";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockStartTimeIncorrectError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.StartTimeIncorrectError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.StartTimeIncorrectErrorMessage
        );
    });
    //* 測試項目4: 當 event_end_time 小於 event_start_time 時的處理
    it(`should response with a code ${CODE.EndTimeIncorrectError} if the event_start_time is lower than current date`, async () => {
        let error;
        input.event_start_time = "2023/06/15";
        input.event_end_time = "2023/06/10";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockEndTimeIncorrectError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.EndTimeIncorrectError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.EndTimeIncorrectErrorMessage
        );
    });
    //* 測試項目5: 當 event_start_time 不存在時的處理
    it(`should response with a code ${CODE.EndTimeIncorrectError} if the event_start_time is lower than current date`, async () => {
        let error;
        input.event_start_time = "2023/06/55";
        input.event_end_time = "2023/07/02";
        if (process.env.USE_MOCK_DATA) {
            error = MOCK_DATA.mockEndTimeIncorrectError;
        } else {
            try {
                const response = await getResponseFromAPIEndpoint();
                error = response.data;
            } catch (err) {
                console.error(err);
            }
        }
        expect(error).toHaveProperty("code", CODE.EndTimeIncorrectError);
        expect(error).toHaveProperty(
            "message",
            ERROR_MESSAGE.EndTimeIncorrectErrorMessage
        );
    });
});

/**
 * * Get response from API endpoint
 * @returns
 */
async function getResponseFromAPIEndpoint() {
    const response = await axios.put(`${apiEndpoint}`, input, {
        params: params,
    });

    return response;
}
