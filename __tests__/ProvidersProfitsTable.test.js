import React from "react";
import TraderCard from "../src/components/TraderCard";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const stats = [
    {
      "0": {
        providerId: "5d7a026e6c20cd63ec6d1d22",
        name: "Blockchain Sparrows Titanium ",
        logoUrl:
          "https://www.blockchainsparrows.com/wp-content/uploads/2019/11/BLOCKCHAIN-TITANIUM.png",
        quote: "BTC",
        base: false,
        _id: "5d7a026e6c20cd63ec6d1d22",
        signals: 261,
        sumTotalInvested: "43.928826718904",
        sumTotalProfit: "1.022523756462",
        sumTotalProfitFromClosed: "1.027469669787",
        sumTotalProfitFromOpened: "-0.004945913325",
        sumPositions: "8391",
        sumUnclosedPositions: "43",
        sumWins: "7925",
        sumLosses: "466",
        sumDCAs: "0",
        sumDCAWins: "0",
        sumDCALosses: "0",
        sumSoldByTakeProfit: "8134",
        sumSoldManually: "178",
        sumSoldByTrailingStop: "35",
        sumSoldByStopLoss: "0",
        sumSoldByTTL: "0",
        sumSoldBySignal: "0",
        sumSoldByOther: "1",
        avgAverageProfit: "0.0001178419202337662337662337662337662",
        avgAveragePositionSize: "0.005679999234515151515151515151515152",
        avgAverageDCAsPerPosition: "0",
        avgAverageClosingTime: "260088.1164069264069264069264069264",
        avgAverageEntryPrice: "0.00007838879525108225108225108225108225",
        avgAverageExitPrice: "0.00008020558064935064935064935064935065",
        avgAverageAveragePrice: "0.00007832126283549783549783549783549784",
        avgAverageProfitPercentage: "2.028051948051948051948051948051948",
        avgI24hHigherPricePercentage: "3.610842911877394636015325670498084",
        avgI24hLowerBeforeHigherPricePercentage: "-1.414904214559386973180076628352490",
        avgI24hLowerPricePercentage: "-3.240038314176245210727969348659004",
        avgI24hSecondsUntilHigherPrice: "37706.19540229885057471264367816092",
        avgI24hSecondsUntilLowerBeforeHigherPrice: "14419.80076628352490421455938697318",
        avgI24hSecondsUntilLowerPrice: "45211.86206896551724137931034482759",
        avgI3dHigherPricePercentage: "6.769195402298850574712643678160920",
        avgI3dLowerBeforeHigherPricePercentage: "-2.327586206896551724137931034482759",
        avgI3dLowerPricePercentage: "-4.789118773946360153256704980842912",
        avgI3dSecondsUntilHigherPrice: "109434.6896551724137931034482758621",
        avgI3dSecondsUntilLowerBeforeHigherPrice: "40406.55172413793103448275862068966",
        avgI3dSecondsUntilLowerPrice: "117582.2413793103448275862068965517",
        avgI1WHigherPricePercentage: "11.36869731800766283524904214559387",
        avgI1WLowerBeforeHigherPricePercentage: "-3.316168582375478927203065134099617",
        avgI1WLowerPricePercentage: "-7.411187739463601532567049808429119",
        avgI1WSecondsUntilHigherPrice: "243612.4444444444444444444444444444",
        avgI1WSecondsUntilLowerBeforeHigherPrice: "86326.42145593869731800766283524904",
        avgI1WSecondsUntilLowerPrice: "280561.8352490421455938697318007663",
        avgI1mHigherPricePercentage: "20.94417624521072796934865900383142",
        avgI1mLowerBeforeHigherPricePercentage: "-7.186551724137931034482758620689655",
        avgI1mLowerPricePercentage: "-16.61367816091954022988505747126437",
        avgI1mSecondsUntilHigherPrice: "874084.7701149425287356321839080460",
        avgI1mSecondsUntilLowerBeforeHigherPrice: "416544.7892720306513409961685823755",
        avgI1mSecondsUntilLowerPrice: "1377281.946360153256704980842911877",
        maxMaxInvestment: "0.129205156000",
        maxMaxReturnOfInvestment: "0.003246586186",
        maxMaxDCAProfit: "0",
        maxMaxBuyingPrice: "0.001817700000",
        maxMaxExitPrice: "0.001835900000",
        maxSlowerClosedPositionInSeconds: "3905775",
        minMinInvestment: "0.000128900000",
        minMinReturnOfInvestment: "-0.021112385955",
        minMinDCAProfit: "0",
        minMinBuyingPrice: "4.40000E-7",
        minMinExitPrice: "4.50000E-7",
        minFasterClosedPositionInSeconds: "810",
        sumReturnOfInvestment: "44.951350475366",
        sumClosedPositions: "8348",
        percentageProfit: "2.327682828874586896329621508233564",
        winRate: "94.44643069955905136455726373495412",
      },
    },
  ];
  const tree = renderer.create(<ProvidersProfitsTable stats={stats} />).toJSON();
  expect(tree).toMatchSnapshot();
});