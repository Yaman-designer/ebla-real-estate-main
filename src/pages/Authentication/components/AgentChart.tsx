import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { getAgentStats } from "../../../helpers/espocrm/propertyService";

const AgentChart = ({ userId, filter }: { userId: string; filter: string }) => {
    const [chartData, setChartData] = useState<{
        series: { name: string; type: string; data: number[] }[];
        categories: string[];
    }>({
        series: [],
        categories: []
    });
    const [loading, setLoading] = useState(false);

    // chart re-render on theme change
    const selectLayoutThemeType = createSelector(
        (state: any) => state.Layout,
        (layoutThemeType) => layoutThemeType.layoutThemeType
    );
    const layoutThemeType = useSelector(selectLayoutThemeType);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        getAgentStats(userId, filter || 'ALL')
            .then((data: any) => {
                processData(data);
            })
            .catch(err => {
                console.error("Chart data fetch failed", err);
                setChartData({ series: [], categories: [] });
            })
            .finally(() => setLoading(false));
    }, [userId, filter, layoutThemeType]);

    const processData = (data: any) => {
        if (!data || !data.reportData || !data.grouping) {
            setChartData({ series: [], categories: [] });
            return;
        }

        const grouping = data.grouping;
        const dates: string[] = grouping[0] || [];
        const reportData = data.reportData;

        if (dates.length === 0) {
            setChartData({ series: [], categories: [] });
            return;
        }

        // Calculate series data
        const rentData = dates.map(date => reportData[date]?.['Rent']?.['COUNT:id'] || 0);
        const saleData = dates.map(date => reportData[date]?.['Sale']?.['COUNT:id'] || 0);
        const totalData = dates.map((_, i) => rentData[i] + saleData[i]);

        const newSeries = [
            {
                name: 'Total Property',
                type: 'column',
                data: totalData
            },
            {
                name: 'Property Rent',
                type: 'area',
                data: rentData
            },
            {
                name: 'Property Sold',
                type: 'line',
                data: saleData
            }
        ];

        setChartData({
            series: newSeries,
            categories: dates
        });
    };

    const options = useMemo(() => ({
        chart: {
            height: 400,
            type: 'line' as const,
            stacked: false,
            toolbar: {
                show: false,
            }
        },
        stroke: {
            width: [0, 2, 3],
            curve: 'smooth' as const
        },
        plotOptions: {
            bar: {
                columnWidth: '25%'
            }
        },
        fill: {
            opacity: [1, 0.08, 1],
            gradient: {
                inverseColors: false,
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100]
            }
        },
        legend: {
            show: true,
            position: 'top' as const,
            horizontalAlign: 'right' as const,
        },
        xaxis: {
            type: 'category' as const,
            categories: chartData.categories,
            labels: {
                formatter: (val: string) => {
                    if (!val) return val;
                    const parts = String(val).split('-');
                    if (parts.length === 2) {
                        const date = new Date(`${parts[0]}-${parts[1]}-01`);
                        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    }
                    return val;
                }
            }
        },
        markers: {
            size: 0
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        colors: ['#3762ea', '#5fd0f3', '#f06548'] // Total (Blue), Rent (Light Blue), Sale (Red)
    }), [chartData.categories]);

    // Check if we have any data
    const hasData = chartData.series.some(s => s.data.some(v => v > 0));

    return (
        <React.Fragment>
            {loading ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : hasData ? (
                <ReactApexChart
                    options={options}
                    series={chartData.series}
                    className="apex-charts"
                    type="line"
                    height={400}
                />
            ) : (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#878a99' }}>
                    <i className="ri-bar-chart-2-line fs-2 me-2"></i>
                    <span className="fs-5">No data available for this period</span>
                </div>
            )}
        </React.Fragment>
    );
};

export default AgentChart;
