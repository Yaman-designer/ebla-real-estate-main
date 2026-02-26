import React, {useState, useEffect} from 'react'
import {Card, Col, Table, Placeholder} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';

const ESPO_URL = process.env.REACT_APP_ESPOCRM_URL || '';

interface AgentItem {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
    avatarId: string | null;
    avatarName: string | null;
    createdById: string;
    shortCode: string | null;
}

interface AgentListResponse {
    list: AgentItem[];
    total: number;
    columns: string[];
    columnsData: Record<string, any>;
}

const getAvatarUrl = (agent: AgentItem): string | null => {
    if (agent.avatarId) {
        return `${ESPO_URL}/?entryPoint=avatar&size=small&id=${agent.id}`;
    }
    return null;
};

const AgentList = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const endpoint = '/Report/action/runList?id=698f4f854686cf1ab&maxSize=6&offset=0&orderBy=createdAt&order=desc';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resp = await EspoCrmClient.get<AgentListResponse>(endpoint);
                setAgents(resp?.list ?? []);
            } catch (err: any) {
                console.error('Failed to fetch agent list:', err);
                setAgents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Col lg={6}>
                <Card>
                    <Card.Header className="d-flex align-items-center">
                        <Card.Title as="h4" className="mb-0 flex-grow-1">Agent List</Card.Title>
                        <div className="flex-shrink-0">
                            <Link to={"/apps-real-estate-agent-list"} className="text-muted">View All <i
                                className="bi bi-chevron-right align-baseline"></i></Link>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-4">
                        <div className="table-responsive table-card">
                            <Table className="table-borderless table-centered align-middle table-nowrap mb-0">
                                <tbody>
                                {loading ? (
                                    // Loading placeholders
                                    [...Array(6)].map((_, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-2">
                                                        <Placeholder as="div" animation="glow">
                                                            <Placeholder className="avatar-xxs rounded-circle"/>
                                                        </Placeholder>
                                                    </div>
                                                    <Placeholder as="div" animation="glow" className="flex-grow-1">
                                                        <Placeholder xs={8}/>
                                                    </Placeholder>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    (agents || []).map((item: AgentItem, key: number) => {
                                        const avatarUrl = getAvatarUrl(item);
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0 me-2">


                                                            {/*remove this after fix avatar image*/}
                                                            <div
                                                                className="avatar-xxs rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary">
                                                                <i className="bi bi-person-fill"></i>
                                                            </div>

                                                            {/*{avatarUrl ? (*/}
                                                            {/*    <img src={avatarUrl} alt='avatar' className="avatar-xxs rounded-circle" />*/}
                                                            {/*) : (*/}
                                                            {/*    <div className="avatar-xxs rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary">*/}
                                                            {/*        <i className="bi bi-person-fill"></i>*/}
                                                            {/*    </div>*/}
                                                            {/*)}*/}
                                                        </div>
                                                        <div className="flex-grow-1">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td>{item.shortCode || '-'}</td>
                                                <td>
                                                    {item.phoneNumber || '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default AgentList;
