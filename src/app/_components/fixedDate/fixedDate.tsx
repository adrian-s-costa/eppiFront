"use client"

import { Table, Tabs } from "flowbite-react";
import Tables from "@/app/_components/table/table";
import { Skeleton } from "@/components/ui/skeleton"

export default function FixedDate({ loading, content, setActiveValues }: any){

const changeChartData = (activeTab: number) => {
  if (activeTab === 0) setActiveValues([{ activeTab, valores: "Valores", impressions: content.measures.day.view.currentDayCount, click: content.measures.day.click.clickCurrentDayCount, ctr: content.measures.day.ctr.currentDayCTR}])
  if (activeTab === 1) setActiveValues([{ activeTab, valores: "Valores", impressions: content.measures.week.view.currentWeekCount, click: content.measures.week.click.clickCurrentWeekCount, ctr: content.measures.week.ctr.currentWeekCTR}])
  if (activeTab === 2) setActiveValues([{ activeTab, valores: "Valores", impressions: content.measures.month.view.currentMonthCount, click: content.measures.month.click.clickCurrentMonthCount, ctr: content.measures.month.ctr.currentMonthCTR}])
  if (activeTab === 3) setActiveValues([{ activeTab, valores: "Valores", impressions: content.measures.year.view.currentYearCount, click: content.measures.year.click.clickCurrentYearCount, ctr: content.measures.year.ctr.currentYearCTR}])    
}


return <>
        {loading ? (
          <>
            <Skeleton className="h-[50px] w-full rounded-xl bg-white"/>
            <Skeleton className="h-[92px] w-full rounded-xl bg-white mt-5 mb-3"/>
          </>
        ) : (
          <>
            <div className="bg-white absolute w-full h-[50px] rounded-md">{" "}</div>
            <Tabs aria-label="Pills" style="pills" className="justify-between mb-0" onActiveTabChange={(activeTab)=>{changeChartData(activeTab);
            }}>
              <Tabs.Item active title="Dia" className="enabled:bg-black" >
                <Tables
                  impressions={content && content.measures && content.measures.day.view.currentDayCount}
                  clicks={content && content.measures && content.measures.day.click.clickCurrentDayCount}
                  CTR={content && content.measures && content.measures.day.ctr.currentDayCTR}
                />
              </Tabs.Item>
              <Tabs.Item title="Semana">
                <Tables
                  impressions={content && content.measures && content.measures.week.view.currentWeekCount}
                  clicks={content && content.measures && content.measures.week.click.clickCurrentWeekCount}
                  CTR={content && content.measures && content.measures.week.ctr.currentWeekCTR}
                />
              </Tabs.Item>
              <Tabs.Item title="Mês">
                <Tables
                  impressions={content && content.measures && content.measures.month.view.currentMonthCount}
                  clicks={content && content.measures && content.measures.month.click.clickCurrentMonthCount}
                  CTR={content && content.measures && content.measures.month.ctr.currentMonthCTR}
                />
              </Tabs.Item>
              <Tabs.Item title="Ano">
                <Tables
                  impressions={content && content.measures && content.measures.year.view.currentYearCount}
                  clicks={content && content.measures && content.measures.year.click.clickCurrentYearCount}
                  CTR={content && content.measures && content.measures.year.ctr.currentYearCTR}
                />
              </Tabs.Item>
            </Tabs>
          </>
        )}
    </>
}