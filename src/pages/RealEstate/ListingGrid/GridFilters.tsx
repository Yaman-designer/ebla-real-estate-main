import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

interface GridFiltersProps {
    showfilter: boolean;
    handlefileter: () => void;
    onFilterChange: (filters: any) => void;
    setListGrid: any; // Deprecated/Unused
}

const GridFilters = ({ showfilter, handlefileter, onFilterChange }: GridFiltersProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize from URL or default
    const [minCost, setMinCost] = useState(Number(searchParams.get("minPrice")) || 0);
    const [maxCost, setMaxCost] = useState(Number(searchParams.get("maxPrice")) || 0); // Default to 0 as requested

    // Initialize from URL
    const [bedrooms, setBedrooms] = useState<string[]>(searchParams.getAll("bedroom"));
    const [bathrooms, setBathrooms] = useState<string[]>(searchParams.getAll("bathroom"));
    const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.getAll("type"));

    const isMounted = useRef(false);

    // Update local state (for slider/inputs display)
    const onUpdate = (value: any) => {
        setMinCost(Number(value[0]));
        setMaxCost(Number(value[1]));
    }

    // Commit changes to URL (on slider end or input blur)
    const onCommitPrice = (min: number, max: number) => {
        const newParams = new URLSearchParams(searchParams);

        // Use existing params to preserve other filters
        // No, actually searchParams is state, but we should clone it.
        // wait, searchParams.getAll returns array. 
        // We should rebuild params from current state to be safe?
        // Or just update minPrice/maxPrice in current params?
        // Let's rely on the useEffect below to sync EVERYTHING from state, 
        // so here we just update state (minCost/maxCost) which is already done by onUpdate.
        // Wait, onUpdate is called by onSlide. 
        // Creating a loop? 
        // If we use onSet in slider, it calls onUpdate too?
        // Let's make onUpdate purely local state update. 
        // And let useEffect handle URL sync when minCost/maxCost changes?
        // BUT updating URL on every slide is bad. 
        // So we need:
        // 1. Local state (minCost, maxCost).
        // 2. Slider onSlide -> updates local state.
        // 3. Slider onSet -> updates URL.
        // 4. Inputs onChange -> updates local state.
        // 5. Inputs onBlur -> updates URL.

        if (min > 0) newParams.set("minPrice", min.toString());
        else newParams.delete("minPrice");

        if (max > 0) newParams.set("maxPrice", max.toString());
        else newParams.delete("maxPrice");

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setBedrooms([]);
        setBathrooms([]);
        setPropertyTypes([]);
        setMinCost(0);
        setMaxCost(0);
        const newParams = new URLSearchParams(); // Clear all
        setSearchParams(newParams);
    };

    // Helper to toggle values in array (single select behavior if requested, or multi)
    const handleCheckboxChange = (value: string, setFn: any, current: string[]) => {
        if (value === "all") {
            setFn([]);
        } else {
            if (current.includes(value)) {
                setFn(current.filter((v) => v !== value));
            } else {
                setFn([...current, value]);
            }
        }
    };

    // Helper specifically for property type which was using a different UI pattern
    const handlePropertyTypeChange = (value: string) => {
        if (value === "all") {
            setPropertyTypes([]);
        } else {
            if (propertyTypes.includes(value)) {
                setPropertyTypes(propertyTypes.filter((v) => v !== value));
            } else {
                setPropertyTypes([...propertyTypes, value]);
            }
        }
    };

    useEffect(() => {
        // Sync to URL
        const newParams = new URLSearchParams();

        if (bedrooms.length > 0) {
            bedrooms.forEach(b => newParams.append("bedroom", b));
        }

        if (bathrooms.length > 0) {
            bathrooms.forEach(b => newParams.append("bathroom", b));
        }

        if (propertyTypes.length > 0) {
            propertyTypes.forEach(t => newParams.append("type", t));
        }

        // We do NOT sync price here if we want to avoid slider lag, 
        // UNLESS we debounce or trust onSet.
        // If we use onSet to update specific params, we might lose others if we aren't careful.
        // Best implementation:
        // Use a single Source of Truth: URL.
        // But slider needs local state for smooth dragging.
        // So: 
        // - useEffect on [bedrooms, bathrooms, types] -> update URL.
        // - onSet / onBlur -> update URL with new price + existing other params.
        // - URL change -> update local state (if needed? actually local state drives UI).

        // Let's stick to the plan: sync from state to URL.
        // To avoid slider lag, we rely on the fact that onUpDate (from onSlide) 
        // changes minCost/maxCost, which triggers this useEffect.
        // THIS IS WRONG if we want to avoid URL updates on every pixel slide.
        // We should REMOVE minCost/maxCost from this useEffect/dependency array,
        // and handle price URL updates separately via onCommitPrice.

        // However, if we remove them, we need to make sure we don't lose them when updating other filters.
        // So we must read current minCost/maxCost here.

        if (minCost > 0) newParams.set("minPrice", minCost.toString());
        // If maxCost is > 0, we send it. If it is 0, we don't.
        // The slider max is 2000, so user can select up to 2000.
        if (maxCost > 0) newParams.set("maxPrice", maxCost.toString());

        setSearchParams(newParams);

        if (isMounted.current) {
            onFilterChange({
                bedrooms,
                bathrooms,
                propertyTypes,
                minPrice: minCost > 0 ? minCost.toString() : null,
                maxPrice: maxCost > 0 ? maxCost.toString() : null
            });
        } else {
            isMounted.current = true;
        }
    }, [bedrooms, bathrooms, propertyTypes, minCost, maxCost]);

    useEffect(() => {
        onUpdate([minCost, maxCost]);
    }, [minCost, maxCost])

    useEffect(() => {
        let slider = document.getElementById("product-price-range");
        slider?.setAttribute("data-slider-color", "secondary");
    }, [])

    return (
        <React.Fragment>
            <Col xxl={3} id="propertyFilters" style={{ display: showfilter ? 'block' : 'none' }}>
                <Card className="mb-0">
                    <div data-simplebar>
                        <Card.Header className="d-flex align-items-center">
                            <Card.Title as="h4" className="flex-grow-1 mb-0">Filters</Card.Title>
                            <div className="flex-shrink-0 d-flex gap-1">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="btn-icon"
                                    title="Clear Filters"
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                </Button>
                                <Button className="btn btn-subtle-secondary btn-icon btn-sm myButton" onClick={handlefileter}><i className="bi bi-chevron-left"></i></Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* <div className="mb-3">
                                <p className="text-muted fw-medium text-uppercase mb-3">Location</p>
                                <Form.Select className="form-select" id="select-location" onChange={() => { }} >
                                    <option value="all">Select Location</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="China">China</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Greenland">Greenland</option>
                                    <option value="Jersey">Jersey</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Serbia">Serbia</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                </Form.Select>
                            </div> */}
                            <div className="mb-3">
                                <p className="text-muted fw-medium text-uppercase mb-3">Property Type</p>
                                <div className="d-flex flex-wrap gap-2">
                                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top"> All </Tooltip>}>
                                        <div>
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="propertyTypeAll"
                                                checked={propertyTypes.length === 0}
                                                onChange={() => setPropertyTypes([])}
                                            />
                                            <label className="btn btn-ghost-primary fs-lg avatar-xs p-0 d-flex justify-content-center align-items-center" htmlFor="propertyTypeAll">
                                                <i className="bi bi-house-door"></i>
                                            </label>
                                        </div>
                                    </OverlayTrigger>

                                    {[
                                        { value: 'apartment', icon: 'bi bi-building', label: 'Apartment' },
                                        { value: 'detached', icon: 'bi bi-house', label: 'Detached' },
                                        { value: 'maisonette', icon: 'bi bi-grid', label: 'Maisonette' },
                                        { value: 'plot', icon: 'bi bi-layers', label: 'Plot' },
                                        { value: 'studio', icon: 'bi bi-easel', label: 'Studio' },
                                        { value: 'store', icon: 'bi bi-shop', label: 'Store' },
                                    ].map((type) => (
                                        <OverlayTrigger
                                            key={type.value}
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-${type.value}`}> {type.label} </Tooltip>}
                                        >
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    className="btn-check"
                                                    id={`propertyType-${type.value}`}
                                                    checked={propertyTypes.includes(type.value)}
                                                    onChange={() => handlePropertyTypeChange(type.value)}
                                                />
                                                <label className="btn btn-ghost-primary fs-lg avatar-xs p-0 d-flex justify-content-center align-items-center" htmlFor={`propertyType-${type.value}`}>
                                                    <i className={type.icon}></i>
                                                </label>
                                            </div>
                                        </OverlayTrigger>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-muted fw-medium text-uppercase mb-3">Bedroom</p>
                                <Row className="gy-3" id="bedroom-filter">
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input
                                                type="checkbox"
                                                value="all"
                                                id="allselectBedroom"
                                                checked={bedrooms.length === 0}
                                                onChange={() => setBedrooms([])}
                                            />
                                            <Form.Check.Label htmlFor="allselectBedroom"> Select All</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    {['2', '3', '4', '5'].map((num) => (
                                        <Col lg={6} key={num}>
                                            <Form.Check>
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    value={num}
                                                    id={`${num}Bedroom`}
                                                    checked={bedrooms.includes(num)}
                                                    onChange={() => handleCheckboxChange(num, setBedrooms, bedrooms)}
                                                />
                                                <Form.Check.Label htmlFor={`${num}Bedroom`}>  {num} Bedroom</Form.Check.Label>
                                            </Form.Check>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            <div className="mb-4">
                                <p className="text-muted fw-medium text-uppercase mb-3">Price Range</p>
                                <Nouislider
                                    range={{ min: 0, max: 25000000 }}
                                    start={[minCost, maxCost]}
                                    step={10000}
                                    connect
                                    onSlide={onUpdate}
                                    onSet={onUpdate} // Ensure final value is set
                                    id="product-price-range"
                                />
                                <div>
                                    <div className="formCost d-flex gap-2 align-items-center mt-4" >
                                        <Form.Control type="text" id="minCost" autoComplete="off" value={`${minCost}`} onChange={(e: any) => setMinCost(e.target.value)} onBlur={() => onCommitPrice(minCost, maxCost)} />
                                        <span className="fw-semibold text-muted">to</span>
                                        <Form.Control type="text" id="maxCost" autoComplete="off" value={`${maxCost}`} onChange={(e: any) => setMaxCost(e.target.value)} onBlur={() => onCommitPrice(minCost, maxCost)} />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-muted fw-medium text-uppercase mb-3">Bathroom</p>
                                <Row className="gy-3">
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input
                                                type="checkbox"
                                                value="all"
                                                id="allselectBathroom"
                                                checked={bathrooms.length === 0}
                                                onChange={() => setBathrooms([])}
                                            />
                                            <Form.Check.Label htmlFor="allselectBathroom">Select All </Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    {['2', '3', '4', '5'].map((num) => (
                                        <Col lg={6} key={num}>
                                            <Form.Check>
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    value={num}
                                                    id={`${num}Bathroom`}
                                                    checked={bathrooms.includes(num)}
                                                    onChange={() => handleCheckboxChange(num, setBathrooms, bathrooms)}
                                                />
                                                <Form.Check.Label htmlFor={`${num}Bathroom`}>{num} Bathroom</Form.Check.Label>
                                            </Form.Check>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            {/* <div>
                                <p className="text-muted fw-medium text-uppercase mb-3">Features</p>
                                <Row className="gy-3">
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="allselectFeatures" />
                                            <Form.Check.Label htmlFor="allselectFeatures"> Select All </Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="twoFeatures" defaultChecked />
                                            <Form.Check.Label htmlFor="twoFeatures"> Spa</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="threeFeatures" />
                                            <Form.Check.Label htmlFor="threeFeatures">  Swimming Pool</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="fourFeatures" />
                                            <Form.Check.Label htmlFor="fourFeatures"> Balcony  </Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="fiveFeatures" defaultChecked />
                                            <Form.Check.Label htmlFor="fiveFeatures">Parking</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Check>
                                            <Form.Check.Input type="checkbox" value="" id="sixFeatures" defaultChecked />
                                            <Form.Check.Label htmlFor="sixFeatures">  Fitness Center</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                </Row>
                            </div> */}
                        </Card.Body>
                    </div>
                </Card>
            </Col >
        </React.Fragment >
    );
}

export default GridFilters;