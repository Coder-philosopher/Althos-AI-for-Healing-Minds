'use client'

import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Legend,
  Tooltip,
  DoughnutController,
  PolarAreaController,
  BubbleController,
} from 'chart.js'
import { Bar, Line, Pie, Radar, Bubble } from 'react-chartjs-2'
import { Activity, Users, BarChart3, TrendingUp } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Legend,
  Tooltip,
  DoughnutController,
  PolarAreaController,
  BubbleController
)

interface OrgDashboardViewProps {
  orgCode: string
}

export default function OrgDashboardView({ orgCode }: OrgDashboardViewProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timeout)
  }, [orgCode])

  // Hardcoded Data
  const dateLabels = ['11 Oct', '12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct']
  const dailyLoginCounts = [5, 9, 13, 10, 12, 11, 10]
  const shareFeatureUsage = [5, 7, 2, 8, 10, 9, 7]
  const userCount = 23
  const totalShares = 52

  const alertRiskData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Alerts',
        data: [35, 14, 1],
        backgroundColor: ['#F1C40F', '#E67E22', '#E74C3C'],
      },
    ],
  }

  const avgMoodData = {
    labels: ['Valence', 'Arousal', 'Focus', 'Energy', 'Calm', 'Happiness'],
    datasets: [
      {
        label: 'Average',
        data: [0.5, -0.2, 0.8, 0.4, -0.1, 0.7],
        backgroundColor: 'rgba(236,127,169,0.3)',
        borderColor: '#EC7FA9',
        borderWidth: 2,
      },
    ],
  }

  const monthlyLoginData = {
    labels: ['Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Logins',
        data: [32, 40, 67],
        backgroundColor: '#BE5985',
      },
    ],
  }

  const bubbleData = {
    datasets: [
      {
        label: 'User Activity',
        data: [
          { x: 3, y: 20, r: 12 },
          { x: 6, y: 15, r: 8 },
          { x: 9, y: 25, r: 6 },
          { x: 13, y: 10, r: 6 },
          { x: 19, y: 25, r: 4 },
          { x: 20, y: 10, r: 5 },
          { x: 21, y: 20, r: 9 },
          { x: 22, y: 12, r: 6 },
        ],
        backgroundColor: 'rgba(236,127,169,0.8)',
      },
    ],
  }

  return (
    <section
      aria-label={`Organization dashboard for ${orgCode}`}
      className="max-w-7xl mx-auto space-y-12 px-6 md:px-10 py-14"
    >
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#BE5985] tracking-tight mb-3 uppercase">
          {orgCode.toUpperCase()} Dashboard
        </h1>
        <p className="text-[#A03768]/70 text-base md:text-lg max-w-2xl mx-auto">
          Welcome to your organization’s analytics overview. Gain insights into usage, engagement, and performance metrics across your workspace.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#EC7FA9] to-[#BE5985] mx-auto mt-4 rounded" />
      </header>

      {/* Loading State */}
      {loading && (
        <div className="py-40 text-center text-lg text-[#BE5985]/70 font-semibold animate-pulse">
          Loading analytics...
        </div>
      )}

      {!loading && (
        <>
          {/* Overview Summary */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[#BE5985]">
            <div className="flex items-center gap-4 bg-white border-2 border-[#EC7FA9]/40 shadow-md px-8 py-6 w-64 justify-center">
              <Users className="h-8 w-8 text-[#DB5F9A]" />
              <div>
                <p className="text-4xl font-bold">{userCount}</p>
                <p className="text-sm text-[#A03768]/70 font-medium">Total Users</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border-2 border-[#EC7FA9]/40 shadow-md px-8 py-6 w-64 justify-center">
              <TrendingUp className="h-8 w-8 text-[#DB5F9A]" />
              <div>
                <p className="text-4xl font-bold">{totalShares}</p>
                <p className="text-sm text-[#A03768]/70 font-medium">Total Shares</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border-2 border-[#EC7FA9]/40 shadow-md px-8 py-6 w-64 justify-center">
              <Activity className="h-8 w-8 text-[#DB5F9A]" />
              <div>
                <p className="text-4xl font-bold">87%</p>
                <p className="text-sm text-[#A03768]/70 font-medium">Engagement Rate</p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-12">
            {/* Daily Logins */}
            <ChartCard title="Daily Logins (Oct)">
              <Bar
                data={{ labels: dateLabels, datasets: [{ label: 'Logins', data: dailyLoginCounts, backgroundColor: '#EC7FA9' }] }}
                options={{
                  animation: { duration: 700 },
                  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 30 } },
                  plugins: { legend: { display: false } },
                }}
                height={230}
              />
            </ChartCard>

            {/* Share Feature Usage */}
            <ChartCard title="Share Feature Usage">
              <Line
                data={{
                  labels: dateLabels,
                  datasets: [
                    {
                      label: 'Shares',
                      data: shareFeatureUsage,
                      borderColor: '#BE5985',
                      backgroundColor: 'rgba(190,89,133,0.3)',
                      fill: true,
                      tension: 0.35,
                    },
                  ],
                }}
                options={{
                  animation: { duration: 700 },
                  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 15 } },
                }}
                height={230}
              />
            </ChartCard>

            {/* Alerts by Risk Level */}
            <ChartCard title="Alerts by Risk Level">
              <Pie data={alertRiskData} options={{ animation: { duration: 700 } }} height={230} />
            </ChartCard>

            {/* Average Mood Index */}
            <ChartCard title="Average Mood Index">
              <Radar
                data={avgMoodData}
                options={{ animation: { duration: 700 }, scales: { r: { min: -1, max: 1 } } }}
                height={230}
              />
            </ChartCard>

            {/* Monthly Logins */}
            <ChartCard title="Monthly Logins">
              <Bar
                data={monthlyLoginData}
                options={{
                  indexAxis: 'y',
                  animation: { duration: 700 },
                  scales: { x: { beginAtZero: true }, y: { grid: { display: false } } },
                }}
                height={200}
              />
            </ChartCard>

            {/* User Active Time */}
            <ChartCard title="User Active Times">
              <Bubble
                data={bubbleData}
                options={{
                  animation: { duration: 700 },
                  scales: {
                    x: { title: { display: true, text: 'Hour of Day' }, min: 0, max: 23 },
                    y: { title: { display: true, text: 'Minute' }, min: 0, max: 30 },
                  },
                  plugins: { legend: { display: false } },
                }}
                height={230}
              />
            </ChartCard>
          </div>
        </>
      )}
    </section>
  )
}

/* ✅ Small helper component for cleaner chart layout */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-[#EC7FA9]/50 shadow-md hover:shadow-lg transition-all duration-300 p-6 rounded-md">
      <h2 className="mb-4 font-semibold text-[#BE5985] text-lg uppercase tracking-wide border-b border-[#EC7FA9]/30 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
