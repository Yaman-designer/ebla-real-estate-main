import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { createSelector } from "reselect";
import getChartColorsArray from "Common/ChartsDynamicColor";
import { useSelector } from "react-redux";
import {Card} from "react-bootstrap";
import CountUp from "react-countup";
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';


const VerticalChart = ({ periodData, dataColors, categories = ['S', 'M', 'T', 'W', 'T', 'F', 'S'], showXAxisLabels = true, scale = 'linear', originalValues }: any) => {
    const totalSetudentsColors = getChartColorsArray(dataColors);

    // chart re-render
    const selectLayoutThemeType = createSelector(
        (state: any) => state.Layout,
        (layoutThemeType) => layoutThemeType.layoutThemeType
    );

    const layoutThemeType = useSelector(selectLayoutThemeType);

    useEffect(() => {
        document.getElementsByClassName('apex-charts');
    }, [layoutThemeType]);

    // helper to transform values for better visual spread
    const transformValue = (v: number) => {
        const n = Number(v) || 0;
        if (scale === 'sqrt') return Math.sqrt(n);
        if (scale === 'log') return Math.log10(n + 1);
        if (scale === 'percent') {
            // originalValues expected to be provided in this mode
            const total = Array.isArray(originalValues) ? originalValues.reduce((a: number, b: number) => a + (Number(b) || 0), 0) : 0;
            return total > 0 ? (n / total) * 100 : 0;
        }
        return n; // linear
    };

    // prepare transformed series so visual scale is adjusted but we can show original in tooltips
    const transformedSeries = Array.isArray(periodData)
        ? periodData.map((s: any) => ({
            ...s,
            data: Array.isArray(s.data) ? s.data.map((d: any) => transformValue(d)) : s.data
        }))
        : periodData;

    const options = {
        series: [{
            name: 'Total',
            data: [33, 56, 37, 51, 42, 83, 71]
        }],
        chart: {
            height: 352,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                distributed: true,
            }
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: false,
            padding: {
                top: -15,
                right: 0,
                left: 0,
                bottom: -10
            },
            yaxis: {
                lines: {
                    show: false
                }
            },
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        colors: totalSetudentsColors,
        tooltip: {
            y: {
                formatter: function (val: any, opts: any) {
                    // If originalValues provided, show the original value for the hovered index
                    try {
                        if (Array.isArray(originalValues) && typeof opts?.dataPointIndex === 'number') {
                            const orig = originalValues[opts.dataPointIndex];
                            return orig !== undefined ? String(orig) : String(val);
                        }
                    } catch (e) {
                        // ignore and fallback
                    }
                    return String(val);
                }
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                show: showXAxisLabels,
                rotate: -45,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            show: false,
        },
    };

    return (
        <React.Fragment>
            <ReactApexChart
                options={options}
                series={[...transformedSeries]}
                height="258"
                type="bar"
                className="apex-charts"
            />
        </React.Fragment>
    );
};


const ResidentialChart = () => {
    const [series, setSeries] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);
    const [labelsState, setLabelsState] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // EspoCRM report endpoint requested
    const endpoint = 'Report/action/run?id=693c69a6399f975cb&where=';

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            // EspoCrmClient.get returns response data directly
            const resp = await EspoCrmClient.get<any>(endpoint);

            const grouping = resp?.grouping ?? [];
            const reportData = resp?.reportData ?? {};

            // grouping is expected to be an array of arrays: [ [ '2025-01', ... ] ]
            const labels: string[] = Array.isArray(grouping[0]) ? grouping[0] : (Array.isArray(grouping) ? grouping : []);

            // Build data array in the same order as labels
            const dataArr = labels.map((label: string) => {
                const entry = reportData[label];
                if (!entry) return 0;
                // Prefer known key 'COUNT:id', otherwise take the first numeric value found
                const raw = entry['COUNT:id'] ?? Object.values(entry)[0];
                return Number(raw ?? 0);
            });

            const newSeries = [{ name: '', data: dataArr }];
            const newTotal = dataArr.reduce((acc: number, v: number) => acc + (Number(v) || 0), 0);

            setSeries(newSeries);
            setTotal(newTotal);
            setLabelsState(labels);
         } catch (err: any) {
            setError(err?.message || "Failed to fetch data from EspoCRM");
         } finally {
            setLoading(false);
         }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <Card>
            <Card.Body>Loading...</Card.Body>
        </Card>
    );

    if (error) return (
        <Card>
            <Card.Body className="text-danger">{error}</Card.Body>
        </Card>
    );

    // compute rate between last two values (if available)
    let rateLabel = null;
    try {
        const data = series?.[0]?.data ?? [];
        if (Array.isArray(data) && data.length >= 2) {
            const last = Number(data[data.length - 1] ?? 0);
            const prev = Number(data[data.length - 2] ?? 0);
            const rate = prev === 0 ? (last === 0 ? 0 : 100) : ((last - prev) / (prev || 1)) * 100;
            const isUp = rate >= 0;
            const rateFormatted = Math.abs(Number(rate.toFixed(2)));
            rateLabel = (
                <span className={`badge ${isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} float-end`}>
                    <i className={`bi ${isUp ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i> {rateFormatted}%
                </span>
            );
        }
    } catch (e) {
        // ignore
    }

    return (
        <Card >
            <Card.Body>
                {rateLabel}
                <p className="fs-md text-muted mb-4">Ακίνητα στο σύστημα ανά μήνα</p>
                <h3 className="mb-n3"><span><CountUp start={0} end={total} separator="," /></span></h3>
                <VerticalChart periodData={series} dataColors='["--tb-primary"]' categories={labelsState} />
            </Card.Body>
        </Card>
    )


 }


 const PartnerChart = () => {
    const [series, setSeries] = useState<any>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // EspoCRM report endpoint for partners
    const endpoint = 'Report/action/run?id=693c6a6c96d2c805d&where=&data=';

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const resp = await EspoCrmClient.get<any>(endpoint);

            const groupValueMap = resp?.groupValueMap ?? {};
            const assignedMap = groupValueMap?.assignedUser ?? {};
            const group1Sums = resp?.group1Sums ?? {};

            // keys in group1Sums are the ids (e.g. "34", "52")
            const keys = Object.keys(group1Sums ?? {});

            // Build pairs of label+value, then sort by value descending
            const pairs = keys.map(k => {
                const label = assignedMap[k] ?? k;
                const entry = group1Sums[k] ?? {};
                const value = Number(entry['COUNT:id'] ?? Object.values(entry)[0] ?? 0);
                return { label, value };
            }).sort((a, b) => b.value - a.value);

            const labelsArr = pairs.map(p => p.label);
            const dataArr = pairs.map(p => p.value);

            const newSeries = [{ name: 'Total', data: dataArr }];
            const newTotal = dataArr.reduce((a: number, b: number) => a + (Number(b) || 0), 0);

            setSeries(newSeries);
            setLabels(labelsArr);
            setTotal(newTotal);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch Partner data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <Card>
            <Card.Body>Loading...</Card.Body>
        </Card>
    );

    if (error) return (
        <Card>
            <Card.Body className="text-danger">{error}</Card.Body>
        </Card>
    );

    return (
        <Card>
            <Card.Body>
                <p className="fs-md text-muted mb-4">Απόδοση Συνεργατών (ΓΡΑΦΗΜΑ)</p>
                <h3 className="mb-n3"><span><CountUp start={0} end={total} separator="," /></span></h3>
                {/* Use sqrt scaling for partners to compress large values and make small bars more visible. Keep original values for tooltip. */}
                <VerticalChart periodData={series} dataColors='["--tb-info"]' categories={labels} showXAxisLabels={false} scale={'sqrt'} originalValues={series?.[0]?.data} />
            </Card.Body>
        </Card>
    );

 }

 export { ResidentialChart, PartnerChart };
