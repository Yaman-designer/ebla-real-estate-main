import React, {useEffect, useState} from 'react';
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import CountUp from 'react-countup';
import Flatpickr from 'react-flatpickr';

import { IncomeChart, RevenueChart } from './charts';
import getChartColorsArray from "../../../Common/ChartsDynamicColor";
import {createSelector} from "reselect";
import {useSelector} from "react-redux";
import ReactApexChart from "react-apexcharts";
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';


// ============================================
// GLOBAL CHART OPTIONS
// ============================================
interface GlobalChartOptions {
    height?: number;
    type?: 'area' | 'line' | 'bar';
    strokeWidth?: number;
    strokeCurve?: 'smooth' | 'straight' | 'stepline';
    fillOpacity?: string;
    showToolbar?: boolean;
    showDataLabels?: boolean;
    labelsRotate?: number;
    showAxisTicks?: boolean;
    showAxisBorder?: boolean;
}

const defaultChartOptions: GlobalChartOptions = {
    height: 328,
    type: 'area',
    strokeWidth: 2,
    strokeCurve: 'smooth',
    fillOpacity: '0.01',
    showToolbar: false,
    showDataLabels: false,
    labelsRotate: -90,
    showAxisTicks: true,
    showAxisBorder: true,
};

// Build ApexCharts options from global config
const buildChartOptions = (
    categories: string[],
    colors: string[],
    customOptions: Partial<GlobalChartOptions> = {}
): any => {
    const opts = { ...defaultChartOptions, ...customOptions };

    return {
        chart: {
            height: opts.height,
            type: opts.type,
            toolbar: {
                show: opts.showToolbar
            }
        },
        fill: {
            opacity: opts.fillOpacity,
        },
        dataLabels: {
            enabled: opts.showDataLabels
        },
        stroke: {
            width: opts.strokeWidth,
            curve: opts.strokeCurve
        },
        colors: colors,
        xaxis: {
            categories: categories,
            labels: {
                rotate: opts.labelsRotate
            },
            axisTicks: {
                show: opts.showAxisTicks,
            },
            axisBorder: {
                show: opts.showAxisBorder,
                stroke: {
                    width: 1
                },
            },
        }
    };
};


// ============================================
// GLOBAL FETCH FUNCTION FOR REPORT DATA
// ============================================
interface ReportDataResult {
    total: number;
    series: any[];
    categories: string[];
    error: string | null;
}

/**
 * Fetch report data from EspoCRM
 * @param endpoint - The API endpoint URL
 * @param seriesName - Name for the series (e.g., 'Property Rent')
 * @param sumKey - Key to extract total from sums (default: 'COUNT:id')
 * @returns Promise with total, series, categories, and error
 */
const fetchReportData = async (
    endpoint: string,
    seriesName: string = 'Data',
    sumKey: string = 'COUNT:id'
): Promise<ReportDataResult> => {
    try {
        const resp = await EspoCrmClient.get<any>(endpoint);

        // Get total from sums
        const total = resp?.sums?.[sumKey] ?? 0;

        // Get chart data
        const grouping = resp?.grouping ?? [];
        const reportData = resp?.reportData ?? {};

        // Extract labels from grouping
        const labels: string[] = Array.isArray(grouping[0])
            ? grouping[0]
            : (Array.isArray(grouping) ? grouping : []);

        // Build data array in the same order as labels
        const dataArr = labels.map((label: string) => {
            const entry = reportData[label];
            if (!entry) return 0;
            const raw = entry[sumKey] ?? Object.values(entry)[0];
            return Number(raw ?? 0);
        });

        return {
            total,
            series: [{ name: seriesName, data: dataArr }],
            categories: labels,
            error: null
        };
    } catch (err: any) {
        console.error(`Failed to fetch report data from ${endpoint}:`, err);
        return {
            total: 0,
            series: [{ name: seriesName, data: [] }],
            categories: [],
            error: err?.message || 'Failed to fetch data'
        };
    }
};

/**
 * Custom hook for fetching report data
 * @param endpoint - The API endpoint URL
 * @param seriesName - Name for the series
 * @param sumKey - Key to extract total from sums
 */
const useReportData = (endpoint: string, seriesName: string = 'Data', sumKey: string = 'COUNT:id') => {
    const [total, setTotal] = useState<number>(0);
    const [series, setSeries] = useState<any[]>([{ name: seriesName, data: [] }]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            const result = await fetchReportData(endpoint, seriesName, sumKey);

            setTotal(result.total);
            setSeries(result.series);
            setCategories(result.categories);
            setError(result.error || "");
            setLoading(false);
        };

        loadData();
    }, [endpoint, seriesName, sumKey]);

    return { total, series, categories, loading, error };
};


// ============================================
// CHART COMPONENTS
// ============================================
interface ChartProps {
    dataColors: string;
    series: any[];
    categories: string[];
    loading: boolean;
    error: string;
    chartOptions?: Partial<GlobalChartOptions>;
}

