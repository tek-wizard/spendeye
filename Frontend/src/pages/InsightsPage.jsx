import React, { useState } from "react"
import {
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Skeleton,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

// --- Hooks & Components ---
import { useMonthlyStory } from "../hooks/useMonthlyStory"
import { MonthSelector } from "../components/InsightsPage/MonthSelector"
import { AISummary } from "../components/InsightsPage/AISummary"
import { HeatmapCalendar } from "../components/InsightsPage/HeatmapCalendar"
import { TopCategoriesChart } from "../components/InsightsPage/TopCategoriesChart"
import { NotableTransactions } from "../components/InsightsPage/NotableTransactions"

// A professional skeleton for the entire page
const InsightsPageSkeleton = ({ isDesktop }) =>
  isDesktop ? (
    <Stack spacing={3}>
      <Skeleton
        variant="text"
        width={250}
        height={40}
        sx={{ alignSelf: "center", mb: 1 }}
      />
      <Skeleton variant="rounded" height={100} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Skeleton variant="rounded" height={350} />
        </div>
        <div className="md:col-span-4">
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={300} />
            <Skeleton variant="rounded" height={250} />
          </Stack>
        </div>
      </div>
    </Stack>
  ) : (
    <Stack spacing={3}>
      <Skeleton
        variant="text"
        width={250}
        height={40}
        sx={{ alignSelf: "center" }}
      />
      <Skeleton variant="rounded" height={500} />
    </Stack>
  )

const InsightsPage = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [patternsView, setPatternsView] = useState("when")

  const { data, isLoading, isFetching } = useMonthlyStory(selectedMonth)

  if (isLoading && !data) {
    return <InsightsPageSkeleton isDesktop={isDesktop} />
  }

  return (
    <Box>
      {isDesktop ? (
        // --- DESKTOP LAYOUT ---
        <Stack spacing={3}>
          <MonthSelector
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <AISummary summary={data?.aiSummary} isLoading={isFetching} />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <HeatmapCalendar
                data={data?.heatmapData}
                isLoading={isFetching}
                month={selectedMonth}
              />
            </div>
            <div className="md:col-span-4">
              <Stack spacing={3}>
                <TopCategoriesChart
                  data={data?.categoryBreakdown}
                  isLoading={isFetching}
                />
                <NotableTransactions
                  data={data?.notableTransactions}
                  isLoading={isFetching}
                />
              </Stack>
            </div>
          </div>
        </Stack>
      ) : (
        // --- MOBILE LAYOUT ---
        <Stack spacing={3}>
          <MonthSelector
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              "& .swiper": { height: "100%" },
              "& .swiper-wrapper": { height: "100%" },
              "& .swiper-pagination": {
                position: "relative",
                bottom: 0,
                mt: 2,
              },
              "& .swiper-pagination-bullet-active": { bgcolor: "primary.main" },
            }}
          >
            <CardContent>
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={20}
              >
                <SwiperSlide style={{ height: "100%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      minHeight: 400,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "stretch",
                    }}
                  >
                    <AISummary
                      summary={data?.aiSummary}
                      isLoading={isFetching}
                    />
                  </Box>
                </SwiperSlide>
                <SwiperSlide style={{ height: "100%" }}>
                  <Stack spacing={2} sx={{ height: "100%", minHeight: 400 }}>
                    <ToggleButtonGroup
                      value={patternsView}
                      exclusive
                      onChange={(e, v) => v && setPatternsView(v)}
                      fullWidth
                      size="small"
                    >
                      <ToggleButton value="when">When</ToggleButton>
                      <ToggleButton value="where">Where</ToggleButton>
                    </ToggleButtonGroup>
                    {patternsView === "when" ? (
                      <HeatmapCalendar
                        data={data?.heatmapData}
                        isLoading={isFetching}
                        month={selectedMonth}
                      />
                    ) : (
                      <TopCategoriesChart
                        data={data?.categoryBreakdown}
                        isLoading={isFetching}
                      />
                    )}
                  </Stack>
                </SwiperSlide>
                <SwiperSlide style={{ height: "100%" }}>
                  <Box sx={{ height: "100%", minHeight: 400 }}>
                    <NotableTransactions
                      data={data?.notableTransactions}
                      isLoading={isFetching}
                    />
                  </Box>
                </SwiperSlide>
              </Swiper>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  )
}

export default InsightsPage
