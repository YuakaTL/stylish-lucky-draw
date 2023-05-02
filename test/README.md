# API test 說明

## 使用時機
後端開發完 API 後再推上commit前需要先先通過本地的 API 測試。

## 事先準備
1. cd to the test directory
2. `yarn install` 來安裝需要的 package (jest, supertest)
> 註: 沒有 yarn 的話可以使用 `npm install -g yarn` 先安裝


## 使用方式
- `yarn test` 來 run 所有的 test file 
- `yarn testwatch` 來在 watch mode 下進行test
  - will reload test on saved changes
- `yarn test [XXXX.test.js]`: run 單一測試檔，推薦使用這個

> ⚠️註: 單一 API endpoint 至少要通過 test.js 的驗證，test file 的命名方式為{http method + api endpoint}，例: GET_admin_lottery.test.js
