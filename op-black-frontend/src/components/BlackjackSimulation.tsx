"use client";

import React, { useState } from "react";
import { SimulationForm } from ".";
import { InitialData, SimulationParams } from "./types";
import {
  GeneralStats,
  TotalNetProfitDistributionChart,
  CumulativeNetProfitChart,
  CurrNetProfitDistributionChart,
  RunningCountDistributionChart,
  RunningCountDistributionStatistics,
  RunningCountStatistics,
  CurrNetProfitPerBetChart,
  BetAmountFrequencyChart,
  CountCurrNetProfitChart,
  CurrentBankrollChart,
  CustomProgressBar,
  EnlargingCard,
  EnlargedCardPortal,
} from "../components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import {
  Box,
  Card,
  CardHeader,
  Grid,
  GridItem,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { themeColors } from "@/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BlackjackSimulationProps {
  initialData: InitialData;
  results: any;
  aggregate: any;
  totalBankruptcies: number;
}

const BlackjackSimulation: React.FC<BlackjackSimulationProps> = ({
  initialData,
  results,
  aggregate,
  totalBankruptcies,
}) => {
  const [enlargedCard, setEnlargedCard] = useState<string | null>(null);
  const [enlargedCardContent, setEnlargedCardContent] =
    useState<React.ReactNode | null>(null);

  const handleCardClick = (cardId: string, content: React.ReactNode) => {
    setEnlargedCard(enlargedCard === cardId ? null : cardId);
    setEnlargedCardContent(enlargedCard === cardId ? null : content);
  };

  const closeEnlargedCard = () => {
    setEnlargedCard(null);
    setEnlargedCardContent(null);
  };

  return (
    <div className="w-full h-full bg-bg-grey">
      <div className="w-full flex justify-between items-center p-5">
        <h1 className="text-white font-bold text-4xl">
          Blackjack Simulation Results
        </h1>
        <Button
          size="lg"
          onClick={() => window.location.reload()}
          sx={{
            fontSize: ["10px", "16px", "18px"],
          }}
        >
          Run new simulation
        </Button>
      </div>

      {results && aggregate && (
        <div className="bg-bg-grey">
          <GeneralStats
            results={results}
            totalBankruptcies={totalBankruptcies}
            numGames={initialData.numGames}
            numSimulations={initialData.numSimulations}
            initialBankroll={initialData.initialBankroll}
          />
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} m={5}>
            <GridItem>
              <EnlargingCard
                p={12}
                height="100%"
                cardId={"CurrentBankrollChart"}
                enlargedCard={enlargedCard}
                onCardClick={() =>
                  handleCardClick(
                    "CurrentBankrollChart",
                    <CurrentBankrollChart data={results} pointRadius={0} />
                  )
                }
                backgroundColor={themeColors.LIGHT_GREY}
              >
                <CurrentBankrollChart data={results} pointRadius={0} />
              </EnlargingCard>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 1 }}>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <GridItem>
                  <EnlargingCard
                    p={5}
                    cardId={"TotalNetProfitDistributionChart"}
                    enlargedCard={enlargedCard}
                    onCardClick={() =>
                      handleCardClick(
                        "TotalNetProfitDistributionChart",
                        <TotalNetProfitDistributionChart data={results} />
                      )
                    }
                    backgroundColor={themeColors.LIGHT_GREY}
                  >
                    <TotalNetProfitDistributionChart data={results} />
                  </EnlargingCard>
                </GridItem>
                <GridItem>
                  <EnlargingCard
                    p={5}
                    cardId={"CumulativeNetProfitChart"}
                    enlargedCard={enlargedCard}
                    onCardClick={() =>
                      handleCardClick(
                        "CumulativeNetProfitChart",
                        <CumulativeNetProfitChart data={results} />
                      )
                    }
                    backgroundColor={themeColors.LIGHT_GREY}
                  >
                    <CumulativeNetProfitChart data={results} />
                  </EnlargingCard>
                </GridItem>

                <GridItem>
                  <EnlargingCard
                    p={5}
                    cardId={"CurrNetProfitPerBetChart"}
                    enlargedCard={enlargedCard}
                    onCardClick={() =>
                      handleCardClick(
                        "CurrNetProfitPerBetChart",
                        <CurrNetProfitPerBetChart data={aggregate} />
                      )
                    }
                    backgroundColor={themeColors.LIGHT_GREY}
                  >
                    <CurrNetProfitPerBetChart data={aggregate} />
                  </EnlargingCard>
                </GridItem>
                <GridItem>
                  <EnlargingCard
                    height="100%"
                    p={5}
                    cardId={"BetAmountFrequencyChart"}
                    enlargedCard={enlargedCard}
                    onCardClick={() =>
                      handleCardClick(
                        "BetAmountFrequencyChart",
                        <BetAmountFrequencyChart data={aggregate} />
                      )
                    }
                    backgroundColor={themeColors.LIGHT_GREY}
                  >
                    <BetAmountFrequencyChart data={aggregate} />
                  </EnlargingCard>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>

          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap={4}
            m={5}
          >
            <GridItem>
              <EnlargingCard
                p={5}
                cardId={"CountCurrNetProfitChart"}
                enlargedCard={enlargedCard}
                onCardClick={() =>
                  handleCardClick(
                    "CountCurrNetProfitChart",
                    <CountCurrNetProfitChart data={aggregate} />
                  )
                }
                backgroundColor={themeColors.LIGHT_GREY}
                className="justify-center flex h-full"
              >
                <CountCurrNetProfitChart data={aggregate} />
              </EnlargingCard>
            </GridItem>
            <GridItem>
              <EnlargingCard
                p={5}
                boxShadow="xl"
                cardId={"CurrNetProfitDistributionChart"}
                enlargedCard={enlargedCard}
                onCardClick={() =>
                  handleCardClick(
                    "CurrNetProfitDistributionChart",
                    <CurrNetProfitDistributionChart data={results} />
                  )
                }
                backgroundColor={themeColors.LIGHT_GREY}
                className="justify-center flex h-full"
              >
                <CurrNetProfitDistributionChart data={results} />
              </EnlargingCard>
            </GridItem>
            <GridItem>
              <EnlargingCard
                p={5}
                cardId={"RunningCountDistributionChart"}
                enlargedCard={enlargedCard}
                onCardClick={() =>
                  handleCardClick(
                    "RunningCountDistributionChart",
                    <RunningCountDistributionChart data={aggregate} />
                  )
                }
                backgroundColor={themeColors.LIGHT_GREY}
              >
                <RunningCountDistributionChart data={aggregate} />
                <RunningCountDistributionStatistics data={aggregate} />
              </EnlargingCard>
            </GridItem>
          </Grid>
        </div>
      )}
      {enlargedCard && enlargedCardContent && (
        <>
          <p>sdsd</p>
          <EnlargedCardPortal onClose={closeEnlargedCard}>
            {enlargedCardContent}
          </EnlargedCardPortal>
        </>
      )}
    </div>
  );
};

export default BlackjackSimulation;
