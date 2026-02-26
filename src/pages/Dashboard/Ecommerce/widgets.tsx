import React, {useEffect, useState} from 'react'
import {Card} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';

// Import Images
import EspoCrmClient from '../../../helpers/espocrm/EspoCrmClient';

const SystemUpdates = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const endpoint = 'Report/action/runList?id=693aa081221eb7b84&offset=0&maxSize=20';

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const resp = await EspoCrmClient.get<any>(endpoint);
                if (!mounted) return;
                const list = (resp?.list ?? []).slice();
                // sort by dateEnd desc so most recent updates are shown first
                list.sort((a: any, b: any) => {
                    const da = a?.dateEnd ? new Date(a.dateEnd.replace(' ', 'T')).getTime() : 0;
                    const db = b?.dateEnd ? new Date(b.dateEnd.replace(' ', 'T')).getTime() : 0;
                    return db - da;
                });
                setItems(list);
            } catch (e: any) {
                if (!mounted) return;
                setError(e?.message || 'Failed to fetch system updates');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <React.Fragment>
            <Card className="card-height-100">
                <Card.Header className="d-flex">
                    <Card.Title as="h5" className="flex-grow-1 mb-0">Ενημερώσεις Συστήματος</Card.Title>
                    {/*<div className="flex-shrink-0">*/}
                    {/*    <Link to="#" className="btn btn-subtle-info btn-sm">View All <i className="ph-caret-right align-middle"></i></Link>*/}
                    {/*</div>*/}
                </Card.Header>
                <Card.Body className="px-0">
                    {loading ? (
                        <div className="px-3" style={{height: 258}}>
                            <div className="d-flex align-items-center justify-content-center h-100">Loading...</div>
                        </div>
                    ) : error ? (
                        <div className="px-3 text-danger">{error}</div>
                    ) : (
                        <SimpleBar className="px-3" style={{height: "258px"}}>
                            <div className="acitivity-timeline acitivity-main">
                                {items.map((it: any) => (
                                    <div key={it.id} className="acitivity-item d-flex">
                                        <div className="flex-shrink-0">
                                            <div className="avatar-xs acitivity-avatar">
                                                <div className="avatar-title rounded-circle bg-info-subtle text-info">
                                                    <i className="ri-refresh-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-1 lh-base">{it.description}</h6>
                                            <p className="text-muted mb-2">{it.parentName ?? ''}</p>
                                            <small
                                                className="mb-0 text-muted">{it.dateEnd ? new Date(it.dateEnd.replace(' ', 'T')).toLocaleString() : ''}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                </Card.Body>
            </Card>
        </React.Fragment>
    );

}



export {SystemUpdates};

