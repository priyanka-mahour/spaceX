import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import Cards from "./cards/index";
import { connect } from 'react-redux';

function Layout(props) {
    const [showMoreCount, setShowMoreCount] = useState(0);
    const [loader, setLoader] = useState(false);
    let limit = 20;
    const { setData, setAllData, page, data, allData } = props;
    const getData = (param) => {
        let url = "https://api.spacexdata.com/v3/history";
        if (window.location.href.includes("address") || param === "address") {
            url = "https://api.spacexdata.com/v3/payloads"
        }
        setLoader(true);
        axios.get(url)
            .then(res => {
                setAllData(res.data);
                setData(res.data.slice(0, limit));
                setShowMoreCount(res.data.length - limit);
                setLoader(false);
                document.getElementsByTagName("input")[0].value = "";
            })
            .catch(e => {
                console.error("Error:", e);
                setLoader(false)
            })
    }

    useEffect(() => {
        return () => {
            typeof window != "undefined" && (window.onscroll = e => {
                // called when the window is scrolled.  
                let searchInput = document.getElementsByClassName("header") && document.getElementsByClassName("header")[0]
                if (typeof window != "undefined" && window.pageYOffset > 40) {
                    searchInput && searchInput.classList.add("searchShadow")
                } else {
                    searchInput && searchInput.classList.remove("searchShadow")
                }
            })
        }
    }, [props, window.location.href])

    const search = (e) => {
        let searchQuery = document.getElementsByTagName("input")[0].value.toLowerCase();
        let found = [];
        if (searchQuery.length > 0) {
            found = allData.filter((el) => {
                return window.location.href.includes("history") ? el.title.toLowerCase().indexOf(searchQuery) > -1 : el.payload_id.toLowerCase().indexOf(searchQuery) > -1
            });
            setData(found.slice(0, limit));
            setAllData(found);
            setShowMoreCount(found.length - limit)
        } else {
            getData()
        }
    }

    const debounce = (fn, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn()
            }, delay)
        }
    }

    const searchFn = debounce(search, 300)

    const clearData = () => {
        getData()
        document.getElementsByTagName("input")[0].value = "";
    }

    return (
        <div>
            <Router>
                <div className="header">
                    <div className="width flex justifySpaceBtwn">
                        <nav className="flex padding tabs justifySpaceBtwn">
                            <li onClick={getData} className={window.location.href.includes("history") && "magentaColor"}>
                                <Link to="/history">History</Link>
                            </li>
                            <li onClick={() => { getData("address") }} className={window.location.href.includes("address") && "magentaColor"}>
                                <Link to="/address">Address</Link>
                            </li>
                            {/* <span className={`slider ${window.location.href.includes("address") && "address"}`}></span> */}
                        </nav>
                        <div className="inputBox">
                            <input className="input" placeholder="Search" onChange={(e) => searchFn(e)} />
                            {typeof document.getElementsByTagName("input") !== "undefined" && typeof document.getElementsByTagName("input")[0] !== "undefined" && document.getElementsByTagName("input")[0].value.length > 0 &&
                                <span className="crossBtn" onClick={clearData}>X</span>
                            }
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path="/history">
                        <Cards loader={loader} setLoader={setLoader} page={page} showMoreCount={showMoreCount} setShowMore={setShowMoreCount} />
                    </Route>
                    <Route path="/address">
                        <Cards loader={loader} setLoader={setLoader} page={page} showMoreCount={showMoreCount} setShowMore={setShowMoreCount} />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        data: state.data,
        allData: state.allData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setData: (data) => dispatch({ type: "SET_DATA", data }),
        setAllData: (data) => dispatch({ type: "SET_ALL_DATA", data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
