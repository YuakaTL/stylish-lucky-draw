import Image from "next/image";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import CustomButton from "@/components/button";
import Coupon from "@/components/card";
import banner from "/public/banner.png";
import product from "/public/product.png";

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [openUserCouponList, setOpenUserCouponList] = useState(false);
  const [randomDiscount, setRandomDiscount] = useState();
  const [randomDiscountTitle, setRandomDiscountTitle] = useState("抽獎中...");
  const [randomDiscountDescription, setRandomDiscountDescription] =
    useState("");
  const [countdownText, setCountdownText] = useState("00:00:30");
  const [isPrizeDone, setIsPrizeDone] = useState(false);
  const [drawingResult, setDrawingResult] = useState({});

  useEffect(() => {
    let countDownNum = 30;
    const timer = setInterval(() => {
      if (isPrizeDone && countDownNum > 0) {
        countDownNum--;
        const hours = Math.floor(countDownNum / 3600);
        const minutes = Math.floor((countDownNum % 3600) / 60);
        const seconds = countDownNum % 60;
        setCountdownText(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        clearInterval(timer);
        // 倒數結束後，代表使用者沒有領取優惠券
        // axios.put();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPrizeDone, setCountdownText]);

  const showDrawingModal = () => {
    setIsDrawing(true);
    getPrize();
  };

  const getPrize = () => {
    // const result = axios.get();
    const discountList = [1, 5, 8, 9];
    let discount = 0;
    function createMyRand(n) {
      let randomVal = Math.floor(Math.random() * n);
      return function () {
        //透過 +1 ~ +n-1 後對 n 取餘數就不會重複了
        randomVal = (Math.floor(Math.random() * (n - 1)) + 1 + randomVal) % n;
        return randomVal;
      };
    }
    const getNextRand = createMyRand(discountList.length);
    const randomDiscountTimer = setInterval(() => {
      discount = discountList[getNextRand()];
      setRandomDiscount(discount);
    }, 150);

    setTimeout(() => {
      clearInterval(randomDiscountTimer);
      setIsPrizeDone(true);
      // 判斷 result 來決定要顯示什麼樣的內容，目前預設為 random 值
      // setDrawingResult({result});
      setRandomDiscountTitle("恭喜你");
      setRandomDiscountDescription(`獲得 ${discount} 折優惠券`);
    }, 3000);
  };

  const resetDrawing = () => {
    setIsPrizeDone(false);
    setCountdownText("00:00:30");
    setRandomDiscountTitle("抽獎中...");
    setRandomDiscountDescription();
  };

  const handleDrawingModalOk = () => {
    setIsDrawing(false);
    resetDrawing();
    // 使用者領取優惠券
    // axios.put(drawingResult);
  };
  const handleDrawingModalCancel = () => {
    setIsDrawing(false);
    resetDrawing();
    // 使用者不領取優惠券
    // axios.put(drawingResult);
  };

  return (
    <main>
      <>
        <Image
          alt="banner"
          src={banner}
          width={430}
          height={357}
          sizes="100vw"
          className="h-auto w-full shadow-2"
          priority={true}
        />
        <div className="mt-5 px-6 pb-9 pt-6 text-center">
          <h2 className="text-2xl">行銷文案</h2>
          <p className="mt-5 text-left">
            計俱前反。被感白弱淼了親馨啼認杭前；峻仲絆何祿霖傳了認一和。墨神試肝？？統學，畢字二論。禧清我到受肛乘凰，畸，進，各更茅我娜手還轉前方妳之比、。檔性是何球疾望堡出式資號背交，通，動的罩，、淨、的神你頸
          </p>
        </div>
        <Image
          alt="product"
          src={product}
          width={430}
          height={208}
          sizes="100vw"
          className="mt-5 h-auto w-full shadow-2"
          priority={true}
        />

        <div className="mx-6 mt-10 flex justify-center gap-x-5">
          <CustomButton
            text="抽獎"
            className="w-[180px] bg-purple"
            onClick={showDrawingModal}
          />
          <CustomButton
            text="已獲得"
            className="w-[180px] bg-gray"
            onClick={() => setOpenUserCouponList(true)}
          />
        </div>

        <div className="mt-20 bg-[#FFE99C] px-6 pb-12 pt-7 text-center">
          <h2 className="text-2xl">即時獲獎通知</h2>
          <div className="mt-8 h-96 overflow-y-auto">
            <Coupon
              discount="9"
              title="可愛的貓貓"
              description="獲得夏日9折券"
              textAlign="left"
            />
            <Coupon
              discount="8"
              title="可愛的狗狗"
              description="獲得全站8折券"
              textAlign="left"
            />
            <Coupon
              discount="5"
              title="不可愛的貓貓"
              description="獲得爆殺5折券"
              textAlign="left"
            />
          </div>
        </div>

        <div className="mt-8 px-6 text-center">
          <h2 className="text-2xl">活動說明</h2>
          <ol className=" mt-5 list-decimal text-left">
            <li>
              活動規則：本次抽獎活動由ABC有限公司舉辦。參加者需完成線上報名，報名截止時間為2023年5月31日。本次活動獎品為iPhone
              14一部，總計1名中獎者。抽獎方式為電子抽獎，抽獎結果將於2023年6月5日公佈於ABC公司官網及社交媒體平台上。
            </li>
            <li>
              參與資格：本次活動限年滿18歲且身在台灣地區的參加者參與。主辦方有權利根據需要對參加資格進行調整。
            </li>
            <li>
              獎項設計：本次活動的獎品為最新的iPhone
              14一部，價值約40,000元台幣。
            </li>
            <li>
              抽獎方式：本次抽獎活動使用隨機抽獎方式，由專業的抽獎工具進行抽獎，抽獎過程透明公開。
            </li>
            <li>
              活動宣傳：本次活動宣傳渠道包括ABC公司官網、社交媒體平台（Facebook、Instagram、Twitter）等。活動宣傳期間為2023年5月1日至5月31日。
            </li>
            <li>
              獎項領取：中獎者需要在2023年6月5日至6月30日之間聯繫主辦方，提供中獎截圖及個人資料以核對身份，再由主辦方與中獎者協調獎品領取方式。如中獎者未在規定時間內聯繫主辦方，視為自動放棄獎品。
            </li>
            <li>
              聯繫方式：如有任何問題或疑問，請聯繫ABC公司客服中心：客服電話：0800-123-456，客服郵箱：service@abc.com。
            </li>
            <li>
              請注意：本次抽獎活動遵守當地法律法規，主辦方有權利在活動期間或結束後進行相關調整或修改。
            </li>
          </ol>
        </div>

        <Modal
          title="已獲得獎項"
          open={openUserCouponList}
          onCancel={() => setOpenUserCouponList(false)}
          centered={true}
          footer={[
            <CustomButton
              key="submit"
              text="確認"
              className="w-full bg-purple"
              onClick={() => setOpenUserCouponList(false)}
            />,
          ]}
        >
          <div className="h-[315px] overflow-y-auto">
            <Coupon discount="9" title="夏日9折券" />
            <Coupon discount="8" title="全站8折券" />
            <Coupon discount="5" title="爆殺5折券" />
            <Coupon discount="1" title="痛哭1折券" />
          </div>
        </Modal>

        <Modal open={isDrawing} centered={true} closable={false} footer={null}>
          <Coupon
            discount={randomDiscount}
            title={randomDiscountTitle}
            description={randomDiscountDescription}
          />
          <h3
            className={`${
              isPrizeDone ? "block" : "invisible"
            } mx-4 mt-5 text-base`}
          >
            領獎倒數
          </h3>
          <div
            className={`${
              isPrizeDone ? "block" : "invisible"
            } text-center text-4xl`}
          >
            {countdownText}
          </div>
          {isPrizeDone ? (
            <div className="mx-4 mb-12 mt-6 flex gap-5">
              <CustomButton
                key="getPrize"
                text="領取"
                className={`${
                  isPrizeDone ? "" : "cursor-not-allowed"
                } w-full bg-purple`}
                onClick={handleDrawingModalOk}
              />
              <CustomButton
                key="cancel"
                text="取消"
                className="w-full bg-gray"
                onClick={handleDrawingModalCancel}
              />
            </div>
          ) : (
            <CustomButton
              text="抽獎中"
              className="mb-12 mt-6 w-full cursor-not-allowed bg-gray"
            />
          )}
        </Modal>
      </>
    </main>
  );
}