// Reusable Area Chart component
const AreaChart = ({ dataColors, series, categories, loading, error, chartOptions = {} }: ChartProps) => {
    const chartColors = getChartColorsArray(dataColors);

    // chart re-render
    const selectLayoutThemeType = createSelector(
        (state: any) => state.Layout,
        (layoutThemeType) => layoutThemeType.layoutThemeType
    );

    const layoutThemeType = useSelector(selectLayoutThemeType);

    useEffect(() => {
        document.getElementsByClassName('apex-charts');
    }, [layoutThemeType]);

    const options = buildChartOptions(categories, chartColors, chartOptions);

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: chartOptions.height || defaultChartOptions.height }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-danger text-center" style={{ height: chartOptions.height || defaultChartOptions.height }}>
                {error}
            </div>
        );
    }

    return (
        <React.Fragment>
            <ReactApexChart
                options={options}
                series={series}
                height={chartOptions.height || defaultChartOptions.height}
                type={chartOptions.type || defaultChartOptions.type}
                className="apex-charts"
            />
        </React.Fragment>
    );
};

// PropertyRentChart uses the reusable AreaChart
const PropertyRentChart = (props: ChartProps) => {
    return <AreaChart {...props} />;
};

// PropertySellChart uses the reusable AreaChart
const PropertySellChart = (props: ChartProps) => {
    return <AreaChart {...props} />;
};


// ============================================
// MAIN COMPONENT
// ============================================
const RevenueOverview = () => {
    // Use the custom hook for Property Rent data
    const propertyRent = useReportData(
        '/Report/action/run?id=698ecef207ceaf4cb&where=&data=',
        'Property Rent'
    );

    // Use the custom hook for Property Sell data
    const propertySell = useReportData(
        '/Report/action/run?id=698f44189781169e0&where=&data=',
        'Property Sell'
    );

    return (
        <React.Fragment>
            <Col xxl={8}>
                <Card>
                    <Card.Header className="d-flex align-items-center">
                        <h5 className="card-title flex-grow-1 mb-0">Revenue Overview</h5>
                        <div className="flex-shrink-0">
                            <Flatpickr
                                className="form-control form-control-sm"
                                id="date"
                                name="date"
                                placeholder="Select date"
                                options={{
                                    mode: "range",
                                    dateFormat: 'd M, Y',
                                    defaultDate: "01 Feb, 2023 to 28 Feb, 2023"
                                }}
                            />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Tab.Container defaultActiveKey="1">
                            <Row className="align-items-center">
                                <Col lg={3}>
                                    <Nav className="flex-column nav-light nav-pills gap-3" >
                                        <Nav.Link eventKey='1' className="d-flex p-2 gap-3" id="revenue-tab">
                                            <div className="avatar-sm flex-shrink-0">
                                                <div className="avatar-title rounded bg-warning-subtle text-warning fs-2xl">
                                                    <i className="bi bi-coin"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="text-reset"><CountUp end={2478} prefix='$' suffix='M' separator=',' /></h5>
                                                <p className="mb-0">Total Revenue</p>
                                            </div>
                                        </Nav.Link>
                                        <Nav.Link eventKey='2' className="d-flex p-2 gap-3" id="income-tab">
                                            <div className="avatar-sm flex-shrink-0">
                                                <div className="avatar-title rounded bg-success-subtle text-success fs-2xl">
                                                    <i className="bi bi-coin"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="text-reset"><CountUp prefix='$' end={14587.37} decimals={2} separator=',' /></h5>
                                                <p className="mb-0">Total Income</p>
                                            </div>
                                        </Nav.Link>
                                        <Nav.Link eventKey='3' className="d-flex p-2 gap-3" id="property-sell-tab" >
                                            <div className="avatar-sm flex-shrink-0">
                                                <div className="avatar-title rounded bg-danger-subtle text-danger fs-2xl">
                                                    <i className="bi bi-coin"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="text-reset">
                                                    {propertySell.loading ? (
                                                        <span className="placeholder-glow"><span className="placeholder col-6"></span></span>
                                                    ) : (
                                                        <CountUp end={propertySell.total} separator=',' />
                                                    )}
                                                </h5>
                                                <p className="mb-0">Property Sell</p>
                                            </div>
                                        </Nav.Link>
                                        <Nav.Link eventKey='4' className="d-flex p-2 gap-3" id="_-tab" >
                                            <div className="avatar-sm flex-shrink-0">
                                                <div className="avatar-title rounded bg-primary-subtle text-primary fs-2xl">
                                                    <i className="bi bi-coin"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="text-reset">
                                                    {propertyRent.loading ? (
                                                        <span className="placeholder-glow"><span className="placeholder col-6"></span></span>
                                                    ) : (
                                                        <CountUp end={propertyRent.total} separator=',' />
                                                    )}
                                                </h5>
                                                <p className="mb-0">Property Rent</p>
                                            </div>
                                        </Nav.Link>
                                    </Nav>
                                </Col>
                                <Col lg={9}>
                                    <Tab.Content className="text-muted">
                                        <Tab.Pane eventKey='1' id="revenue" role="tabpanel">
                                            <RevenueChart dataColors='["--tb-primary"]' />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='2' id="income" role="tabpanel">
                                            <IncomeChart dataColors='["--tb-success"]' />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='3' id="property-Sell" role="tabpanel">
                                            <PropertySellChart
                                                dataColors='["--tb-danger"]'
                                                series={propertySell.series}
                                                categories={propertySell.categories}
                                                loading={propertySell.loading}
                                                error={propertySell.error}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='4' id="propetry-rent" role="tabpanel">
                                            <PropertyRentChart
                                                dataColors='["--tb-info"]'
                                                series={propertyRent.series}
                                                categories={propertyRent.categories}
                                                loading={propertyRent.loading}
                                                error={propertyRent.error}
                                            />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RevenueOverview;
