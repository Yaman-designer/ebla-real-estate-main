import React, { useEffect, useState } from 'react'
import { Card, Dropdown } from 'react-bootstrap';
import CountUp from 'react-countup';
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';

interface NumericChartProps {
    reportURL: string;
    icon?: string;
    bgColor?: string;
    textColor?: string;
    name?: string;
    percentage?: number | string;
    percentageClass?: string;
    separator?: string;
}

// Fetch the EspoCRM report and use its `total` field for the chart
const NumericChart: React.FC<NumericChartProps> = ({
    reportURL = '',
    icon = 'ph-house-line',
    bgColor = 'bg-primary-subtle',
    textColor = 'text-primary',
    name = 'TOTAL REVENUE',
    percentage = 0,
    percentageClass = 'text-success',
    separator = ','
}) => {

    // Default initial value (coerce possible string with commas)
    const initialValue = Number(String(percentage).replace(/,/g, '') || 0);

    const [value, setValue] = useState<number>(initialValue);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    // Expected columns as per your requirement

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            // EspoCrmClient.get returns response.data
            const resp = await EspoCrmClient.get<any>(reportURL);

            const total = resp?.total ?? null;

            // Validate response
            const hasTotal = typeof total === 'number' && !Number.isNaN(total);

            if (!hasTotal) {
                setError('Report response missing numeric `total` field');
            } else {
                setValue(Number(total));
            }
        } catch (err: any) {
            setError(err?.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch once on mount
        fetchReport();
        // No deps so it runs once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
                <Card className="card border-0 overflow-hidden">
                    <Card.Body className="p-0">
                                    <Card className='card shadow-none border-end-md border-bottom rounded-0 mb-0'>
                                        <Card.Body>
                                            {/*<Dropdown className="float-end cursor-pointer">*/}
                                            {/*    <Dropdown.Toggle as='a' className="text-reset arrow-none">*/}
                                            {/*        <span className="text-muted fs-lg"><i*/}
                                            {/*            className="mdi mdi-dots-vertical align-middle"></i></span>*/}
                                            {/*    </Dropdown.Toggle>*/}
                                            {/*    <Dropdown.Menu className="dropdown-menu-end">*/}
                                            {/*        <li><Dropdown.Item href="#">Today</Dropdown.Item></li>*/}
                                            {/*        <li><Dropdown.Item href="#">Last Week</Dropdown.Item></li>*/}
                                            {/*        <li><Dropdown.Item href="#">Last Month</Dropdown.Item></li>*/}
                                            {/*        <li><Dropdown.Item href="#">Current Year</Dropdown.Item></li>*/}
                                            {/*    </Dropdown.Menu>*/}
                                            {/*</Dropdown>*/}
                                            <div className="avatar-sm">
                                                <span
                                                    className={"avatar-title " + bgColor + " " + textColor + " rounded-circle fs-3"}>
                                                    <i className={icon}></i>
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-uppercase fw-medium text-muted text-truncate fs-sm">{name}</p>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <h5 className={percentageClass + " mb-0"}>
                                                        <CountUp className="counter-value" start={0} end={Number(value)} separator={separator as string} />
                                                    </h5>
                                                    {loading && <small className="text-muted ms-2">Loading...</small>}
                                                    {error && <small className="text-danger ms-2">Error</small>}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                    </Card.Body>
                </Card>

        </React.Fragment>
    );
};

export default NumericChart;
