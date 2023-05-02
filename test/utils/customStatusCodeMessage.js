export default {
    queryRequiredErrorMessage: "001: 未帶必要欄位、格式不符",
    EndTimeIncorrectErrorMessage: "002: 結束時間需大於開始時間",
    StartTimeIncorrectErrorMessage: "003: 開始時間需大於設定當日",
    lessThan10MinModifyErrorMessage:
        "004: 活動開始前10分鐘後除隱藏外不可修改任何欄位",
    lotteryDrawExceed30SecErrorMessage: "005: 抽獎獎品超過30秒未領取",
    inputValueInvalidErrorMessage:
        "100: params 或 request body 輸入值不符合規定(type錯誤)",
    accessTokenErrorMessage:
        "101: Authorization header 沒有帶 access_token(或錯誤)",
    unknownErrorMessage: "999: 未知的錯誤",
};
