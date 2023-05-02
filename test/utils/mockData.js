import CODE from "../utils/customStatusCode.js";
import ERROR_MESSAGE from "../utils/customStatusCodeMessage.js";

export const mockAdminLotteryGetResponse = {
    code: "000",
    message: "取得成功",
    data: [
        {
            event_id: 1,
            event_name: "Lottery 1",
            event_start_time: "2023/05/01",
            event_end_time: "2023/05/31",
            is_visible: true,
            status: "finished",
            total_inventory: 1000,
        },
    ],
};
export const mockError = {
    code: CODE.unknownError,
    message: ERROR_MESSAGE.unknownErrorMessage,
};

export const mockQueryRequiredError = {
    code: CODE.queryRequiredError,
    message: ERROR_MESSAGE.queryRequiredErrorMessage,
};

export const mockInputValueInvalidError = {
    code: CODE.inputValueInvalidError,
    message: ERROR_MESSAGE.inputValueInvalidErrorMessage,
};

export const mockAccessTokenError = {
    code: CODE.accessTokenError,
    message: ERROR_MESSAGE.accessTokenErrorMessage,
};

export const mockAdminRecordResponse = {
    code: "000",
    message: "取得獲獎紀錄",
    data: [
        {
            discount_name: "夏日9折卷",
            discount_value: 0.9,
            member_id: "",
            member_name: "",
            event_id: "",
            coupon: "",
            get_coupon_time: "",
        },
    ],
    next_paging: 2,
};

export const mockLotteryEventResponse = {
    code: "000",
    message: "取得成功",
    event_data: [
        {
            discount_name: "夏日九折券",
            discount_value: 0.9,
            threshold: 500,
            inventory: 150,
        },
    ],
};

export const mockLotteryMemberResponse = {
    code: "000",
    message: "取得成功",
    data: [
        {
            discount_name: "夏日九折券",
            discount_value: 0.9,
        },
    ],
};

export const mockLotteryInfoResponse = {
    code: "000",
    message: "新增成功",
    lottery_data: {
        lottery_id: 1,
        member_id: 1,
        event_id: 1,
        discount_value: 0.9,
        coupon: "jreoig",
        is_received: false,
        create_time: "2023/04/28 21:03:00",
        is_used: false,
    },
};

export const mockAdminLotteryPostResponse = {
    code: "000",
    message: "新增成功",
    data: {
        event_id: 1,
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
    },
    create_at: "2023-04-26T00:00:00.00000",
    update_at: "2023-04-26T00:00:00.00000",
};
