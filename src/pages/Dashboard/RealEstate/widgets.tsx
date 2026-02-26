import React, {useState, useEffect} from 'react'
import {Card, Col} from 'react-bootstrap';
import CountUp from 'react-countup';

import {WidgetsChart} from './charts'
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';


interface ChartProps {
    total?: number;
}

interface WidgetsProps {
    periodData?: object;
    dataColor?: string;
    name: string;
    value: number;
    loading?: boolean;
    total?: number
}

const Widgets: React.FC<WidgetsProps> = ({
                                             dataColor = '["--tb-success"]',
                                             name = "Name",
                                             value = 0,
                                             loading = false,
                                             total = 100
                                         }) => {

    const chartData = (value / total * 100);
    return (
        <React.Fragment>

            <Col xxl={3} md={6}>
                <Card>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <div className="d-flex flex-column h-100">
                                    <p className="fs-md text-muted mb-4">{name}</p>
                                    <h3 className="mb-0 mt-auto">
                                        {loading ? (
                                            <span className="placeholder-glow">
                                                    <span className="placeholder col-6"></span>
                                                </span>
                                        ) : (
                                            <>
                                                    <span>
                                                        <CountUp start={0} end={value} decimals={0}/> {" "}
                                                    </span>
                                                <small className={"text-success mb-0 fs-xs"}>
                                                    <i className={"bi bi-arrow-up me-1"}></i> {'12.33%'}
                                                </small>
                                            </>
                                        )}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <WidgetsChart periodData={[chartData]} dataColors={dataColor}/>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    );
};


const ResidentialProperties: React.FC<ChartProps> = ({
                                                         total = 100,
                                                     }) => {
    const [value, setValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const endpoint = '/Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Residential&offset=0&maxSize=20';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                const total = resp?.total ?? 0;
                setValue(total);
            } catch (err: any) {
                console.error('Failed to fetch ResidentialProperties data:', err);
                setValue(0);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Widgets total={total} name={'Οικιστικά ακίνητα'} value={value} loading={loading}></Widgets>
    )
}

const ProfessionalSpaces: React.FC<ChartProps> = ({
                                                      total = 100,
                                                  }) => {
    const [value, setValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const endpoint = '/Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Commercial&offset=0&maxSize=20';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                const total = resp?.total ?? 0;
                setValue(total);
            } catch (err: any) {
                console.error('Failed to fetch ProfessionalSpaces data:', err);
                setValue(0);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Widgets total={total} name={'Επαγγελματικοί χώροι'} value={value} dataColor={'["--tb-warning"]'} loading={loading}></Widgets>
    )
}

const Polts: React.FC<ChartProps> = ({
                                         total = 100,
                                     }) => {
    const [value, setValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const endpoint = '/Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Land&offset=0&maxSize=20';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                const total = resp?.total ?? 0;
                setValue(total);
            } catch (err: any) {
                console.error('Failed to fetch Polts data:', err);
                setValue(0);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Widgets total={total} name={'Οικόπεδα'} value={value} dataColor={'["--tb-primary"]'}
                 loading={loading}></Widgets>
    )
}

const MyProperties: React.FC<ChartProps> = ({
                                                total = 100,
                                            }) => {
    const [value, setValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const endpoint = '/Report/action/runList?id=690f318391079ee85';

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                const total = resp?.total ?? 0;
                setValue(total);
            } catch (err: any) {
                console.error('Failed to fetch MyProperties data:', err);
                setValue(0);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Widgets total={total} name={'Τα ακίνητα μου'} value={value} dataColor={'["--tb-dark"]'}
                 loading={loading}></Widgets>
    )
}

const PropertiesWidgets = () => {
    const [allProperties, setAllProperties] = useState<number>(0);
    const endpoint = '/Report/action/run?id=6992e8d5d4278c0b1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                const total = resp?.sums?.['COUNT:id'] ?? 0;
                setAllProperties(total);
            } catch (err: any) {
                console.error('Failed to fetch total properties count:', err);
                setAllProperties(0);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <ResidentialProperties total={allProperties}/>
            <ProfessionalSpaces total={allProperties}/>
            <Polts total={allProperties}/>
            <MyProperties total={allProperties}/>
        </>
    )
}


export {PropertiesWidgets};
